import React, { useState } from 'react';
import { MapPin, Users, DollarSign, TrendingUp, Zap, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockPipelines, mockForecasts, mockResources } from '../mockData';
import ActionPlanModal from './ActionPlanModal';
import RootCauseAnalyzer from './RootCauseAnalyzer';

function RightPane({ selectedResource, isDark, resolvedForecasts, setResolvedForecasts, onClose }) {
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [activeTab, setActiveTab] = useState('metadata'); // 'metadata' or 'analysis'
  
  if (!selectedResource) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.3 }}
        className={`w-96 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-l p-6 flex flex-col items-center justify-center ${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}
      >
        <div className="text-center">
          <p className="mb-4">Select a resource to view details</p>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    );
  }

  const forecast = mockForecasts.find(f => f.resourceId === selectedResource.id);
  const isActionResolved = forecast && resolvedForecasts.includes(forecast.id);
  const relatedPipeline = mockPipelines.find(p => p.artifact === selectedResource.id);

  return (
    <>
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
      className={`w-96 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-l flex flex-col overflow-hidden`}
    >
      {/* Header with Tabs and Close Button */}
      <div className={`p-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} flex-shrink-0`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-bold truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedResource.name}</h3>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedResource.type}</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ml-2 ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'}`}
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
              activeTab === 'metadata'
                ? isDark
                  ? 'bg-cyan-600 text-white'
                  : 'bg-cyan-100 text-cyan-900'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            📋 Details
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 px-3 py-2 rounded text-xs font-semibold transition-colors ${
              activeTab === 'analysis'
                ? isDark
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-900'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            🔍 Analysis
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'metadata' ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {/* Metadata */}
        <div className="space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Resource Metadata</h4>
          
          <div className="flex items-start gap-3">
            <MapPin className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Region</p>
              <p className={`text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedResource.region}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Owner Team</p>
              <p className={`text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedResource.owner}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>30-Day Cost</p>
              <p className="text-sm text-amber-400 font-bold">${selectedResource.cost30d}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Health Score</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                  <div
                    className={`h-full ${
                      selectedResource.healthScore >= 90 ? 'bg-green-500' :
                      selectedResource.healthScore >= 70 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${selectedResource.healthScore}%` }}
                  ></div>
                </div>
                <span className={`text-sm font-bold w-8 text-right ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{selectedResource.healthScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dependencies */}
        {selectedResource.dependencies.length > 0 && (
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Dependencies</h4>
            <div className="space-y-2">
              {selectedResource.dependencies.map(depId => {
                const dep = mockResources.find(r => r.id === depId);
                if (!dep) return null;
                return (
                  <div key={depId} className={`p-2 rounded border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'} text-xs`}>
                    <p className={isDark ? 'text-slate-100' : 'text-slate-900'}>{dep.name}</p>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{dep.type}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CI/CD Deployment Context */}
        {relatedPipeline && (
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Recent Deployment</h4>
            
            <div className={`p-3 rounded border ${
              relatedPipeline.status === 'failed'
                ? (isDark ? 'bg-red-950 border-red-900' : 'bg-red-100 border-red-300')
                : (isDark ? 'bg-green-950 border-green-900' : 'bg-green-100 border-green-300')
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-xs font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{relatedPipeline.name}</p>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                  relatedPipeline.status === 'failed'
                    ? (isDark ? 'bg-red-900 text-red-200' : 'bg-red-200 text-red-900')
                    : (isDark ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-900')
                }`}>
                  {relatedPipeline.status.toUpperCase()}
                </span>
              </div>

              <div className={`space-y-2 text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                <div className="flex items-center gap-2">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Commit:</span>
                  <span className="font-mono text-cyan-400">{relatedPipeline.commit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Author:</span>
                  <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>{relatedPipeline.author}</span>
                </div>
                <div className={`pt-1 border-t ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
                  <p className={isDark ? 'text-slate-300 italic' : 'text-slate-700 italic'}>{relatedPipeline.message}</p>
                </div>
                {relatedPipeline.failureReason && (
                  <div className={`pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
                    <p className={isDark ? 'text-red-300' : 'text-red-700'}>{relatedPipeline.failureReason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Forecast & Risk */}
        {forecast && !isActionResolved && (
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Early Warning Forecast</h4>
            
            <div className={`p-4 rounded border ${
              forecast.riskLevel === 'critical' ? (isDark ? 'bg-red-950 border-red-900' : 'bg-red-100 border-red-300') :
              forecast.riskLevel === 'high' ? (isDark ? 'bg-orange-950 border-orange-900' : 'bg-orange-100 border-orange-300') :
              isDark ? 'bg-yellow-950 border-yellow-900' : 'bg-yellow-100 border-yellow-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-bold ${
                  forecast.riskLevel === 'critical' ? (isDark ? 'text-red-300' : 'text-red-900') :
                  forecast.riskLevel === 'high' ? (isDark ? 'text-orange-300' : 'text-orange-900') :
                  isDark ? 'text-yellow-300' : 'text-yellow-900'
                }`}>
                  {forecast.riskLevel.toUpperCase()} RISK
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {forecast.confidence}% Confidence
                </span>
              </div>

              <p className={`text-xs mb-3 leading-relaxed ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {forecast.explanation}
              </p>

              <div className={`flex items-center gap-2 p-2 rounded text-xs ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-slate-200 text-slate-700'} mb-3`}>
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Window: {forecast.window}</span>
              </div>

              <button onClick={() => setShowActionPlan(true)} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                Trigger Action Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Success Message after Action Plan Executed */}
        {forecast && isActionResolved && (
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status Update</h4>
            <div className={`p-4 rounded border border-green-600 ${isDark ? 'bg-green-950' : 'bg-green-100'}`}>
              <p className={`text-sm font-bold ${isDark ? 'text-green-300' : 'text-green-900'}`}>✓ Action Plan Completed</p>
              <p className={`text-xs mt-2 ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                All recommended actions have been implemented successfully. This resource is now operating at optimal performance levels.
              </p>
            </div>
          </div>
        )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <RootCauseAnalyzer selectedResource={selectedResource} isDark={isDark} />
        </div>
      )}
    </motion.div>
    {showActionPlan && forecast && (
      <ActionPlanModal
        forecast={forecast}
        resource={selectedResource}
        isDark={isDark}
        onClose={() => {
          setShowActionPlan(false);
          setResolvedForecasts([...resolvedForecasts, forecast.id]);
        }}
      />
    )}
    </>
  );
}

export default RightPane;
