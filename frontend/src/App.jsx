import React, { useState, useEffect } from 'react';
import { Moon, Sun, ChevronLeft } from 'lucide-react';
import CenterPane from './components/CenterPane';
import RightPane from './components/RightPane';
import { mockResources } from './mockData';

function App() {
  const [selectedResource, setSelectedResource] = useState(mockResources[0]);
  const [isDark, setIsDark] = useState(true);
  const [resolvedForecasts, setResolvedForecasts] = useState([]);
  const [rightPaneOpen, setRightPaneOpen] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Auto-open right pane when resource selected
  useEffect(() => {
    if (selectedResource) {
      setRightPaneOpen(true);
    }
  }, [selectedResource?.id]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && rightPaneOpen) {
        setRightPaneOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rightPaneOpen]);

  return (
    <div className={`flex h-screen w-screen ${isDark ? 'dark' : ''}`}>
      <div className="flex h-screen w-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Theme Toggle - Top Right */}
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg ${rightPaneOpen ? 'mr-96' : ''} transition-all duration-300`}>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Center Pane: Canvas (Full Width when right pane closed) */}
        <CenterPane 
          selectedResource={selectedResource} 
          setSelectedResource={setSelectedResource} 
          isDark={isDark} 
          resolvedForecasts={resolvedForecasts}
          setResolvedForecasts={setResolvedForecasts}
          rightPaneOpen={rightPaneOpen}
        />

        {/* Right Pane: Collapsible Details/Analysis */}
        {rightPaneOpen && (
          <RightPane 
            selectedResource={selectedResource} 
            isDark={isDark} 
            resolvedForecasts={resolvedForecasts}
            setResolvedForecasts={setResolvedForecasts}
            onClose={() => setRightPaneOpen(false)}
          />
        )}

        {/* Restore Right Pane Button - Only when closed */}
        {!rightPaneOpen && (
          <button
            onClick={() => setRightPaneOpen(true)}
            className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-40 p-2 rounded-l-lg transition-all duration-300 ${
              isDark
                ? 'bg-slate-900 border-l border-slate-800 hover:bg-slate-800'
                : 'bg-white border-l border-slate-200 hover:bg-slate-50'
            } shadow-lg`}
            title="Restore details panel (also click any resource)"
          >
            <ChevronLeft className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
