import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Database, HardDrive, Lock, MessageSquare, Zap, AlertTriangle } from 'lucide-react';
import { GraphEngine, calculateBlastRadiusImpact, getStatusColor } from '../utils/GraphEngine';
import TelemetryPopover from './TelemetryPopover';
import ImpactAnalyzer from './ImpactAnalyzer';

function InteractiveGraph({ nodes, edges, isDark, onNodeSelect, onFailureSimulate, currentLayer = 'all' }) {
  const svgRef = useRef(null);
  const engineRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [hoveredEdgeId, setHoveredEdgeId] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [failedNodeId, setFailedNodeId] = useState(null);
  const [zoomState, setZoomState] = useState({ x: 0, y: 0, scale: 1 });
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [telemetryEdge, setTelemetryEdge] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 500 });
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const containerRef = useRef(null);

  // Update SVG dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSvgDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Calculate zoom to fit all nodes
  const calculateZoomToFit = useCallback(() => {
    if (!positions || Object.keys(positions).length === 0) return { scale: 1, x: 0, y: 0 };
    
    const posArray = Object.values(positions);
    const minX = Math.min(...posArray.map(p => p.x));
    const maxX = Math.max(...posArray.map(p => p.x));
    const minY = Math.min(...posArray.map(p => p.y));
    const maxY = Math.max(...posArray.map(p => p.y));
    
    const width = maxX - minX;
    const height = maxY - minY;
    const padding = 100;
    
    const scaleX = (svgDimensions.width - padding * 2) / (width || 1);
    const scaleY = (svgDimensions.height - padding * 2) / (height || 1);
    const scale = Math.min(scaleX, scaleY, 1);
    
    const centerX = svgDimensions.width / 2 - ((minX + maxX) / 2) * scale;
    const centerY = svgDimensions.height / 2 - ((minY + maxY) / 2) * scale;
    
    return { scale, x: centerX, y: centerY };
  }, [positions, svgDimensions]);

  // Auto-center on mount and when positions change
  useEffect(() => {
    if (Object.keys(positions).length > 0) {
      const { scale, x, y } = calculateZoomToFit();
      setZoomState({ x, y, scale });
    }
  }, [positions, calculateZoomToFit]);

  // Initialize graph engine
  useEffect(() => {
    if (!nodes || nodes.length === 0) return;

    engineRef.current = new GraphEngine({
      width: svgDimensions.width,
      height: svgDimensions.height,
      activeLayer: currentLayer,
      onUpdate: (updatedNodes, updatedEdges) => {
        const newPositions = {};
        updatedNodes.forEach(node => {
          newPositions[node.id] = { x: node.x, y: node.y };
        });
        setPositions(newPositions);
      },
    });

    engineRef.current.initialize(nodes, edges);

    return () => {
      engineRef.current.stop();
    };
  }, [nodes, edges, svgDimensions, currentLayer]);

  // Handle node click - both select and simulate failure
  const handleNodeClick = (nodeId) => {
    // First, select the node (which opens right pane)
    const node = nodes?.find(n => n.id === nodeId);
    if (node) {
      onNodeSelect?.(node);
    }
    
    // Then simulate failure
    setFailedNodeId(nodeId);
    if (engineRef.current) {
      engineRef.current.simulateFailure(nodeId);
      onFailureSimulate?.(nodeId);
    }
  };

  // Handle edge hover for telemetry
  const handleEdgeHover = (edgeId) => {
    setHoveredEdgeId(edgeId);
    if (edges) {
      const edge = edges.find(e => e.id === edgeId);
      setTelemetryEdge(edge);
      setShowTelemetry(true);
    }
  };

  // Pan and zoom handlers
  const handleMouseDown = (e) => {
    if (e.button === 2 || e.ctrlKey) {
      // Right-click or ctrl+click for panning
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (draggingNodeId) {
      // Node dragging mode
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (svgRect) {
        const x = (e.clientX - svgRect.left - panOffset.x) / zoomState.scale;
        const y = (e.clientY - svgRect.top - panOffset.y) / zoomState.scale;
        setPositions(prev => ({
          ...prev,
          [draggingNodeId]: { x, y },
        }));
      }
    } else if (isDragging) {
      // Pan mode
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPanOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingNodeId(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomState(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * delta)),
    }));
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Web App':
        return Server;
      case 'SQL Database':
        return Database;
      case 'Redis Cache':
        return HardDrive;
      case 'Key Vault':
        return Lock;
      case 'Service Bus':
        return MessageSquare;
      default:
        return Server;
    }
  };

  const getNodeColor = (node) => {
    if (node.blastRadius?.isFailed) {
      return { bg: '#dc2626', border: '#991b1b', shadow: '#dc2626' };
    }
    return {
      'healthy': { bg: '#10b981', border: '#047857', shadow: '#10b981' },
      'degraded': { bg: '#f59e0b', border: '#b45309', shadow: '#f59e0b' },
      'failing': { bg: '#ef4444', border: '#b91c1c', shadow: '#ef4444' },
    }[node.status] || { bg: '#64748b', border: '#475569', shadow: '#64748b' };
  };

  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
  };

  const handleNodeMouseEnter = (nodeId) => {
    setHoveredNodeId(nodeId);
  };

  const handleNodeMouseLeave = () => {
    setHoveredNodeId(null);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden" style={{ background: isDark ? 'linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(30, 41, 59, 1) 100%)' : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)' }}>
      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width={svgDimensions.width}
        height={svgDimensions.height}
        className="absolute top-0 left-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        style={{ 
          cursor: draggingNodeId ? 'grabbing' : hoveredNodeId ? 'grab' : 'default',
          filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.3))'
        }}
      >
        <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomState.scale})`}>
          {/* Draw edges */}
          {edges?.map(edge => {
            const sourcePos = positions[edge.source?.id || edge.source];
            const targetPos = positions[edge.target?.id || edge.target];

            if (!sourcePos || !targetPos) return null;

            const sourceId = edge.source?.id || edge.source;
            const targetId = edge.target?.id || edge.target;
            const sourceNode = nodes.find(n => n.id === sourceId);
            const targetNode = nodes.find(n => n.id === targetId);

            // Hide edges if either endpoint is filtered by layer
            if (currentLayer !== 'all') {
              if (sourceNode?.layer !== currentLayer || targetNode?.layer !== currentLayer) {
                return null;
              }
            }

            const isHovered = hoveredEdgeId === edge.id;

            // Hide edges if endpoint nodes are hidden by focus
            if (
              focusedNodeId &&
              engineRef.current &&
              (!engineRef.current.isNodeInFocus(sourceId, focusedNodeId, 1) ||
                !engineRef.current.isNodeInFocus(targetId, focusedNodeId, 1))
            ) {
              return null;
            }

            const isImpacted =
              sourceNode?.blastRadius?.isFailed || targetNode?.blastRadius?.isFailed;

            return (
              <g key={edge.id}>
                {/* Edge line */}
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={isImpacted ? '#ef4444' : isHovered ? '#06b6d4' : isDark ? '#475569' : '#cbd5e1'}
                  strokeWidth={isHovered ? 3 : isImpacted ? 2.5 : 1.5}
                  opacity={isHovered || isImpacted ? 1 : 0.6}
                  style={{ transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={() => handleEdgeHover(edge.id)}
                  onMouseLeave={() => setHoveredEdgeId(null)}
                />

                {/* Animated particles along edge for data flow */}
                {isImpacted && (
                  <motion.circle
                    cx={sourcePos.x}
                    cy={sourcePos.y}
                    r={4}
                    fill="#ef4444"
                    opacity={0.8}
                    animate={{
                      cx: targetPos.x,
                      cy: targetPos.y,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}

                {/* Directional arrow */}
                <defs>
                  <marker
                    id={`arrow-${edge.id}`}
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="3"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path
                      d="M0,0 L0,6 L9,3 z"
                      fill={isImpacted ? '#ef4444' : isHovered ? '#06b6d4' : isDark ? '#475569' : '#cbd5e1'}
                    />
                  </marker>
                </defs>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke="none"
                  markerEnd={`url(#arrow-${edge.id})`}
                />

                {/* Telemetry label on hover */}
                {isHovered && (
                  <text
                    x={(sourcePos.x + targetPos.x) / 2}
                    y={(sourcePos.y + targetPos.y) / 2 - 10}
                    textAnchor="middle"
                    fill={isDark ? '#e2e8f0' : '#1e293b'}
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodes
            ?.filter(node => currentLayer === 'all' || node.layer === currentLayer)
            .map(node => {
            const pos = positions[node.id];
            if (!pos) return null;

            // Hide node if not in focus
            if (focusedNodeId && engineRef.current && !engineRef.current.isNodeInFocus(node.id, focusedNodeId, 1)) {
              return null;
            }

            const Icon = getIconForType(node.type);
            const colors = getNodeColor(node);
            const nodeSize = 48;

            return (
              <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                {/* Glow effect for failed nodes */}
                {node.blastRadius?.isFailed && (
                  <motion.circle
                    r={nodeSize + 8}
                    fill="none"
                    stroke={colors.shadow}
                    strokeWidth={2}
                    opacity={0.3}
                    animate={{
                      r: nodeSize + 16,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                )}

                {/* Node circle */}
                <circle
                  r={nodeSize / 2}
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth={2}
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => {
                    onNodeSelect?.(node);
                    handleNodeMouseEnter(node.id);
                  }}
                  onMouseLeave={() => handleNodeMouseLeave()}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  className="transition-all"
                  style={{ 
                    filter: `drop-shadow(0 0 12px ${colors.shadow})`,
                    cursor: 'grab',
                    opacity: 0.9,
                  }}
                />

                {/* Node icon */}
                <foreignObject x={-12} y={-12} width={24} height={24}>
                  <Icon className="w-6 h-6" style={{ color: '#fff' }} />
                </foreignObject>

                {/* Node label */}
                <text
                  y={nodeSize / 2 + 18}
                  textAnchor="middle"
                  fill={isDark ? '#e2e8f0' : '#1e293b'}
                  fontSize="11"
                  fontWeight="bold"
                  className="pointer-events-none"
                  style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {node.name.slice(0, 12)}
                </text>

                {/* Impact indicator for failed nodes */}
                {node.blastRadius?.isFailed && (
                  <g transform={`translate(${nodeSize / 2 - 4}, ${-nodeSize / 2 + 4})`}>
                    <AlertTriangle className="w-4 h-4" fill="#ef4444" stroke="#991b1b" />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Telemetry Popover */}
      <AnimatePresence>
        {showTelemetry && telemetryEdge && (
          <TelemetryPopover
            edge={telemetryEdge}
            isDark={isDark}
            onClose={() => setShowTelemetry(false)}
          />
        )}
      </AnimatePresence>

      {/* Impact Analyzer - shows when node fails */}
      <AnimatePresence>
        {failedNodeId && (
          <div className="absolute top-4 right-4">
            <ImpactAnalyzer
              node={nodes?.find(n => n.id === failedNodeId)}
              isDark={isDark}
              onClose={() => {
                setFailedNodeId(null);
                if (engineRef.current) {
                  engineRef.current.resetFailures();
                }
              }}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Controls Overlay */}
      <div className={`absolute bottom-4 left-4 ${isDark ? 'bg-slate-900/90 border-slate-700 glow-cyan' : 'bg-white/90 border-slate-300'} border rounded-lg p-3 backdrop-blur-md`}>
        <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          <strong>Controls:</strong> Click node to simulate, drag node to move, scroll to zoom, Ctrl+drag to pan
        </p>
      </div>
    </div>
  );
}

export default InteractiveGraph;
