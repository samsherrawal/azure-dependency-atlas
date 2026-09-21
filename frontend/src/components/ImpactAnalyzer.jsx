import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Zap, BarChart3 } from 'lucide-react';

function ImpactAnalyzer({ node, isDark, onClose }) {
  if (!node || !node.blastRadius?.isFailed) return null;

  const upstreamCount = node.blastRadius.upstreamImpacted?.length || 0;
  const downstreamCount = node.blastRadius.downstreamImpacted?.length || 0;
  const totalImpacted = upstreamCount + downstreamCount;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`${isDark ? 'bg-slate-900/95 border-red-700/50 glow-red' : 'bg-white/95 border-red-300'} border rounded-lg p-4 backdrop-blur-lg max-w-sm`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Blast Radius Analysis
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {/* Failed Node Info */}
          <div className="p-3 rounded bg-red-950/30 border border-red-800/30">
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Failed Service
            </p>
            <p className={`text-sm font-bold text-red-400 mt-1`}>{node.name}</p>
            {node.blastRadius.failureTime && (
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Failed {new Date(node.blastRadius.failureTime).toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Impact Summary */}
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded ${isDark ? 'bg-amber-950/20 border-amber-800/30' : 'bg-amber-100/30 border-amber-300'} border`}
            >
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Zap className="w-3 h-3 inline mr-1" />
                Upstream
              </p>
              <p className="text-lg font-bold text-amber-400">{upstreamCount}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`p-3 rounded ${isDark ? 'bg-orange-950/20 border-orange-800/30' : 'bg-orange-100/30 border-orange-300'} border`}
            >
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <BarChart3 className="w-3 h-3 inline mr-1" />
                Downstream
              </p>
              <p className="text-lg font-bold text-orange-400">{downstreamCount}</p>
            </motion.div>
          </div>

          {/* Impact Percentage */}
          <div className="p-3 rounded bg-slate-800/30 border border-slate-700/30">
            <div className="flex items-center justify-between mb-2">
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Service Impact
              </p>
              <p className="text-sm font-bold text-red-400">
                {totalImpacted > 0 ? Math.round((totalImpacted / 8) * 100) : 0}%
              </p>
            </div>
            <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-300'} overflow-hidden`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalImpacted > 0 ? (totalImpacted / 8) * 100 : 0}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              />
            </div>
          </div>

          {/* Affected Services List */}
          {totalImpacted > 0 && (
            <div className="space-y-2">
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Affected Services
              </p>
              <div className={`max-h-32 overflow-y-auto ${isDark ? 'bg-slate-950/30' : 'bg-slate-100/30'} rounded p-2 space-y-1`}>
                {[...(node.blastRadius.upstreamImpacted || []), ...(node.blastRadius.downstreamImpacted || [])].slice(0, 5).map((id, idx) => (
                  <div
                    key={idx}
                    className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-red-950/40 text-red-300' : 'bg-red-100/60 text-red-900'}`}
                  >
                    • {id}
                  </div>
                ))}
                {totalImpacted > 5 && (
                  <p className={`text-xs px-2 py-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                    +{totalImpacted - 5} more services affected
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className={`p-3 rounded ${isDark ? 'bg-blue-950/20 border-blue-800/30' : 'bg-blue-100/30 border-blue-300'} border`}>
            <p className={`text-xs font-semibold ${isDark ? 'text-blue-300' : 'text-blue-900'} mb-1`}>
              Recommended Action
            </p>
            <p className={`text-xs ${isDark ? 'text-blue-200' : 'text-blue-800'}`}>
              Initiate failover protocol and check downstream service health immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ImpactAnalyzer;
