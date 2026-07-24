import {
  batchRun,
  idleRun,
  paceRun,
  rateLimitRun,
  retryRun,
} from '@opentf/std';
import { onCleanup, onMount } from '@opentf/web';

// Per-tool identity: accent colour flows through the whole panel via
// --tool-accent, so sliders, buttons, code, and the timeline all stay in sync.
const TOOLS = {
  idle: {
    icon: '⏱️',
    name: 'idleRun',
    tag: 'Debounce',
    desc: 'Delays the call until input stops. Rapid calls keep resetting the timer.',
    hex: '#3b82f6',
    rgb: '59, 130, 246',
  },
  pace: {
    icon: '⚡',
    name: 'paceRun',
    tag: 'Throttle',
    desc: 'Runs at most once per interval, no matter how often it is called.',
    hex: '#8b5cf6',
    rgb: '139, 92, 246',
  },
  batch: {
    icon: '📦',
    name: 'batchRun',
    tag: 'Batching',
    desc: 'Collects calls and processes them together once the limit or delay is hit.',
    hex: '#10b981',
    rgb: '16, 185, 129',
  },
  rate: {
    icon: '🎛️',
    name: 'rateLimitRun',
    tag: 'Rate Limit',
    desc: 'Caps executions within a sliding time window and queues the rest.',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
  },
  retry: {
    icon: '🔄',
    name: 'retryRun',
    tag: 'Reliability',
    desc: 'Re-attempts a failing call using fixed or exponential backoff.',
    hex: '#f43f5e',
    rgb: '244, 63, 94',
  },
};

