import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Zap, RotateCcw, Play } from 'lucide-react';

function ControlPanel({ isDark, onLayerChange, onBlastRadiusToggle, onReset, currentLayer, onTimeTravel }) {
  const [selectedLayer, setSelectedLayer] = useState(currentLayer || 'all');
  const [simulationEnabled, setSimulationEnabled] = useState(false);
  const [timelineValue, setTimelineValue] = useState(100);

  const layers = [
    { id: 'all', label: 'All Layers', icon: '🌐' },
    { id: 'application', label: 'Application', icon: '🚀' },
    { id: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
    { id: 'data', label: 'Data Lineage', icon: '💾' },
  ];

  const handleLayerChange = (layerId) => {
    setSelectedLayer(layerId);
    onLayerChange?.(layerId);
  };

  const handleTimelineChange = (value) => {
    setTimelineValue(value);
    onTimeTravel?.(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isDark ? 'bg-slate-900/95 border-slate-700 glow-cyan' : 'bg-white/95 border-slate-300'} border rounded-lg p-4 backdrop-blur-lg space-y-4 max-w-sm`}
    >
      {/* Layer Filter */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            View Layers
          </h3>
        </div>
        <div className="space-y-2">
          {layers.map(layer => (
            <button
              key={layer.id}
              onClick={() => handleLayerChange(layer.id)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedLayer === layer.id
                  ? 'bg-cyan-600 text-white shadow-lg'
                  : isDark
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              <span className="mr-2">{layer.icon}</span>
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Controls */}
      <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Blast Radius
            </h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={simulationEnabled}
              onChange={(e) => {
                setSimulationEnabled(e.target.checked);
                onBlastRadiusToggle?.(e.target.checked);
              }}
              className="w-4 h-4 accent-amber-500"
            />
            <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {simulationEnabled ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
          Click any node to simulate failure and visualize cascade impact.
        </p>
      </div>

      {/* Time-Travel Slider */}
      <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Play className="w-4 h-4 text-purple-400" />
          <h3 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Historical Timeline
          </h3>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={timelineValue}
            onChange={(e) => handleTimelineChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gradient-to-r from-slate-700 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs">
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>3h ago</span>
            <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Now</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Scrub through topology changes and deployment history
          </p>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          onReset?.();
          setSimulationEnabled(false);
          setTimelineValue(100);
          setSelectedLayer('all');
        }}
        className="w-full px-3 py-2 rounded-lg text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-100 transition-all flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Reset All
      </button>
    </motion.div>
  );
}

export default ControlPanel;
