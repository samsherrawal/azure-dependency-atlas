/**
 * RAGEngine: Retrieval-Augmented Generation for grounding chatbot responses
 * Indexes the infrastructure topology and retrieves relevant context for queries
 */

export class RAGEngine {
  constructor(nodes = [], edges = []) {
    this.nodes = nodes;
    this.edges = edges;
    this.knowledgeBase = [];
    this.buildKnowledgeBase();
  }

  /**
   * Build knowledge base from nodes and edges
   */
  buildKnowledgeBase() {
    this.knowledgeBase = [];

    // Index all nodes
    this.nodes.forEach(node => {
      this.knowledgeBase.push({
        type: 'node',
        id: node.id,
        name: node.name,
        content: `${node.name} is a ${node.type} in ${node.layer} layer. Status: ${node.status}. Health: ${node.healthScore}%. Region: ${node.region}.`,
        keywords: this.extractKeywords(node),
        metadata: {
          nodeType: node.type,
          layer: node.layer,
          status: node.status,
          healthScore: node.healthScore,
          owner: node.owner,
          dependencies: node.dependencies || [],
          tags: node.tags || [],
        },
      });
    });

    // Index all edges (service dependencies)
    this.edges.forEach(edge => {
      const source = this.nodes.find(n => n.id === edge.source?.id || n.id === edge.source);
      const target = this.nodes.find(n => n.id === edge.target?.id || n.id === edge.target);
      
      if (source && target) {
        this.knowledgeBase.push({
          type: 'edge',
          id: edge.id,
          name: `${source.name} to ${target.name}`,
          content: `${source.name} communicates with ${target.name}. Connection type: ${edge.type}. Latency: ${edge.telemetry?.latency}ms. Error rate: ${(edge.telemetry?.errorRate * 100).toFixed(2)}%. Requests per second: ${edge.telemetry?.rps}.`,
          keywords: this.extractEdgeKeywords(source, target, edge),
          metadata: {
            source: source.id,
            target: target.id,
            connectionType: edge.type,
            telemetry: edge.telemetry,
          },
        });
      }
    });

    // Index layers as concepts
    const layers = ['application', 'infrastructure', 'data'];
    layers.forEach(layer => {
      const layerNodes = this.nodes.filter(n => n.layer === layer);
      this.knowledgeBase.push({
        type: 'concept',
        id: `layer-${layer}`,
        name: `${layer} layer`,
        content: `The ${layer} layer contains ${layerNodes.length} services: ${layerNodes.map(n => n.name).join(', ')}`,
        keywords: [layer, 'layer', ...layerNodes.map(n => n.name.toLowerCase())],
        metadata: {
          layerType: layer,
          nodeCount: layerNodes.length,
        },
      });
    });

    // Index health status concepts
    const statuses = ['healthy', 'degraded', 'failing'];
    statuses.forEach(status => {
      const statusNodes = this.nodes.filter(n => n.status === status);
      if (statusNodes.length > 0) {
        this.knowledgeBase.push({
          type: 'status',
          id: `status-${status}`,
          name: `${status} services`,
          content: `Currently ${statusNodes.length} services are ${status}: ${statusNodes.map(n => n.name).join(', ')}`,
          keywords: [status, 'health', 'status', ...statusNodes.map(n => n.name.toLowerCase())],
          metadata: {
            statusType: status,
            nodeCount: statusNodes.length,
          },
        });
      }
    });
  }

  /**
   * Extract keywords from a node
   */
  extractKeywords(node) {
    return [
      node.name.toLowerCase(),
      node.type.toLowerCase(),
      node.layer.toLowerCase(),
      node.status.toLowerCase(),
      node.region.toLowerCase(),
      node.owner?.toLowerCase() || '',
      ...(node.tags || []).map(t => t.toLowerCase()),
    ].filter(Boolean);
  }

  /**
   * Extract keywords from an edge relationship
   */
  extractEdgeKeywords(source, target, edge) {
    return [
      source.name.toLowerCase(),
      target.name.toLowerCase(),
      source.type.toLowerCase(),
      target.type.toLowerCase(),
      edge.type.toLowerCase(),
      'connection',
      'dependency',
      'communication',
    ].filter(Boolean);
  }

