import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, AlertCircle } from 'lucide-react';

function TelemetryPopover({ edge, isDark, onClose }) {
  if (!edge || !edge.telemetry) return null;

  const { latency, rps, errorRate } = edge.telemetry;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed top-20 right-20 ${isDark ? 'bg-slate-900 border-slate-700 shadow-lg' : 'bg-white border-slate-300'} border rounded-lg p-4 backdrop-blur-lg z-50 w-72`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
          {edge.label}
        </h3>
        <button
          onClick={onClose}
          className={`text-xs ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Latency */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Zap className="w-3 h-3 inline mr-1" />
              Latency
            </label>
            <span className={`text-sm font-mono ${latency > 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {latency}ms
            </span>
          </div>
          <div className={`w-full h-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden`}>
            <div
              className={`h-full ${latency > 50 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min((latency / 100) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* RPS (Requests Per Second) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <TrendingUp className="w-3 h-3 inline mr-1" />
              RPS
            </label>
            <span className={`text-sm font-mono text-cyan-400`}>
              {rps.toLocaleString()}
            </span>
          </div>
          <div className={`w-full h-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden`}>
            <div
              className="h-full bg-cyan-500"
              style={{ width: `${Math.min((rps / 10000) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Error Rate */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Error Rate
            </label>
            <span className={`text-sm font-mono ${errorRate > 0.05 ? 'text-red-400' : errorRate > 0.01 ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {(errorRate * 100).toFixed(2)}%
            </span>
          </div>
          <div className={`w-full h-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'} overflow-hidden`}>
            <div
              className={`h-full ${errorRate > 0.05 ? 'bg-red-500' : errorRate > 0.01 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(errorRate * 1000, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Health indicator */}
      <div className={`mt-4 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                errorRate > 0.1
                  ? '#ef4444'
                  : errorRate > 0.05
                  ? '#f59e0b'
                  : '#10b981',
            }}
          />
          <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {errorRate > 0.1
              ? 'Critical'
              : errorRate > 0.05
              ? 'Degraded'
              : 'Healthy'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default TelemetryPopover;
