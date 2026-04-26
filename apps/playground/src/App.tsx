import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Activity, 
  Zap, 
  Layers, 
  Clock, 
  Play, 
  RotateCcw, 
  Settings2,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind-like class merging (optional since we use vanilla CSS)
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Importing utilities from source
import idleRun from '../../../packages/std/src/flow/idleRun';
import paceRun from '../../../packages/std/src/flow/paceRun';
import batchRun from '../../../packages/std/src/flow/batchRun';
import rateLimitRun from '../../../packages/std/src/flow/rateLimitRun';
import retryRun from '../../../packages/std/src/flow/retryRun';
import timeoutRun from '../../../packages/std/src/flow/timeoutRun';

type Event = {
  id: string;
  type: 'request' | 'execution';
  time: number;
  label?: string;
};

const TimelineVisualizer = ({ events, duration = 5000 }: { events: Event[], duration?: number }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="visualizer-container">
      <div className="timeline-line" />
      <AnimatePresence>
        {events.filter(e => now - e.time < duration).map(event => (
          <motion.div
            key={event.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn("event-dot", event.type === 'request' ? 'request' : 'execution')}
            style={{ 
              left: `${100 - ((now - event.time) / duration) * 100}%` 
            }}
          >
            {event.label && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-blue-400">
                {event.label}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="absolute right-0 top-0 bottom-0 w-px bg-accent-primary opacity-30 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
    </div>
  );
};

const IdleRunTab = () => {
  const [delay, setDelay] = useState(500);
  const [leading, setLeading] = useState(false);
  const [maxWait, setMaxWait] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);
  const debouncedRef = useRef<any>(null);

  const addEvent = useCallback((type: 'request' | 'execution') => {
    setEvents(prev => [...prev, { id: Math.random().toString(36), type, time: Date.now() }]);
  }, []);

  useEffect(() => {
    debouncedRef.current = idleRun(() => {
      addEvent('execution');
    }, delay, { leading, maxWait: maxWait > 0 ? maxWait : undefined });
    
    return () => debouncedRef.current?.cancel();
  }, [delay, leading, maxWait, addEvent]);

  return (
    <div className="grid-2">
      <div className="card">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Clock className="text-accent-primary" /> idleRun (Debounce)
        </div>
        <div className="controls">
          <div className="control-group">
            <label>Delay (ms): {delay}</label>
            <input type="range" min="100" max="2000" step="100" value={delay} onChange={e => setDelay(Number(e.target.value))} />
          </div>
          <div className="control-group">
            <label>Max Wait (ms): {maxWait === 0 ? 'None' : maxWait}</label>
            <input type="range" min="0" max="5000" step="500" value={maxWait} onChange={e => setMaxWait(Number(e.target.value))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={leading} onChange={e => setLeading(e.target.checked)} /> Leading Edge
          </label>
          <button className="btn btn-primary" onClick={() => {
            addEvent('request');
            debouncedRef.current();
          }}>
            <Play size={18} /> Call Function
          </button>
          <button className="btn" style={{background: 'rgba(255,255,255,0.05)'}} onClick={() => setEvents([])}>
            <RotateCcw size={18} /> Reset Timeline
          </button>
        </div>
        <div className="code-block">
          {`const run = idleRun(fn, ${delay}, { leading: ${leading}${maxWait > 0 ? `, maxWait: ${maxWait}` : ''} });`}
        </div>
      </div>
      <TimelineVisualizer events={events} />
    </div>
  );
};

const PaceRunTab = () => {
  const [interval, setIntervalTime] = useState(500);
  const [leading, setLeading] = useState(true);
  const [trailing, setTrailing] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const throttledRef = useRef<any>(null);

  const addEvent = useCallback((type: 'request' | 'execution') => {
    setEvents(prev => [...prev, { id: Math.random().toString(36), type, time: Date.now() }]);
  }, []);

  useEffect(() => {
    throttledRef.current = paceRun(() => {
      addEvent('execution');
    }, interval, { leading, trailing });
    
    return () => throttledRef.current?.cancel();
  }, [interval, leading, trailing, addEvent]);

  return (
    <div className="grid-2">
      <div className="card">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Activity className="text-accent-secondary" /> paceRun (Throttle)
        </div>
        <div className="controls">
          <div className="control-group">
            <label>Interval (ms): {interval}</label>
            <input type="range" min="100" max="2000" step="100" value={interval} onChange={e => setIntervalTime(Number(e.target.value))} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={leading} onChange={e => setLeading(e.target.checked)} /> Leading
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={trailing} onChange={e => setTrailing(e.target.checked)} /> Trailing
            </label>
          </div>
          <button className="btn btn-primary" style={{background: 'var(--accent-secondary)'}} onClick={() => {
            addEvent('request');
            throttledRef.current();
          }}>
            <Play size={18} /> Call Function
          </button>
          <button className="btn" style={{background: 'rgba(255,255,255,0.05)'}} onClick={() => setEvents([])}>
            <RotateCcw size={18} /> Reset Timeline
          </button>
        </div>
        <div className="code-block">
          {`const run = paceRun(fn, ${interval}, { \n  leading: ${leading}, \n  trailing: ${trailing} \n});`}
        </div>
      </div>
      <TimelineVisualizer events={events} />
    </div>
  );
};

const BatchRunTab = () => {
  const [limit, setLimit] = useState(5);
  const [delay, setDelay] = useState(1000);
  const [pendingItems, setPendingItems] = useState<string[]>([]);
  const [processedBatches, setProcessedBatches] = useState<{id: string, items: string[]}[]>([]);
  const batchedRef = useRef<any>(null);

  useEffect(() => {
    batchedRef.current = batchRun(async (batch) => {
      const batchId = Math.random().toString(36).substr(2, 5).toUpperCase();
      const items = batch.map(args => args[0]);
      setProcessedBatches(prev => [{id: batchId, items}, ...prev].slice(0, 5));
      setPendingItems([]);
      return items.map(() => 'ok');
    }, { limit, delay });
  }, [limit, delay]);

  const triggerCall = () => {
    const id = Math.random().toString(36).substr(2, 4);
    setPendingItems(prev => [...prev, id]);
    batchedRef.current(id);
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Layers className="text-accent-success" /> batchRun (Batching)
        </div>
        <div className="controls">
          <div className="control-group">
            <label>Limit (Items): {limit}</label>
            <input type="range" min="1" max="20" value={limit} onChange={e => setLimit(Number(e.target.value))} />
          </div>
          <div className="control-group">
            <label>Wait Delay (ms): {delay}</label>
            <input type="range" min="0" max="5000" step="500" value={delay} onChange={e => setDelay(Number(e.target.value))} />
          </div>
          <button className="btn btn-primary" style={{background: 'var(--accent-success)'}} onClick={triggerCall}>
            <Zap size={18} /> Add to Batch
          </button>
        </div>
        <div className="code-block">
          {`const run = batchRun(processor, { \n  limit: ${limit}, \n  delay: ${delay} \n});`}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="card" style={{padding: '1.5rem', flex: 1}}>
          <div className="stat-label">Pending Batch ({pendingItems.length}/{limit})</div>
          <div className="flex flex-wrap gap-2 mt-2 min-h-[40px]">
            {pendingItems.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{scale: 0}} animate={{scale: 1}}
                className="badge badge-blue px-3 py-2"
              >
                {item}
              </motion.div>
            ))}
            {pendingItems.length === 0 && <div className="text-text-secondary italic text-sm">No pending items...</div>}
          </div>
        </div>
        <div className="card" style={{padding: '1.5rem', flex: 2}}>
          <div className="stat-label">Processed Batches</div>
          <div className="flex flex-col gap-3 mt-3 overflow-y-auto max-h-[250px]">
            <AnimatePresence>
              {processedBatches.map(batch => (
                <motion.div 
                  key={batch.id} 
                  initial={{x: -20, opacity: 0}} 
                  animate={{x: 0, opacity: 1}}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div className="font-mono text-accent-success font-bold">#{batch.id}</div>
                  <div className="flex gap-2">
                    {batch.items.map((item, i) => (
                      <span key={i} className="text-xs text-text-secondary">{item}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const RateLimitRunTab = () => {
  const [limit, setLimit] = useState(3);
  const [period, setPeriod] = useState(2000);
  const [events, setEvents] = useState<Event[]>([]);
  const [queueLength, setQueueLength] = useState(0);
  const rateLimitedRef = useRef<any>(null);

  const addEvent = useCallback((type: 'request' | 'execution', label?: string) => {
    setEvents(prev => [...prev, { id: Math.random().toString(36), type, time: Date.now(), label }]);
  }, []);

  useEffect(() => {
    rateLimitedRef.current = rateLimitRun(async (id: string) => {
      setQueueLength(prev => Math.max(0, prev - 1));
      addEvent('execution', id);
      return id;
    }, limit, period);
  }, [limit, period, addEvent]);

  const triggerCall = () => {
    const id = Math.random().toString(36).substr(2, 4).toUpperCase();
    addEvent('request', id);
    setQueueLength(prev => prev + 1);
    rateLimitedRef.current(id);
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Cpu className="text-accent-warning" /> rateLimitRun (Sliding Window)
        </div>
        <div className="controls">
          <div className="control-group">
            <label>Limit (Calls): {limit}</label>
            <input type="range" min="1" max="10" value={limit} onChange={e => setLimit(Number(e.target.value))} />
          </div>
          <div className="control-group">
            <label>Period (ms): {period}</label>
            <input type="range" min="500" max="5000" step="500" value={period} onChange={e => setPeriod(Number(e.target.value))} />
          </div>
          <button className="btn btn-primary" style={{background: 'var(--accent-warning)'}} onClick={triggerCall}>
            <Play size={18} /> Request Execution
          </button>
          <div className="mt-2 flex justify-between items-center bg-white/5 p-3 rounded-lg">
            <div className="stat-label">Queue Size</div>
            <div className="text-xl font-bold text-accent-warning">{queueLength}</div>
          </div>
        </div>
        <div className="code-block">
          {`const run = rateLimitRun(fn, ${limit}, ${period});`}
        </div>
      </div>
      <TimelineVisualizer events={events} duration={period * 2} />
    </div>
  );
};

const RetryRunTab = () => {
  const [retries, setRetries] = useState(3);
  const [delay, setDelay] = useState(500);
  const [backoff, setBackoff] = useState<'fixed' | 'exponential'>('fixed');
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');

  const runTest = async () => {
    let attempts = 0;
    setLogs([]);
    setStatus('running');
    
    try {
      await retryRun(async () => {
        attempts++;
        const isLastAttempt = attempts > retries;
        setLogs(prev => [`Attempt ${attempts}: ${isLastAttempt ? 'Success!' : 'Failed, retrying...' }`, ...prev]);
        if (!isLastAttempt) throw new Error('fail');
        return 'ok';
      }, { 
        retries, 
        delay, 
        backoff,
        onRetry: (err, next) => {
          // Log is already handled in the function for visual clarity
        }
      });
      setStatus('success');
    } catch (err) {
      setStatus('failed');
    }
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="flex items-center gap-2 text-xl font-bold">
          <RefreshCw className="text-accent-primary" /> retryRun (Reliability)
        </div>
        <div className="controls">
          <div className="control-group">
            <label>Max Retries: {retries}</label>
            <input type="range" min="1" max="10" value={retries} onChange={e => setRetries(Number(e.target.value))} />
          </div>
          <div className="control-group">
            <label>Delay (ms): {delay}</label>
            <input type="range" min="0" max="2000" step="100" value={delay} onChange={e => setDelay(Number(e.target.value))} />
          </div>
          <div className="control-group">
            <label>Strategy</label>
            <select 
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none"
              value={backoff} 
              onChange={e => setBackoff(e.target.value as any)}
            >
              <option value="fixed">Fixed Delay</option>
              <option value="exponential">Exponential Backoff</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={runTest} disabled={status === 'running'}>
            <Play size={18} /> Run Retry Test
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="card flex-1">
          <div className="stat-label">Execution Status: {status}</div>
          <div className="mt-4 flex flex-col gap-2">
            {logs.map((log, i) => (
              <div key={i} className={cn(
                "p-2 rounded text-sm font-mono",
                log.includes('Success') ? "text-accent-success bg-accent-success/10" : "text-accent-danger bg-accent-danger/10"
              )}>
                {log}
              </div>
            ))}
            {logs.length === 0 && <div className="text-text-secondary italic text-sm">No attempts yet...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeoutRunTab = () => {
  const [ms, setMs] = useState(2000);
  const [actualDuration, setActualDuration] = useState(3000);
  const [useFallback, setUseFallback] = useState(false);
  const [result, setResult] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle');

  const runTest = async () => {
    setStatus('running');
    setResult('');
    const start = Date.now();
    
    try {
      const res = await timeoutRun(async () => {
        await new Promise(resolve => setTimeout(resolve, actualDuration));
        return 'Operation Success';
      }, ms, { fallback: useFallback ? 'Fallback Value' : undefined });
      setResult(res);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setStatus('done');
    }
  };

  return (
    <div className="grid-2">
      <div className="card">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Clock className="text-accent-danger" /> timeoutRun (Safety)
        </div>
        <div className="controls">
          <div className="control-group">
            <label>Timeout (ms): {ms}</label>
            <input type="range" min="500" max="5000" step="500" value={ms} onChange={e => setMs(Number(e.target.value))} />
          </div>
          <div className="control-group">
            <label>Operation Duration (ms): {actualDuration}</label>
            <input type="range" min="500" max="5000" step="500" value={actualDuration} onChange={e => setActualDuration(Number(e.target.value))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useFallback} onChange={e => setUseFallback(e.target.checked)} /> Use Fallback Value
          </label>
          <button className="btn btn-primary" style={{background: 'var(--accent-danger)'}} onClick={runTest} disabled={status === 'running'}>
            <Play size={18} /> Test Timeout
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="card flex-1 justify-center items-center">
          <div className="stat-label">Result</div>
          <div className={cn(
            "mt-4 text-2xl font-bold p-6 rounded-2xl border text-center transition-all",
            result.includes('Error') ? "border-accent-danger text-accent-danger bg-accent-danger/5" : 
            result ? "border-accent-success text-accent-success bg-accent-success/5" : "border-white/10"
          )}>
            {status === 'running' ? 'Wait for it...' : result || '---'}
          </div>
          {status === 'running' && (
            <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{x: '-100%'}} 
                animate={{x: '0%'}} 
                transition={{duration: ms / 1000, ease: 'linear'}}
                className="h-full bg-accent-danger"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'idle' | 'pace' | 'batch' | 'rate' | 'retry' | 'timeout'>('idle');

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <RefreshCw className="animate-spin-slow" /> @opentf/std
        </div>
        <nav className="nav-links">
          <div className={cn("nav-item", activeTab === 'idle' && "active")} onClick={() => setActiveTab('idle')}>
            <Clock size={20} /> idleRun
          </div>
          <div className={cn("nav-item", activeTab === 'pace' && "active")} onClick={() => setActiveTab('pace')}>
            <Activity size={20} /> paceRun
          </div>
          <div className={cn("nav-item", activeTab === 'batch' && "active")} onClick={() => setActiveTab('batch')}>
            <Layers size={20} /> batchRun
          </div>
          <div className={cn("nav-item", activeTab === 'rate' && "active")} onClick={() => setActiveTab('rate')}>
            <Cpu size={20} /> rateLimitRun
          </div>
          <div className={cn("nav-item", activeTab === 'retry' && "active")} onClick={() => setActiveTab('retry')}>
            <RefreshCw size={20} /> retryRun
          </div>
          <div className={cn("nav-item", activeTab === 'timeout' && "active")} onClick={() => setActiveTab('timeout')}>
            <Clock size={20} /> timeoutRun
          </div>
        </nav>
        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-white/5">
          <p className="text-xs text-text-secondary leading-relaxed">
            Real-time visualizer for the new execution control utilities in @opentf/std.
          </p>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Execution Control</h1>
            <p className="text-text-secondary">Testing concurrency patterns in real-time</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-primary" />
              <span className="text-xs font-medium text-text-secondary">Request</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-success shadow-[0_0_8px_var(--accent-success)]" />
              <span className="text-xs font-medium text-text-secondary">Execution</span>
            </div>
          </div>
        </header>

        <section className="flex-1">
          {activeTab === 'idle' && <IdleRunTab />}
          {activeTab === 'pace' && <PaceRunTab />}
          {activeTab === 'batch' && <BatchRunTab />}
          {activeTab === 'rate' && <RateLimitRunTab />}
          {activeTab === 'retry' && <RetryRunTab />}
          {activeTab === 'timeout' && <TimeoutRunTab />}
        </section>
      </main>
    </div>
  );
}
