import React, { useEffect, useState } from 'react';

interface ServiceDetailsProps {
  service: any;
}

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  const [dependencies, setDependencies] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);

  useEffect(() => {
    if (!service) return;

    Promise.all([
      fetch(`http://localhost:5000/api/dependencies?sourceId=${service.id}`).then((r) => r.json()),
      fetch('http://localhost:5000/api/alerts').then((r) => r.json()),
      fetch(`http://localhost:5000/api/deployments?serviceId=${service.id}`).then((r) => r.json()),
    ]).then(([deps, alts, deps2]) => {
      setDependencies(deps);
      setAlerts(alts);
      setDeployments(deps2);
    });
  }, [service]);

  if (!service) {
    return (
      <div className="panel details-panel">
        <p className="empty-state">Select a service to view details</p>
      </div>
    );
  }

  return (
    <div className="panel details-panel">
      <div className="service-header">
        <h2>{service.name}</h2>
        <span className={`status-badge ${service.status}`}>{service.status}</span>
      </div>

      <div className="details-section">
        <h3>Health</h3>
        <div className="health-indicator">
          <div className={`health-dot ${service.status}`}></div>
          <span>{service.status.toUpperCase()}</span>
        </div>
      </div>

      <div className="details-section">
        <h3>Dependencies ({dependencies.length})</h3>
        <div className="dependencies-list">
          {dependencies.map((dep) => (
            <div key={dep.id} className="dep-card">
              <div className="dep-confidence">{Math.round(dep.confidence * 100)}%</div>
              <div className="dep-method">{dep.discovery_method}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="details-section">
        <h3>Active Alerts ({alerts.length})</h3>
        <div className="alerts-list">
          {alerts.filter((a) => a.status === 'active').map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.severity}`}>
              <div className="alert-title">{alert.title}</div>
              <div className="alert-time">{new Date(alert.triggered_at).toLocaleTimeString()}</div>
            </div>
          ))}
          {alerts.filter((a) => a.status === 'active').length === 0 && <p>No active alerts</p>}
        </div>
      </div>

      <div className="details-section">
        <h3>Recent Deployments ({deployments.length})</h3>
        <div className="deployments-list">
          {deployments.map((dep) => (
            <div key={dep.id} className={`deployment-item ${dep.status}`}>
              <div className="version">{dep.version}</div>
              <div className="deployment-time">{new Date(dep.timestamp).toLocaleTimeString()}</div>
              <div className="risk-score">Risk: {Math.round(dep.risk_score * 100)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