  /**
   * Calculate similarity between query and text
   * Simple token-based matching (no expensive algorithms)
   */
  calculateSimilarity(query, text) {
    const queryTokens = query.toLowerCase().split(/\W+/).filter(Boolean);
    const textTokens = text.toLowerCase().split(/\W+/).filter(Boolean);

    if (queryTokens.length === 0 || textTokens.length === 0) return 0;

    const matches = queryTokens.filter(qt => textTokens.some(tt => tt.includes(qt) || qt.includes(tt))).length;
    return matches / Math.max(queryTokens.length, textTokens.length);
  }

  /**
   * Retrieve relevant context from knowledge base
   */
  retrieve(query, topK = 5) {
    const results = this.knowledgeBase
      .map(item => {
        // Score based on keyword matches
        const keywordScore = item.keywords.reduce((score, keyword) => {
          if (query.toLowerCase().includes(keyword)) return score + 1;
          return score;
        }, 0) / Math.max(item.keywords.length, 1);

        // Score based on content similarity
        const contentScore = this.calculateSimilarity(query, item.content);

        // Combined score (keyword match weighted higher)
        const totalScore = keywordScore * 0.6 + contentScore * 0.4;

        return {
          ...item,
          score: totalScore,
        };
      })
      .filter(item => item.score > 0.15) // Relevance threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  }

  /**
   * Get top relevant nodes from query
   */
  getRelevantNodes(query, topK = 3) {
    const retrieved = this.retrieve(query, topK * 2);
    return retrieved
      .filter(item => item.type === 'node' || (item.metadata?.source && item.metadata?.target))
      .slice(0, topK);
  }

  /**
   * Check if query is relevant to the environment
   */
  isRelevant(query, threshold = 0.2) {
    const results = this.retrieve(query, 1);
    return results.length > 0 && results[0].score >= threshold;
  }

  /**
   * Get relevance confidence score
   */
  getRelevanceScore(query) {
    const results = this.retrieve(query, 1);
    return results.length > 0 ? results[0].score : 0;
  }

  /**
   * Get context for a specific resource
   */
  getResourceContext(resourceId) {
    const resource = this.nodes.find(n => n.id === resourceId);
    if (!resource) return null;

    // Find dependencies
    const upstreamDeps = this.edges.filter(e => (e.target?.id || e.target) === resourceId);
    const downstreamDeps = this.edges.filter(e => (e.source?.id || e.source) === resourceId);

    const upstreamServices = upstreamDeps
      .map(e => this.nodes.find(n => n.id === (e.source?.id || e.source)))
      .filter(Boolean);

    const downstreamServices = downstreamDeps
      .map(e => this.nodes.find(n => n.id === (e.target?.id || e.target)))
      .filter(Boolean);

    return {
      resource,
      upstreamServices,
      downstreamServices,
      totalConnections: upstreamDeps.length + downstreamDeps.length,
    };
  }

  /**
   * Find similar issues in the environment
   */
  findSimilarIssues(symptom) {
    const query = `${symptom} error failure`;
    const relevant = this.retrieve(query, 10);

    const issues = relevant
      .filter(item => ['node', 'status'].includes(item.type))
      .map(item => {
        if (item.type === 'node') {
          const node = this.nodes.find(n => n.id === item.id);
          return {
            type: 'service',
            name: item.name,
            status: node?.status,
            healthScore: node?.healthScore,
            layer: node?.layer,
            relevance: item.score,
          };
        }
        return null;
      })
      .filter(Boolean);

    return issues;
  }

  /**
   * Get natural language context about the infrastructure
   */
  getEnvironmentSummary() {
    const appNodes = this.nodes.filter(n => n.layer === 'application').length;
    const infraNodes = this.nodes.filter(n => n.layer === 'infrastructure').length;
    const dataNodes = this.nodes.filter(n => n.layer === 'data').length;

    const healthyCount = this.nodes.filter(n => n.status === 'healthy').length;
    const degradedCount = this.nodes.filter(n => n.status === 'degraded').length;
    const failingCount = this.nodes.filter(n => n.status === 'failing').length;

    return {
      totalServices: this.nodes.length,
      layers: { application: appNodes, infrastructure: infraNodes, data: dataNodes },
      health: { healthy: healthyCount, degraded: degradedCount, failing: failingCount },
      totalConnections: this.edges.length,
    };
  }
}
