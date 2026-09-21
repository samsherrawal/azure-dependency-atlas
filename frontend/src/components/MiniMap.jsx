import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function MiniMap({ nodes, isDark }) {
  const canvasRef = useRef(null);
  const containerWidth = 120;
  const containerHeight = 100;

  useEffect(() => {
    if (!canvasRef.current || !nodes || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    // Set canvas resolution
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
    ctx.fillRect(0, 0, containerWidth, containerHeight);

    // Calculate bounds
    const xs = nodes.map(n => n.x || 0);
    const ys = nodes.map(n => n.y || 0);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX || 100;
    const height = maxY - minY || 100;
    const scaleX = (containerWidth - 10) / width;
    const scaleY = (containerHeight - 10) / height;
    const scale = Math.min(scaleX, scaleY);

    // Draw edges
    ctx.strokeStyle = isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(203, 213, 225, 0.5)';
    ctx.lineWidth = 0.5;

    nodes.forEach(source => {
      // For simplicity, just draw the nodes for now
    });

    // Draw nodes
    nodes.forEach(node => {
      const x = (node.x - minX) * scale + 5;
      const y = (node.y - minY) * scale + 5;
      const size = 2;

      ctx.fillStyle = node.blastRadius?.isFailed
        ? '#ef4444'
        : node.status === 'healthy'
        ? '#10b981'
        : node.status === 'degraded'
        ? '#f59e0b'
        : '#ef4444';

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw border
    ctx.strokeStyle = isDark ? 'rgba(100, 116, 139, 0.5)' : 'rgba(203, 213, 225, 0.7)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, containerWidth, containerHeight);
  }, [nodes, isDark]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${isDark ? 'bg-slate-900/90 border-slate-700 glow-cyan' : 'bg-white/90 border-slate-300'} border rounded-lg p-2 backdrop-blur-lg`}
    >
      <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        Mini Map
      </p>
      <canvas
        ref={canvasRef}
        width={containerWidth}
        height={containerHeight}
        className="w-full rounded border border-slate-600/30"
      />
    </motion.div>
  );
}

export default MiniMap;
