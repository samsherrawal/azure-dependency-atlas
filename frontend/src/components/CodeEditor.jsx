import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Copy, Check } from 'lucide-react';

function CodeEditor({ isDark, initialContent, onContentChange }) {
  const [content, setContent] = useState(initialContent || '');
  const [copied, setCopied] = useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    onContentChange?.(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isDark ? 'bg-slate-900/95 border-slate-700' : 'bg-white/95 border-slate-300'} border rounded-lg overflow-hidden`}
    >
      {/* Header */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'} border-b p-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <h3 className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Graph Definition (YAML/JSON)
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-slate-700 hover:bg-slate-600 text-slate-100 transition"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={handleContentChange}
        className={`w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none ${
          isDark
            ? 'bg-slate-950 text-slate-100 border-none'
            : 'bg-slate-50 text-slate-900 border-none'
        }`}
        placeholder="Paste your YAML or JSON graph definition here..."
        spellCheck="false"
      />

      {/* Info */}
      <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'} border-t p-3`}>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          💡 Define nodes, edges, and layers to visualize your cloud architecture in real-time.
        </p>
      </div>
    </motion.div>
  );
}

export default CodeEditor;
