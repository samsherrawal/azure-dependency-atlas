import React, { useEffect, useState } from 'react';

interface HealthDashboardProps {
  onIncidentSelect: () => void;
}

export default function HealthDashboard({ onIncidentSelect }: HealthDashboardProps) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/alerts').then((r) => r.json()),
      fetch('http://localhost:5000/api/incidents').then((r) => r.json()),
      fetch('http://localhost:5000/api/forecasts').then((r) => r.json()),
      fetch('http://localhost:5000/api/resources').then((r) => r.json()),
    ]).then(([alts, incs, fcst, res]) => {
      setAlerts(alts);
      setIncidents(incs);
      setForecasts(fcst);
      setResources(res);
    });
  }, []);

  const criticalCount = alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length;
  const healthyResources = resources.filter((r) => r.status === 'running').length;
  const healthyPercent = resources.length > 0 ? Math.round((healthyResources / resources.length) * 100) : 0;

  return (
    <div className="panel dashboard-panel">
      <h2>Environment Health Overview</h2>

      <div className="dashboard-grid">
        <div className="card stat-card">
          <div className="stat-value">{healthyPercent}%</div>
          <div className="stat-label">Resources Healthy</div>
          <div className="stat-detail">{healthyResources} of {resources.length}</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value critical">{criticalCount}</div>
          <div className="stat-label">Critical Alerts</div>
          <div className="stat-detail">Active now</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value">{incidents.filter((i) => i.status !== 'resolved').length}</div>
          <div className="stat-label">Open Incidents</div>
          <div className="stat-detail">Require attention</div>
        </div>

        <div className="card stat-card">
          <div className="stat-value warning">{forecasts.filter((f) => f.risk_level === 'high').length}</div>
          <div className="stat-label">Risk Warnings</div>
          <div className="stat-detail">Early indicators</div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="card alert-card">
          <h3>🚨 Critical Alerts</h3>
          <div className="alert-items">
            {alerts
              .filter((a) => a.severity === 'critical' && a.status === 'active')
              .map((alert) => (
                <div key={alert.id} className="alert-row">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-desc">{alert.description}</div>
                  <div className="alert-time">{new Date(alert.triggered_at).toLocaleTimeString()}</div>
                </div>
              ))}
            {criticalCount === 0 && <p>All systems nominal</p>}
          </div>
        </div>

        <div className="card incident-card">
          <h3>⚠️ Open Incidents</h3>
          <div className="incident-items">
            {incidents
              .filter((i) => i.status !== 'resolved')
              .map((incident) => (
                <div key={incident.id} className="incident-row" onClick={onIncidentSelect}>
                  <div className="incident-title">{incident.title}</div>
                  <div className="incident-severity">{incident.severity}</div>
                  <div className="incident-status">{incident.status}</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="card forecast-card">
        <h3>🔮 Early Risk Warnings</h3>
        <div className="forecast-items">
          {forecasts.slice(0, 3).map((forecast) => (
            <div key={forecast.id} className={`forecast-item ${forecast.risk_level}`}>
              <div className="forecast-type">{forecast.risk_type}</div>
              <div className="forecast-level">{forecast.risk_level.toUpperCase()}</div>
              <div className="forecast-confidence">Confidence: {Math.round(forecast.confidence * 100)}%</div>
              <div className="forecast-timeframe">{forecast.expected_timeframe}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="last-updated">Last updated: {new Date().toLocaleTimeString()}</div>
    </div>
  );
}