export default function VisualTools() {
  const host = $ref();

  onMount(() => {
    if (!host) return;

    let activeTab = 'idle';
    let events = [];
    let pendingItems = [];
    const processedBatches = [];
    let rateQueueLength = 0;
    let retryLogs = [];
    let retryStatus = 'idle';
    let debouncedFn = null;
    let throttledFn = null;
    let batchedFn = null;
    let rateLimitedFn = null;
    let animationTimer = null;

    // Controls state
    let idleDelay = 500;
    let idleMaxWait = 0;
    let idleLeading = false;

    let paceInterval = 500;
    let paceLeading = true;
    let paceTrailing = true;

    let batchLimit = 5;
    let batchDelay = 1000;

    let rateLimitVal = 3;
    let ratePeriod = 2000;

    let retryMax = 3;
    let retryDelay = 500;
    let retryBackoff = 'fixed';

    function addTimelineEvent(type, label = '') {
      events.push({
        id: Math.random().toString(36).substr(2, 6),
        type,
        time: Date.now(),
        label,
      });
    }

    function initIdleFn() {
      if (debouncedFn?.cancel) debouncedFn.cancel();
      debouncedFn = idleRun(() => addTimelineEvent('execution'), idleDelay, {
        leading: idleLeading,
        maxWait: idleMaxWait > 0 ? idleMaxWait : undefined,
      });
    }

    function initPaceFn() {
      if (throttledFn?.cancel) throttledFn.cancel();
      throttledFn = paceRun(() => addTimelineEvent('execution'), paceInterval, {
        leading: paceLeading,
        trailing: paceTrailing,
      });
    }

    function initBatchFn() {
      batchedFn = batchRun(
        async (batch) => {
          const batchId = Math.random().toString(36).substr(2, 5).toUpperCase();
          const items = batch.map((args) => args[0]);
          processedBatches.unshift({ id: batchId, items });
          if (processedBatches.length > 5) processedBatches.pop();
          pendingItems = [];
          render();
          return items.map(() => 'ok');
        },
        { limit: batchLimit, delay: batchDelay },
      );
    }

    function initRateLimitFn() {
      rateLimitedFn = rateLimitRun(
        async (id) => {
          rateQueueLength = Math.max(0, rateQueueLength - 1);
          addTimelineEvent('execution', id);
          render();
          return id;
        },
        rateLimitVal,
        ratePeriod,
      );
    }

    initIdleFn();
    initPaceFn();
    initBatchFn();
    initRateLimitFn();

    // Loop for smooth timeline animation
    animationTimer = setInterval(() => {
      if (activeTab === 'idle' || activeTab === 'pace' || activeTab === 'rate') {
        const visualizerEl = host.querySelector('.timeline-visualizer-events');
        if (visualizerEl) {
          const now = Date.now();
          const duration = activeTab === 'rate' ? ratePeriod * 2 : 5000;
          const filtered = events.filter((e) => now - e.time < duration);
          events = filtered;

          visualizerEl.innerHTML = filtered
            .map((e) => {
              const age = (now - e.time) / duration;
              const leftPercent = Math.max(0, 100 - age * 100);
              const cls =
                e.type === 'request' ? 'vt-dot vt-dot--req' : 'vt-dot vt-dot--exec';
              const opacity = Math.max(0, 1 - age * 0.85);
              return `<div class="${cls}" style="left:${leftPercent}%;opacity:${opacity}" title="${e.type} ${e.label || ''}"></div>`;
            })
            .join('');
        }
      }
    }, 30);

    onCleanup(() => {
      clearInterval(animationTimer);
      if (debouncedFn?.cancel) debouncedFn.cancel();
      if (throttledFn?.cancel) throttledFn.cancel();
    });

    function cardHead(tool) {
      return `
        <div class="vt-card-head">
          <div class="vt-h-icon">${tool.icon}</div>
          <div>
            <div class="vt-h-title"><code>${tool.name}</code> · ${tool.tag}</div>
            <div class="vt-h-sub">${tool.desc}</div>
          </div>
        </div>`;
    }

    function visualizer() {
      return `
        <div class="vt-viz">
          <div class="vt-viz-head">
            <span class="vt-viz-title">Live Timeline</span>
            <div class="vt-legend">
              <span class="vt-legend-item"><i class="req"></i>Input call</span>
              <span class="vt-legend-item"><i class="exec"></i>Executed</span>
            </div>
          </div>
          <div class="vt-track">
            <div class="vt-track-line"></div>
            <div class="timeline-visualizer-events"></div>
            <div class="vt-now"></div>
          </div>
        </div>`;
    }

    function render() {
      const tabsHtml = Object.entries(TOOLS)
        .map(
          ([id, t]) =>
            `<button type="button" class="vt-nav ${activeTab === id ? 'is-active' : ''}" data-tab="${id}" style="--item-accent:${t.hex};--item-accent-rgb:${t.rgb}">
              <span class="vt-nav-icon">${t.icon}</span>
              <span class="vt-nav-text">
                <span class="vt-nav-name">${t.name}</span>
                <span class="vt-nav-desc">${t.tag}</span>
              </span>
            </button>`,
        )
        .join('');

      let contentHtml = '';

      if (activeTab === 'idle') {
        contentHtml = `
          <div class="vt-grid">
            <div class="vt-card">
              ${cardHead(TOOLS.idle)}
              <div class="vt-controls">
                <div class="vt-field">
                  <label class="vt-field-label">Delay <span class="vt-field-value">${idleDelay} ms</span></label>
                  <input class="vt-range" type="range" min="100" max="2000" step="100" value="${idleDelay}" id="idle-delay" />
                </div>
                <div class="vt-field">
                  <label class="vt-field-label">Max wait <span class="vt-field-value">${idleMaxWait === 0 ? 'none' : idleMaxWait + ' ms'}</span></label>
                  <input class="vt-range" type="range" min="0" max="5000" step="500" value="${idleMaxWait}" id="idle-maxwait" />
                </div>
                <div class="vt-toggles">
                  <label class="vt-toggle"><input type="checkbox" id="idle-leading" ${idleLeading ? 'checked' : ''} /> Leading edge</label>
                </div>
                <div class="vt-actions">
                  <button type="button" class="vt-btn vt-btn--primary" id="idle-call">▶ Call function</button>
                  <button type="button" class="vt-btn" id="idle-reset">↺ Reset</button>
                </div>
              </div>
              <div class="vt-code">idleRun(fn, <span class="tok">${idleDelay}</span>, { leading: <span class="tok">${idleLeading}</span>${idleMaxWait > 0 ? `, maxWait: <span class="tok">${idleMaxWait}</span>` : ''} })</div>
            </div>
            ${visualizer()}
          </div>`;
      } else if (activeTab === 'pace') {
        contentHtml = `
          <div class="vt-grid">
            <div class="vt-card">
              ${cardHead(TOOLS.pace)}
              <div class="vt-controls">
                <div class="vt-field">
                  <label class="vt-field-label">Interval <span class="vt-field-value">${paceInterval} ms</span></label>
                  <input class="vt-range" type="range" min="100" max="2000" step="100" value="${paceInterval}" id="pace-interval" />
                </div>
                <div class="vt-toggles">
                  <label class="vt-toggle"><input type="checkbox" id="pace-leading" ${paceLeading ? 'checked' : ''} /> Leading</label>
                  <label class="vt-toggle"><input type="checkbox" id="pace-trailing" ${paceTrailing ? 'checked' : ''} /> Trailing</label>
                </div>
                <div class="vt-actions">
                  <button type="button" class="vt-btn vt-btn--primary" id="pace-call">▶ Call function</button>
                  <button type="button" class="vt-btn" id="pace-reset">↺ Reset</button>
                </div>
              </div>
              <div class="vt-code">paceRun(fn, <span class="tok">${paceInterval}</span>, { leading: <span class="tok">${paceLeading}</span>, trailing: <span class="tok">${paceTrailing}</span> })</div>
            </div>
            ${visualizer()}
          </div>`;
      } else if (activeTab === 'batch') {
        contentHtml = `
          <div class="vt-grid">
            <div class="vt-card">
              ${cardHead(TOOLS.batch)}
              <div class="vt-controls">
                <div class="vt-field">
                  <label class="vt-field-label">Limit <span class="vt-field-value">${batchLimit} items</span></label>
                  <input class="vt-range" type="range" min="1" max="20" value="${batchLimit}" id="batch-limit" />
                </div>
                <div class="vt-field">
                  <label class="vt-field-label">Wait delay <span class="vt-field-value">${batchDelay} ms</span></label>
                  <input class="vt-range" type="range" min="0" max="5000" step="500" value="${batchDelay}" id="batch-delay" />
                </div>
                <div class="vt-actions">
                  <button type="button" class="vt-btn vt-btn--primary" id="batch-add">＋ Add to batch</button>
                </div>
              </div>
              <div class="vt-code">batchRun(processor, { limit: <span class="tok">${batchLimit}</span>, delay: <span class="tok">${batchDelay}</span> })</div>
            </div>
            <div class="vt-col">
              <div class="vt-panel">
                <div class="vt-panel-label"><span>Pending batch</span><span>${pendingItems.length} / ${batchLimit}</span></div>
                <div class="vt-chips">
                  ${
                    pendingItems.length > 0
                      ? pendingItems
                          .map((item) => `<span class="vt-chip">${item}</span>`)
                          .join('')
                      : '<div class="vt-empty">No pending items — add one to start filling the batch.</div>'
                  }
                </div>
              </div>
              <div class="vt-panel">
                <div class="vt-panel-label"><span>Processed batches</span></div>
                <div class="vt-batch-list">
                  ${
                    processedBatches.length > 0
                      ? processedBatches
                          .map(
                            (b) =>
                              `<div class="vt-batch-row"><span class="vt-batch-id">#${b.id}</span><span class="vt-batch-items">${b.items.map((i) => `<span>${i}</span>`).join('')}</span></div>`,
                          )
                          .join('')
                      : '<div class="vt-empty">No processed batches yet.</div>'
                  }
                </div>
              </div>
            </div>
          </div>`;
      } else if (activeTab === 'rate') {
        contentHtml = `
          <div class="vt-grid">
            <div class="vt-card">
              ${cardHead(TOOLS.rate)}
              <div class="vt-controls">
                <div class="vt-field">
                  <label class="vt-field-label">Limit <span class="vt-field-value">${rateLimitVal} calls</span></label>
                  <input class="vt-range" type="range" min="1" max="10" value="${rateLimitVal}" id="rate-limit" />
                </div>
                <div class="vt-field">
                  <label class="vt-field-label">Period <span class="vt-field-value">${ratePeriod} ms</span></label>
                  <input class="vt-range" type="range" min="500" max="5000" step="500" value="${ratePeriod}" id="rate-period" />
                </div>
                <div class="vt-actions">
                  <button type="button" class="vt-btn vt-btn--primary" id="rate-call">▶ Request execution</button>
                </div>
                <div class="vt-stat">
                  <span class="vt-panel-label">Queue size</span>
                  <span class="vt-stat-num">${rateQueueLength}</span>
                </div>
              </div>
              <div class="vt-code">rateLimitRun(fn, <span class="tok">${rateLimitVal}</span>, <span class="tok">${ratePeriod}</span>)</div>
            </div>
            ${visualizer()}
          </div>`;
      } else if (activeTab === 'retry') {
        contentHtml = `
          <div class="vt-grid">
            <div class="vt-card">
              ${cardHead(TOOLS.retry)}
              <div class="vt-controls">
                <div class="vt-field">
                  <label class="vt-field-label">Max retries <span class="vt-field-value">${retryMax}</span></label>
                  <input class="vt-range" type="range" min="1" max="10" value="${retryMax}" id="retry-max" />
                </div>
                <div class="vt-field">
                  <label class="vt-field-label">Delay <span class="vt-field-value">${retryDelay} ms</span></label>
                  <input class="vt-range" type="range" min="0" max="2000" step="100" value="${retryDelay}" id="retry-delay" />
                </div>
                <div class="vt-field">
                  <label class="vt-field-label">Strategy</label>
                  <select class="vt-select" id="retry-backoff">
                    <option value="fixed" ${retryBackoff === 'fixed' ? 'selected' : ''}>Fixed delay</option>
                    <option value="exponential" ${retryBackoff === 'exponential' ? 'selected' : ''}>Exponential backoff</option>
                  </select>
                </div>
                <div class="vt-actions">
                  <button type="button" class="vt-btn vt-btn--primary" id="retry-test" ${retryStatus === 'running' ? 'disabled' : ''}>▶ Run retry test</button>
                </div>
              </div>
              <div class="vt-code">retryRun(fn, { retries: <span class="tok">${retryMax}</span>, delay: <span class="tok">${retryDelay}</span>, backoff: <span class="tok">'${retryBackoff}'</span> })</div>
            </div>
            <div class="vt-col">
              <div class="vt-panel">
                <div class="vt-panel-label"><span>Execution status</span><span class="vt-status vt-status--${retryStatus}">${retryStatus}</span></div>
                <div class="vt-logs">
                  ${
                    retryLogs.length > 0
                      ? retryLogs
                          .map(
                            (log) =>
                              `<div class="vt-log ${log.includes('Success') ? 'vt-log--ok' : 'vt-log--fail'}">${log}</div>`,
                          )
                          .join('')
                      : '<div class="vt-empty">No attempts yet — run a test to watch the retries.</div>'
                  }
                </div>
              </div>
            </div>
          </div>`;
      }

      const accent = TOOLS[activeTab];

      host.innerHTML = `
        <div class="vt-root" style="--tool-accent:${accent.hex};--tool-accent-rgb:${accent.rgb}">
          <div class="vt-shell">
            <nav class="vt-nav-list">${tabsHtml}</nav>
            <div class="vt-content">${contentHtml}</div>
          </div>
        </div>`;

      // Bind navigation tab clicks
      host.querySelectorAll('.vt-nav').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          activeTab = e.currentTarget.getAttribute('data-tab');
          render();
        });
      });

      // Bind Idle controls
      if (activeTab === 'idle') {
        host.querySelector('#idle-delay')?.addEventListener('input', (e) => {
          idleDelay = Number(e.target.value);
          initIdleFn();
          render();
        });
        host.querySelector('#idle-maxwait')?.addEventListener('input', (e) => {
          idleMaxWait = Number(e.target.value);
          initIdleFn();
          render();
        });
        host.querySelector('#idle-leading')?.addEventListener('change', (e) => {
          idleLeading = e.target.checked;
          initIdleFn();
          render();
        });
        host.querySelector('#idle-call')?.addEventListener('click', () => {
          addTimelineEvent('request');
          debouncedFn();
        });
        host.querySelector('#idle-reset')?.addEventListener('click', () => {
          events = [];
          render();
        });
      }

      // Bind Pace controls
      if (activeTab === 'pace') {
        host.querySelector('#pace-interval')?.addEventListener('input', (e) => {
          paceInterval = Number(e.target.value);
          initPaceFn();
          render();
        });
        host.querySelector('#pace-leading')?.addEventListener('change', (e) => {
          paceLeading = e.target.checked;
          initPaceFn();
          render();
        });
        host.querySelector('#pace-trailing')?.addEventListener('change', (e) => {
          paceTrailing = e.target.checked;
          initPaceFn();
          render();
        });
        host.querySelector('#pace-call')?.addEventListener('click', () => {
          addTimelineEvent('request');
          throttledFn();
        });
        host.querySelector('#pace-reset')?.addEventListener('click', () => {
          events = [];
          render();
        });
      }

      // Bind Batch controls
      if (activeTab === 'batch') {
        host.querySelector('#batch-limit')?.addEventListener('input', (e) => {
          batchLimit = Number(e.target.value);
          initBatchFn();
          render();
        });
        host.querySelector('#batch-delay')?.addEventListener('input', (e) => {
          batchDelay = Number(e.target.value);
          initBatchFn();
          render();
        });
        host.querySelector('#batch-add')?.addEventListener('click', () => {
          const id = Math.random().toString(36).substr(2, 4).toUpperCase();
          pendingItems.push(id);
          batchedFn(id);
          render();
        });
      }

      // Bind RateLimit controls
      if (activeTab === 'rate') {
        host.querySelector('#rate-limit')?.addEventListener('input', (e) => {
          rateLimitVal = Number(e.target.value);
          initRateLimitFn();
          render();
        });
        host.querySelector('#rate-period')?.addEventListener('input', (e) => {
          ratePeriod = Number(e.target.value);
          initRateLimitFn();
          render();
        });
        host.querySelector('#rate-call')?.addEventListener('click', () => {
          const id = Math.random().toString(36).substr(2, 4).toUpperCase();
          addTimelineEvent('request', id);
          rateQueueLength++;
          rateLimitedFn(id);
          render();
        });
      }

      // Bind Retry controls
      if (activeTab === 'retry') {
        host.querySelector('#retry-max')?.addEventListener('input', (e) => {
          retryMax = Number(e.target.value);
          render();
        });
        host.querySelector('#retry-delay')?.addEventListener('input', (e) => {
          retryDelay = Number(e.target.value);
          render();
        });
        host.querySelector('#retry-backoff')?.addEventListener('change', (e) => {
          retryBackoff = e.target.value;
          render();
        });
        host.querySelector('#retry-test')?.addEventListener('click', async () => {
          let attempts = 0;
          retryLogs = [];
          retryStatus = 'running';
          render();

          try {
            await retryRun(
              async () => {
                attempts++;
                const isSuccess = attempts > retryMax;
                retryLogs.unshift(
                  `Attempt ${attempts}: ${isSuccess ? 'Success!' : 'Failed, retrying...'}`,
                );
                render();
                if (!isSuccess) throw new Error('fail');
                return 'ok';
              },
              { retries: retryMax, delay: retryDelay, backoff: retryBackoff },
            );
            retryStatus = 'success';
          } catch {
            retryStatus = 'failed';
          }
          render();
        });
      }
    }

    render();
  });

  return <div ref={host} />;
}
