import React, { useEffect, useState } from 'react';

interface DependencyGraphProps {
  onServiceSelect: (service: any) => void;
}

export default function DependencyGraph({ onServiceSelect }: DependencyGraphProps) {
  const [services, setServices] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/services').then((r) => r.json()),
      fetch('http://localhost:5000/api/resources').then((r) => r.json()),
      fetch('http://localhost:5000/api/dependencies').then((r) => r.json()),
    ]).then(([svc, res, deps]) => {
      setServices(svc);
      setResources(res);
      setDependencies(deps);
    });
  }, []);

  const handleNodeClick = (id: string, type: string) => {
    setSelectedId(id);
    if (type === 'service') {
      const service = services.find((s) => s.id === id);
      onServiceSelect(service);
    }
  };

  return (
    <div className="panel graph-panel">
      <h2>Dependency Topology</h2>
      <div className="graph-container">
        {/* Cytoscape will be rendered here */}
        <div className="graph-placeholder">
          <div className="node-list">
            <h3>Services</h3>
            {services.map((svc) => (
              <div
                key={svc.id}
                className={`node service-node ${svc.status} ${selectedId === svc.id ? 'selected' : ''}`}
                onClick={() => handleNodeClick(svc.id, 'service')}
              >
                <div className="status-icon">●</div>
                <div className="node-info">
                  <div className="node-name">{svc.name}</div>
                  <div className="node-status">{svc.status}</div>
                </div>
              </div>
            ))}

            <h3>Resources</h3>
            {resources.slice(0, 5).map((res) => (
              <div key={res.id} className={`node resource-node ${res.status}`} onClick={() => handleNodeClick(res.id, 'resource')}>
                <div className="status-icon">◆</div>
                <div className="node-info">
                  <div className="node-name">{res.name}</div>
                  <div className="node-type">{res.type}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="dependencies-info">
            <h3>Dependencies: {dependencies.length}</h3>
            <p>Visualization ready for Cytoscape.js integration</p>
            {selectedId && (
              <div className="related-deps">
                <h4>Related Dependencies</h4>
                {dependencies
                  .filter((d) => d.source_id === selectedId || d.target_id === selectedId)
                  .map((dep) => (
                    <div key={dep.id} className="dep-item">
                      <span className="confidence">{Math.round(dep.confidence * 100)}%</span>
                      <span className="method">{dep.discovery_method}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
