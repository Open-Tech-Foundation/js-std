'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Activity, 
  Zap, 
  Layers, 
  Clock, 
  Play, 
  RotateCcw, 
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  idleRun, 
  paceRun, 
  batchRun, 
  rateLimitRun, 
  retryRun, 
} from '@opentf/std';
import styles from './VisualTools.module.css';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TimelineVisualizer = ({ events, duration = 5000 }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.visualizerContainer}>
      <div className={styles.timelineLine} />
      <AnimatePresence>
        {events.filter(e => now - e.time < duration).map(event => (
          <motion.div
            key={event.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(styles.eventDot, event.type === 'request' ? styles.eventDotRequest : styles.eventDotExecution)}
            style={{ 
              left: `${100 - ((now - event.time) / duration) * 100}%` 
            }}
          >
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="absolute right-0 top-0 bottom-0 w-px bg-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
    </div>
  );
};

const IdleRunTab = () => {
  const [delay, setDelay] = useState(500);
  const [leading, setLeading] = useState(false);
  const [maxWait, setMaxWait] = useState(0);
  const [events, setEvents] = useState([]);
  const debouncedRef = useRef(null);

  const addEvent = useCallback((type) => {
    setEvents(prev => [...prev, { id: Math.random().toString(36), type, time: Date.now() }]);
  }, []);

  useEffect(() => {
    debouncedRef.current = idleRun(() => {
      addEvent('execution');
    }, delay, { leading, maxWait: maxWait > 0 ? maxWait : undefined });
    
    return () => debouncedRef.current?.cancel();
  }, [delay, leading, maxWait, addEvent]);

  return (
    <div className={styles.grid2}>
      <div className={styles.card}>
        <div className="flex items-center gap-2 text-xl font-bold">
          <Clock className="text-blue-500" /> idleRun (Debounce)
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Delay (ms): {delay}</label>
            <input className={styles.inputRange} type="range" min="100" max="2000" step="100" value={delay} onChange={e => setDelay(Number(e.target.value))} />
          </div>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Max Wait (ms): {maxWait === 0 ? 'None' : maxWait}</label>
            <input className={styles.inputRange} type="range" min="0" max="5000" step="500" value={maxWait} onChange={e => setMaxWait(Number(e.target.value))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" checked={leading} onChange={e => setLeading(e.target.checked)} /> Leading Edge
          </label>
          <button className={cn(styles.btn, styles.btnPrimary)} onClick={() => {
            addEvent('request');
            debouncedRef.current();
          }}>
            <Play size={18} /> Call Function
          </button>
          <button className={styles.btn} style={{background: 'rgba(128,128,128,0.1)'}} onClick={() => setEvents([])}>
            <RotateCcw size={18} /> Reset Timeline
          </button>
        </div>
        <div className={styles.codeBlock}>
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
  const [events, setEvents] = useState([]);
  const throttledRef = useRef(null);

  const addEvent = useCallback((type) => {
    setEvents(prev => [...prev, { id: Math.random().toString(36), type, time: Date.now() }]);
  }, []);

  useEffect(() => {
    throttledRef.current = paceRun(() => {
      addEvent('execution');
    }, interval, { leading, trailing });
    
    return () => throttledRef.current?.cancel();
  }, [interval, leading, trailing, addEvent]);

  return (
    <div className={styles.grid2}>
      <div className={styles.card}>
        <div className="flex items-center gap-2 text-xl font-bold">
          <Activity className="text-purple-500" /> paceRun (Throttle)
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Interval (ms): {interval}</label>
            <input className={styles.inputRange} type="range" min="100" max="2000" step="100" value={interval} onChange={e => setIntervalTime(Number(e.target.value))} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={leading} onChange={e => setLeading(e.target.checked)} /> Leading
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={trailing} onChange={e => setTrailing(e.target.checked)} /> Trailing
            </label>
          </div>
          <button className={cn(styles.btn, styles.btnPrimary)} style={{background: '#8b5cf6'}} onClick={() => {
            addEvent('request');
            throttledRef.current();
          }}>
            <Play size={18} /> Call Function
          </button>
          <button className={styles.btn} style={{background: 'rgba(128,128,128,0.1)'}} onClick={() => setEvents([])}>
            <RotateCcw size={18} /> Reset Timeline
          </button>
        </div>
        <div className={styles.codeBlock}>
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
  const [pendingItems, setPendingItems] = useState([]);
  const [processedBatches, setProcessedBatches] = useState([]);
  const batchedRef = useRef(null);

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
    <div className={styles.grid2}>
      <div className={styles.card}>
        <div className="flex items-center gap-2 text-xl font-bold">
          <Layers className="text-emerald-500" /> batchRun (Batching)
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Limit (Items): {limit}</label>
            <input className={styles.inputRange} type="range" min="1" max="20" value={limit} onChange={e => setLimit(Number(e.target.value))} />
          </div>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Wait Delay (ms): {delay}</label>
            <input className={styles.inputRange} type="range" min="0" max="5000" step="500" value={delay} onChange={e => setDelay(Number(e.target.value))} />
          </div>
          <button className={cn(styles.btn, styles.btnPrimary)} style={{background: '#10b981'}} onClick={triggerCall}>
            <Zap size={18} /> Add to Batch
          </button>
        </div>
        <div className={styles.codeBlock}>
          {`const run = batchRun(processor, { \n  limit: ${limit}, \n  delay: ${delay} \n});`}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className={styles.card} style={{padding: '1.25rem'}}>
          <div className={styles.statLabel}>Pending Batch ({pendingItems.length}/{limit})</div>
          <div className="flex flex-wrap gap-2 mt-2 min-h-[40px]">
            {pendingItems.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{scale: 0}} animate={{scale: 1}}
                className={cn(styles.badge, styles.badgeBlue, "px-3 py-2")}
              >
                {item}
              </motion.div>
            ))}
            {pendingItems.length === 0 && <div className="text-gray-500 italic text-sm">No pending items...</div>}
          </div>
        </div>
        <div className={styles.card} style={{padding: '1.25rem'}}>
          <div className={styles.statLabel}>Processed Batches</div>
          <div className="flex flex-col gap-2 mt-3 overflow-y-auto max-h-[200px]">
            <AnimatePresence>
              {processedBatches.map(batch => (
                <motion.div 
                  key={batch.id} 
                  initial={{x: -20, opacity: 0}} 
                  animate={{x: 0, opacity: 1}}
                  className="p-3 rounded-lg bg-gray-500/5 border border-gray-500/10 flex items-center justify-between"
                >
                  <div className="font-mono text-emerald-500 font-bold">#{batch.id}</div>
                  <div className="flex gap-2">
                    {batch.items.map((item, i) => (
                      <span key={i} className="text-xs opacity-70">{item}</span>
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
  const [events, setEvents] = useState([]);
  const [queueLength, setQueueLength] = useState(0);
  const rateLimitedRef = useRef(null);

  const addEvent = useCallback((type, label) => {
    setEvents(prev => [...prev, { id: Math.random().toString(36), type, time: Date.now(), label }]);
  }, []);

  useEffect(() => {
    rateLimitedRef.current = rateLimitRun(async (id) => {
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
    <div className={styles.grid2}>
      <div className={styles.card}>
        <div className="flex items-center gap-2 text-xl font-bold">
          <Cpu className="text-amber-500" /> rateLimitRun (Sliding Window)
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Limit (Calls): {limit}</label>
            <input className={styles.inputRange} type="range" min="1" max="10" value={limit} onChange={e => setLimit(Number(e.target.value))} />
          </div>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Period (ms): {period}</label>
            <input className={styles.inputRange} type="range" min="500" max="5000" step="500" value={period} onChange={e => setPeriod(Number(e.target.value))} />
          </div>
          <button className={cn(styles.btn, styles.btnPrimary)} style={{background: '#f59e0b'}} onClick={triggerCall}>
            <Play size={18} /> Request Execution
          </button>
          <div className="mt-2 flex justify-between items-center bg-gray-500/5 p-3 rounded-lg">
            <div className={styles.statLabel}>Queue Size</div>
            <div className="text-xl font-bold text-amber-500">{queueLength}</div>
          </div>
        </div>
        <div className={styles.codeBlock}>
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
  const [backoff, setBackoff] = useState('fixed');
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('idle');

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
        backoff
      });
      setStatus('success');
    } catch (err) {
      setStatus('failed');
    }
  };

  return (
    <div className={styles.grid2}>
      <div className={styles.card}>
        <div className="flex items-center gap-2 text-xl font-bold">
          <RefreshCw className="text-blue-500" /> retryRun (Reliability)
        </div>
        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Max Retries: {retries}</label>
            <input className={styles.inputRange} type="range" min="1" max="10" value={retries} onChange={e => setRetries(Number(e.target.value))} />
          </div>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Delay (ms): {delay}</label>
            <input className={styles.inputRange} type="range" min="0" max="2000" step="100" value={delay} onChange={e => setDelay(Number(e.target.value))} />
          </div>
          <div className={styles.controlGroup}>
            <label className={styles.label}>Strategy</label>
            <select 
              className="p-2 rounded-lg bg-gray-500/5 border border-gray-500/10 text-inherit outline-none"
              value={backoff} 
              onChange={e => setBackoff(e.target.value)}
            >
              <option value="fixed">Fixed Delay</option>
              <option value="exponential">Exponential Backoff</option>
            </select>
          </div>
          <button className={cn(styles.btn, styles.btnPrimary)} onClick={runTest} disabled={status === 'running'}>
            <Play size={18} /> Run Retry Test
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className={styles.card} style={{padding: '1.25rem'}}>
          <div className={styles.statLabel}>Execution Status: {status}</div>
          <div className="mt-4 flex flex-col gap-2">
            {logs.map((log, i) => (
              <div key={i} className={cn(
                "p-2 rounded text-sm font-mono",
                log.includes('Success') ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
              )}>
                {log}
              </div>
            ))}
            {logs.length === 0 && <div className="text-gray-500 italic text-sm">No attempts yet...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VisualTools() {
  const [activeTab, setActiveTab] = useState('idle');

  return (
    <div className={styles.root}>
      <div className={styles.toolLayout}>
        <aside className={styles.toolSidebar}>
          <div className={cn(styles.navItem, activeTab === 'idle' && styles.navItemActive)} onClick={() => setActiveTab('idle')}>
            <Clock size={18} /> idleRun
          </div>
          <div className={cn(styles.navItem, activeTab === 'pace' && styles.navItemActive)} onClick={() => setActiveTab('pace')}>
            <Activity size={18} /> paceRun
          </div>
          <div className={cn(styles.navItem, activeTab === 'batch' && styles.navItemActive)} onClick={() => setActiveTab('batch')}>
            <Layers size={18} /> batchRun
          </div>
          <div className={cn(styles.navItem, activeTab === 'rate' && styles.navItemActive)} onClick={() => setActiveTab('rate')}>
            <Cpu size={18} /> rateLimitRun
          </div>
          <div className={cn(styles.navItem, activeTab === 'retry' && styles.navItemActive)} onClick={() => setActiveTab('retry')}>
            <RefreshCw size={18} /> retryRun
          </div>
        </aside>
        
        <div className={styles.toolContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'idle' && <IdleRunTab />}
              {activeTab === 'pace' && <PaceRunTab />}
              {activeTab === 'batch' && <BatchRunTab />}
              {activeTab === 'rate' && <RateLimitRunTab />}
              {activeTab === 'retry' && <RetryRunTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
