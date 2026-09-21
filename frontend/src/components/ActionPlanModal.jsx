import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, X, ChevronRight } from 'lucide-react';

function ActionPlanModal({ forecast, resource, isDark, onClose }) {
  const [step, setStep] = useState('details'); // 'details', 'confirmation', 'executing', 'success'
  const [executionProgress, setExecutionProgress] = useState(0);

  const handleTrigger = () => {
    setStep('confirmation');
  };

  const handleConfirm = () => {
    setStep('executing');
    // Simulate action execution
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setStep('success'), 500);
      }
      setExecutionProgress(Math.min(progress, 100));
    }, 400);
  };

  const handleClose = () => {
    setStep('details');
    setExecutionProgress(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'} border rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'} border-b p-4 flex items-center justify-between`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {step === 'details' && 'Action Plan'}
              {step === 'confirmation' && 'Confirm Action'}
              {step === 'executing' && 'Executing Action Plan'}
              {step === 'success' && 'Action Completed'}
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{resource.name}</p>
          </div>
          <button onClick={handleClose} className={`p-2 rounded hover:${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {step === 'details' && (
            <>
              {/* Risk Assessment */}
              <div className={`p-4 rounded border ${
                forecast.riskLevel === 'critical' ? (isDark ? 'bg-red-950 border-red-900' : 'bg-red-100 border-red-300') :
                forecast.riskLevel === 'high' ? (isDark ? 'bg-orange-950 border-orange-900' : 'bg-orange-100 border-orange-300') :
                isDark ? 'bg-yellow-950 border-yellow-900' : 'bg-yellow-100 border-yellow-300'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    forecast.riskLevel === 'critical' ? 'text-red-400' :
                    forecast.riskLevel === 'high' ? 'text-orange-400' :
                    'text-yellow-400'
                  }`} />
                  <div>
                    <p className={`font-bold ${
                      forecast.riskLevel === 'critical' ? (isDark ? 'text-red-300' : 'text-red-900') :
                      forecast.riskLevel === 'high' ? (isDark ? 'text-orange-300' : 'text-orange-900') :
                      isDark ? 'text-yellow-300' : 'text-yellow-900'
                    }`}>
                      {forecast.riskLevel.toUpperCase()} RISK - {forecast.confidence}% Confidence
                    </p>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{forecast.explanation}</p>
                  </div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Recommended Action Plan</h3>
                <div className="space-y-2">
                  {getActionPlan(forecast, resource).map((action, idx) => (
                    <div key={idx} className={`p-3 rounded border-l-4 ${isDark ? 'bg-slate-800 border-cyan-600' : 'bg-slate-100 border-cyan-500'}`}>
                      <div className="flex items-start gap-2">
                        <div className="text-cyan-400 font-bold mt-0.5">
                          {idx + 1}.
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{action.title}</p>
                          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{action.description}</p>
                          {action.benefit && (
                            <p className={`text-xs mt-2 text-green-400`}>✓ {action.benefit}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className={`text-sm font-bold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Expected Timeline</h3>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="text-cyan-400 font-bold">2-5 minutes</span> to complete all actions
                </p>
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleTrigger}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded font-semibold transition-colors flex items-center justify-center gap-2"
              >
                Proceed with Action Plan
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {step === 'confirmation' && (
            <>
              <div className={`p-4 rounded border-l-4 border-orange-600 ${isDark ? 'bg-orange-950' : 'bg-orange-100'}`}>
                <p className={`font-bold ${isDark ? 'text-orange-300' : 'text-orange-900'}`}>Please Confirm</p>
                <p className={`text-sm mt-2 ${isDark ? 'text-orange-200' : 'text-orange-800'}`}>
                  This action will make changes to {resource.name}. This is recommended but may affect performance during execution.
                </p>
              </div>

              <div className={`p-3 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="font-bold">Resource:</span> {resource.name}
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="font-bold">Action:</span> {getActionPlan(forecast, resource)[0].title}
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="font-bold">Expected Duration:</span> 2-5 minutes
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-100' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Confirm & Execute
                </button>
              </div>
            </>
          )}

          {step === 'executing' && (
            <>
              <div className="flex items-center justify-center py-8">
                <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>

              <div>
                <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Executing Action Plan...
                </p>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                  <div
                    className="h-full bg-cyan-500 transition-all duration-300"
                    style={{ width: `${executionProgress}%` }}
                  ></div>
                </div>
                <p className={`text-xs mt-2 text-cyan-400`}>{Math.round(executionProgress)}% Complete</p>
              </div>

              <div className="space-y-2">
                <ExecutionStep title="Analyzing resource configuration" completed={executionProgress > 20} isDark={isDark} />
                <ExecutionStep title="Validating changes compatibility" completed={executionProgress > 40} isDark={isDark} />
                <ExecutionStep title="Applying configuration updates" completed={executionProgress > 60} isDark={isDark} />
                <ExecutionStep title="Restarting services" completed={executionProgress > 80} isDark={isDark} />
                <ExecutionStep title="Verifying health status" completed={executionProgress >= 100} isDark={isDark} />
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="flex justify-center py-4">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>

              <div className={`p-4 rounded border border-green-600 ${isDark ? 'bg-green-950' : 'bg-green-100'}`}>
                <p className={`font-bold text-lg ${isDark ? 'text-green-300' : 'text-green-900'}`}>Action Plan Completed Successfully!</p>
                <p className={`text-sm mt-2 ${isDark ? 'text-green-200' : 'text-green-800'}`}>
                  All recommended actions have been applied to {resource.name}. The resource should now be operating within optimal parameters.
                </p>
              </div>

              <div className={`p-3 rounded ${isDark ? 'bg-slate-800' : 'bg-slate-100'} space-y-1`}>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="text-green-400">✓</span> Configuration optimized
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="text-green-400">✓</span> Services restarted
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="text-green-400">✓</span> Health status verified
                </p>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <span className="text-green-400">✓</span> Risk level reduced
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded font-semibold transition-colors"
              >
                Close & Return to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecutionStep({ title, completed, isDark }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
        completed ? 'bg-green-500' : (isDark ? 'bg-slate-700' : 'bg-slate-300')
      }`}>
        {completed && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
      </div>
      <p className={`text-sm ${
        completed
          ? 'text-green-400'
          : isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        {title}
      </p>
    </div>
  );
}

function getActionPlan(forecast, resource) {
  const plans = {
    'redis-payments-eastus': [
      {
        title: 'Increase Memory Allocation',
        description: 'Upgrade Redis instance from 1GB to 2GB memory to handle increased cache demand.',
        benefit: 'Improve cache hit rate by ~25%'
      },
      {
        title: 'Optimize Eviction Policy',
        description: 'Change eviction policy from LRU to LFU for better cache performance with payment data.',
        benefit: 'Reduce stale cache evictions'
      },
      {
        title: 'Enable Persistence',
        description: 'Enable AOF (Append-Only File) persistence to prevent data loss during crashes.',
        benefit: 'Ensure data durability'
      },
      {
        title: 'Configure Monitoring',
        description: 'Add real-time metrics monitoring for memory usage and key evictions.',
        benefit: 'Proactive issue detection'
      }
    ],
    'payment-api-prod': [
      {
        title: 'Increase Database Connection Pool',
        description: 'Increase max connections from 30 to 50 to handle concurrent requests.',
        benefit: 'Reduce connection timeout errors'
      },
      {
        title: 'Optimize Query Timeouts',
        description: 'Adjust query timeout from 30s to 60s to accommodate slower queries.',
        benefit: 'Prevent premature query cancellation'
      },
      {
        title: 'Enable Connection Pooling',
        description: 'Implement connection reuse to reduce database load.',
        benefit: 'Improve response times by 40%'
      }
    ],
    'notification-service': [
      {
        title: 'Scale Service Bus Queue',
        description: 'Increase Service Bus capacity tier from Basic to Standard.',
        benefit: 'Support higher throughput'
      },
      {
        title: 'Configure Dead Letter Queue',
        description: 'Enable dead letter queue for failed messages tracking.',
        benefit: 'Improve error tracking'
      },
      {
        title: 'Implement Retry Policy',
        description: 'Add exponential backoff retry policy for failed notifications.',
        benefit: 'Reduce message loss'
      }
    ]
  };

  return plans[resource.id] || [
    {
      title: 'General Health Check',
      description: 'Run comprehensive diagnostics on the resource configuration.',
      benefit: 'Identify optimization opportunities'
    },
    {
      title: 'Apply Recommended Settings',
      description: 'Configure resource with industry best practices.',
      benefit: 'Improve stability and performance'
    }
  ];
}

export default ActionPlanModal;
