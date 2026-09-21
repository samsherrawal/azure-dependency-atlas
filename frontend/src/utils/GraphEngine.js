import * as d3 from 'd3';

/**
 * GraphEngine: Force-directed graph layout engine using D3-force
 * Handles physics simulation, blast-radius traversal, and interaction logic
 */
export class GraphEngine {
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.nodes = [];
    this.edges = [];
    this.simulation = null;
    this.selectedNodeId = null;
    this.failedNodeIds = new Set();
    this.activeLayer = options.activeLayer || 'all';
    this.onUpdate = options.onUpdate || (() => {});

    // D3 simulation configuration
    this.forceConfig = {
      chargeStrength: -300,
      linkDistance: 150,
      linkStrength: 0.3,
      friction: 0.9,
      centerStrength: 0.05,
    };
  }

  /**
   * Initialize simulation with nodes and edges
   */
  initialize(nodes, edges) {
    this.nodes = nodes.map(n => ({
      ...n,
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: 0,
      vy: 0,
    }));

    this.edges = edges.map(e => ({
      ...e,
      source: typeof e.source === 'string' 
        ? this.nodes.find(n => n.id === e.source) 
        : e.source,
      target: typeof e.target === 'string' 
        ? this.nodes.find(n => n.id === e.target) 
        : e.target,
    }));

    this.createSimulation();
  }

  /**
   * Create D3 force simulation
   */
  createSimulation() {
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        'link',
        d3
          .forceLink(this.edges)
          .id(d => d.id)
          .distance(this.forceConfig.linkDistance)
          .strength(this.forceConfig.linkStrength)
      )
      .force('charge', d3.forceManyBody().strength(this.forceConfig.chargeStrength))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2).strength(this.forceConfig.centerStrength))
      .force('collision', d3.forceCollide().radius(60))
      .on('tick', () => this.onUpdate(this.nodes, this.edges))
      .on('end', () => {
        // Simulation stabilized
      });
  }

  /**
   * Stop simulation
   */
  stop() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  /**
   * Resume simulation
   */
  resume() {
    if (this.simulation) {
      this.simulation.alpha(0.3).restart();
    }
  }

  /**
   * Set active layer filter
   */
  setLayer(layerName) {
    this.activeLayer = layerName;
    this.resume();
  }

  /**
   * Get filtered nodes based on active layer
   */
  getVisibleNodes() {
    if (this.activeLayer === 'all') {
      return this.nodes;
    }
    return this.nodes.filter(n => n.layer === this.activeLayer);
  }

  /**
   * Get filtered edges based on visible nodes
   */
  getVisibleEdges() {
    const visibleNodeIds = new Set(this.getVisibleNodes().map(n => n.id));
    return this.edges.filter(
      e => visibleNodeIds.has(e.source.id) && visibleNodeIds.has(e.target.id)
    );
  }

  /**
   * Simulate failure on a node and calculate blast radius
   */
  simulateFailure(nodeId) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return;

    this.failedNodeIds.add(nodeId);
    node.blastRadius.isFailed = true;
    node.blastRadius.failureTime = new Date();

    // Calculate upstream impact (nodes that depend on this node)
    const upstream = this.getUpstreamNodes(nodeId);
    node.blastRadius.upstreamImpacted = upstream;

    // Calculate downstream impact (nodes this node depends on)
    const downstream = this.getDownstreamNodes(nodeId);
    node.blastRadius.downstreamImpacted = downstream;

    this.resume();
  }

  /**
   * Get upstream nodes (nodes that depend on this node)
   * Uses breadth-first search
   */
  getUpstreamNodes(nodeId, depth = 2, visited = new Set()) {
    const upstream = [];
    const queue = [{ id: nodeId, d: 0 }];
    visited.add(nodeId);

    while (queue.length > 0) {
      const { id, d } = queue.shift();

      if (d >= depth) break;

      // Find edges where this node is the target
      this.edges.forEach(edge => {
        if (edge.target.id === id && !visited.has(edge.source.id)) {
          visited.add(edge.source.id);
          upstream.push(edge.source.id);
          queue.push({ id: edge.source.id, d: d + 1 });
        }
      });
    }

    return upstream;
  }

  /**
   * Get downstream nodes (nodes this node depends on)
   * Uses breadth-first search
   */
  getDownstreamNodes(nodeId, depth = 2, visited = new Set()) {
    const downstream = [];
    const queue = [{ id: nodeId, d: 0 }];
    visited.add(nodeId);

    while (queue.length > 0) {
      const { id, d } = queue.shift();

      if (d >= depth) break;

      // Find edges where this node is the source
      this.edges.forEach(edge => {
        if (edge.source.id === id && !visited.has(edge.target.id)) {
          visited.add(edge.target.id);
          downstream.push(edge.target.id);
          queue.push({ id: edge.target.id, d: d + 1 });
        }
      });
    }

    return downstream;
  }

  /**
   * Reset all failure states
   */
  resetFailures() {
    this.failedNodeIds.clear();
    this.nodes.forEach(node => {
      node.blastRadius.isFailed = false;
      node.blastRadius.failureTime = null;
      node.blastRadius.upstreamImpacted = [];
      node.blastRadius.downstreamImpacted = [];
    });
    this.resume();
  }

  /**
   * Get N-degree neighborhood around a node
   */
  getNeighborhood(nodeId, degree = 1) {
    const neighborhood = new Set([nodeId]);
    let current = [nodeId];

    for (let i = 0; i < degree; i++) {
      const next = new Set();

      current.forEach(id => {
        this.edges.forEach(edge => {
          if (edge.source.id === id) {
            next.add(edge.target.id);
          }
          if (edge.target.id === id) {
            next.add(edge.source.id);
          }
        });
      });

      next.forEach(n => neighborhood.add(n));
      current = Array.from(next);
    }

    return neighborhood;
  }

  /**
   * Get edge details between two nodes
   */
  getEdgeBetween(sourceId, targetId) {
    return this.edges.find(
      e => (e.source.id === sourceId && e.target.id === targetId) ||
           (e.source.id === targetId && e.target.id === sourceId)
    );
  }

  /**
   * Update node positions (called by simulation)
   */
  getNodePositions() {
    return this.nodes.reduce((acc, node) => {
      acc[node.id] = { x: node.x, y: node.y };
      return acc;
    }, {});
  }

  /**
   * Check if node is in focus
   */
  isNodeInFocus(nodeId, focusedNodeId, degree = 1) {
    if (focusedNodeId === null) return true;
    const neighborhood = this.getNeighborhood(focusedNodeId, degree);
    return neighborhood.has(nodeId);
  }

  /**
   * Get visible nodes based on active layer filter
   */
  getVisibleNodes() {
    if (this.activeLayer === 'all') {
      return this.nodes;
    }
    return this.nodes.filter(node => node.layer === this.activeLayer);
  }

  /**
   * Set active layer filter
   */
  setActiveLayer(layer) {
    this.activeLayer = layer;
  }

  /**
   * Zoom to fit all visible nodes
   */
  zoomToFit() {
    const visibleNodes = this.getVisibleNodes();
    if (visibleNodes.length === 0) return { x: 0, y: 0, scale: 1 };

    const xs = visibleNodes.map(n => n.x);
    const ys = visibleNodes.map(n => n.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;
    const scale = Math.min(this.width / (width + 100), this.height / (height + 100));

    return {
      x: (this.width - width * scale) / 2 - minX * scale,
      y: (this.height - height * scale) / 2 - minY * scale,
      scale,
    };
  }
}

/**
 * Utility: Calculate blast-radius impact percentage
 */
export function calculateBlastRadiusImpact(node, allNodes) {
  const impactedCount = node.blastRadius.upstreamImpacted.length;
  const totalNodes = allNodes.length;
  return Math.round((impactedCount / totalNodes) * 100);
}

/**
 * Utility: Get status color with severity
 */
export function getStatusColor(status, isFailed = false) {
  if (isFailed) return { bg: '#dc2626', border: '#991b1b', text: '#fecaca' };
  
  switch (status) {
    case 'healthy':
      return { bg: '#10b981', border: '#047857', text: '#a7f3d0' };
    case 'degraded':
      return { bg: '#f59e0b', border: '#b45309', text: '#fde68a' };
    case 'failing':
      return { bg: '#ef4444', border: '#b91c1c', text: '#fca5a5' };
    default:
      return { bg: '#64748b', border: '#475569', text: '#cbd5e1' };
  }
}
