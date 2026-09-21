import React, { useState } from 'react';
import { Activity, Network, AlertCircle, TrendingUp, ChevronRight, CheckCircle2 } from 'lucide-react';
import InteractiveGraph from './InteractiveGraph';
import ControlPanel from './ControlPanel';
import CodeEditor from './CodeEditor';
import ActionPlanModal from './ActionPlanModal';
import { workspaceInfo, mockAlerts, mockPipelines, mockForecasts, mockResources, mockEdges, exampleGraphDefinition, historicalSnapshots } from '../mockData';

function CenterPane({ selectedResource, setSelectedResource, isDark, resolvedForecasts, setResolvedForecasts, rightPaneOpen }) {
  const [activeTab, setActiveTab] = useState('topology');
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null);
  const [currentLayer, setCurrentLayer] = useState('all');
  const [timelineIndex, setTimelineIndex] = useState(historicalSnapshots.length - 1);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Get current resources based on timeline
  const getCurrentResources = () => {
    if (timelineIndex >= 0 && timelineIndex < historicalSnapshots.length) {
      return historicalSnapshots[timelineIndex].resources;
    }
    return mockResources;
  };

  const handleTimeTravel = (value) => {
    const index = Math.round((value / 100) * (historicalSnapshots.length - 1));
    setTimelineIndex(index);
  };

  return (
    <div className={`flex-1 flex flex-col ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'} ${rightPaneOpen ? 'border-r' : ''} transition-all duration-300`}>
      {/* Header */}
      <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b p-4`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{workspaceInfo.name}</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{workspaceInfo.subscriptionId}</p>
          </div>
          <div className="text-right">
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Last Sync</p>
            <p className="text-sm text-cyan-400 font-mono">{formatTime(workspaceInfo.lastSync)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'topology', label: 'Dependency Topology', icon: Network },
            { id: 'incidents', label: 'Incidents', icon: AlertCircle },
            { id: 'forecasts', label: 'Forecasts', icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : isDark 
                    ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-auto p-6">
            <Overview selectedResource={selectedResource} isDark={isDark} />
          </div>
        )}
        {activeTab === 'topology' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Control Panel and Graph Layout - Full Height */}
            <div className="flex gap-4 flex-1 overflow-hidden p-4">
              {/* Left: Control Panel */}
              <div className="w-64 flex-shrink-0 overflow-y-auto">
                <ControlPanel
                  isDark={isDark}
                  onLayerChange={setCurrentLayer}
                  onBlastRadiusToggle={() => {}}
                  onReset={() => setTimelineIndex(historicalSnapshots.length - 1)}
                  currentLayer={currentLayer}
                  onTimeTravel={handleTimeTravel}
                />
              </div>

              {/* Right: Interactive Graph - Full Remaining Space */}
              <div className="flex-1 overflow-hidden">
                <InteractiveGraph
                  nodes={getCurrentResources()}
                  edges={mockEdges}
                  isDark={isDark}
                  onNodeSelect={setSelectedResource}
                  onFailureSimulate={() => {}}
                  currentLayer={currentLayer}
                />
              </div>
            </div>

            {/* Code Editor */}
            {showCodeEditor && (
              <CodeEditor
                isDark={isDark}
                initialContent={exampleGraphDefinition}
                onContentChange={() => {}}
              />
            )}
          </div>
        )}
        {activeTab === 'incidents' && (
          <div className="flex-1 overflow-auto p-6">
            <Incidents isDark={isDark} />
          </div>
        )}
        {activeTab === 'forecasts' && (
          <div className="flex-1 overflow-auto p-6">
            <Forecasts isDark={isDark} onTriggerPlan={(forecast) => {
              const resource = mockResources.find(r => r.id === forecast.resourceId) || { id: forecast.resourceId, name: forecast.resource };
              setSelectedForecast({ ...forecast, resourceObj: resource });
              setShowActionPlan(true);
            }} resolvedForecasts={resolvedForecasts} />
          </div>
        )}
      </div>

      {/* Action Plan Modal */}
      {showActionPlan && selectedForecast && (
        <ActionPlanModal
          forecast={selectedForecast}
          resource={selectedForecast.resourceObj}
          isDark={isDark}
          onClose={() => {
            setShowActionPlan(false);
            setResolvedForecasts([...resolvedForecasts, selectedForecast.id]);
            setSelectedForecast(null);
          }}
        />
      )}
    </div>
  );
}

function Overview({ selectedResource, isDark }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-sm font-bold mb-4 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Infrastructure Health</h3>
        <div className="grid grid-cols-4 gap-3">
          {mockResources.slice(0, 4).map(resource => (
            <div key={resource.id} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border rounded p-3`}>
              <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{resource.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  resource.status === 'healthy' ? 'text-green-400' :
                  resource.status === 'degraded' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{resource.healthScore}%</span>
                <div className={`w-2 h-2 rounded-full ${
                  resource.status === 'healthy' ? 'bg-green-500' :
                  resource.status === 'degraded' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-sm font-bold mb-4 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>30-Day Spend</h3>
        <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border rounded p-4`}>
          <p className="text-2xl font-bold text-cyan-400">${mockResources.reduce((sum, r) => sum + r.cost30d, 0)}</p>
          <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{mockResources.length} resources across {new Set(mockResources.map(r => r.region)).size} regions</p>
        </div>
      </div>

      <div>
        <h3 className={`text-sm font-bold mb-4 uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Resource Status Summary</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded" style={{background: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'}}>
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Healthy Resources</span>
            <span className="text-lg font-bold text-green-400">{mockResources.filter(r => r.status === 'healthy').length}/{mockResources.length}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded" style={{background: isDark ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.05)'}}>
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Degraded Resources</span>
            <span className="text-lg font-bold text-yellow-400">{mockResources.filter(r => r.status === 'degraded').length}/{mockResources.length}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded" style={{background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'}}>
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Failing Resources</span>
            <span className="text-lg font-bold text-red-400">{mockResources.filter(r => r.status === 'failing').length}/{mockResources.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Incidents({ isDark }) {
  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (mins < 60) return `${mins}m ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Active Incidents</h3>
      {mockAlerts.filter(a => !a.resolved).map(alert => (
        <div key={alert.id} className={`p-3 rounded border ${
          alert.severity === 'critical' ? (isDark ? 'bg-red-950 border-red-900' : 'bg-red-100 border-red-300') :
          alert.severity === 'warning' ? (isDark ? 'bg-yellow-950 border-yellow-900' : 'bg-yellow-100 border-yellow-300') :
          isDark ? 'bg-blue-950 border-blue-900' : 'bg-blue-100 border-blue-300'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={`text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{alert.message}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{formatTime(alert.timestamp)} on {alert.resource}</p>
            </div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
              alert.severity === 'critical' ? 'bg-red-500' :
              alert.severity === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Forecasts({ isDark, onTriggerPlan, resolvedForecasts }) {
  const activeForecasts = mockForecasts.filter(f => !resolvedForecasts.includes(f.id));
  
  if (activeForecasts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
        <h3 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>All Systems Optimal</h3>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>All recommended action plans have been executed successfully.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className={`text-sm font-bold uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Risk Forecasts</h3>
      {activeForecasts.map(forecast => (
        <div key={forecast.id} className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'} border rounded p-4`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{forecast.resource}</p>
              <p className={`text-xs font-semibold mt-1 ${
                forecast.riskLevel === 'critical' ? 'text-red-400' :
                forecast.riskLevel === 'high' ? 'text-orange-400' :
                'text-yellow-400'
              }`}>{forecast.riskLevel.toUpperCase()} RISK</p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Confidence</p>
              <p className="text-sm font-bold text-cyan-400">{forecast.confidence}%</p>
            </div>
          </div>
          <p className={`text-xs mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{forecast.explanation}</p>
          <div className={`flex items-center justify-between gap-2 pt-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Window: {forecast.window}</p>
            <button 
              onClick={() => onTriggerPlan(forecast)}
              className="text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors flex items-center gap-1"
            >
              Trigger Plan
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CenterPane;
