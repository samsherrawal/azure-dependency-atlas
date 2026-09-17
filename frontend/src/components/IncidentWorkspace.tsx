import React, { useEffect, useState } from 'react';

export default function IncidentWorkspace() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/incidents')
      .then((r) => r.json())
      .then((data) => {
        setIncidents(data);
        if (data.length > 0) setSelectedIncident(data[0]);
      });
  }, []);

  const handleInvestigate = async () => {
    if (!selectedIncident) return;

    const res = await fetch(`http://localhost:5000/api/incidents/${selectedIncident.id}/investigate`, {
      method: 'POST',
    });
    const data = await res.json();
    console.log('Investigation data:', data);
  };

  const handleGenerateReport = async () => {
    if (!selectedIncident) return;

    const res = await fetch('http://localhost:5000/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId: selectedIncident.id, type: 'incident' }),
    });
    const data = await res.json();
    setReport(data);
  };

  if (!selectedIncident) {
    return (
      <div className="panel incident-panel">
        <p>No incidents to investigate</p>
      </div>
    );
  }

  return (
    <div className="panel incident-panel">
      <div className="incident-list">
        <h2>Incidents</h2>
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`incident-card ${selectedIncident?.id === incident.id ? 'selected' : ''}`}
            onClick={() => setSelectedIncident(incident)}
          >
            <div className="incident-title">{incident.title}</div>
            <div className={`incident-severity ${incident.severity}`}>{incident.severity}</div>
            <div className="incident-status">{incident.status}</div>
          </div>
        ))}
      </div>

      <div className="incident-detail">
        <div className="incident-header">
          <h2>{selectedIncident.title}</h2>
          <span className={`severity-badge ${selectedIncident.severity}`}>{selectedIncident.severity}</span>
          <span className={`status-badge ${selectedIncident.status}`}>{selectedIncident.status}</span>
        </div>

        <div className="incident-meta">
          <div>
            <strong>Created:</strong> {new Date(selectedIncident.created_at).toLocaleString()}
          </div>
          <div>
            <strong>Description:</strong> {selectedIncident.description}
          </div>
        </div>

        <div className="investigation-section">
          <h3>Investigation Notes</h3>
          <textarea
            value={investigationNotes}
            onChange={(e) => setInvestigationNotes(e.target.value)}
            placeholder="Record findings, hypotheses, and confirmed root causes..."
            rows={5}
          />
        </div>

        <div className="investigation-timeline">
          <h3>Timeline</h3>
          <div className="timeline">
            <div className="timeline-event">
              <div className="timeline-time">-90 min</div>
              <div className="timeline-content">Deployment v2.1.4 completed to Payments Service</div>
            </div>
            <div className="timeline-event">
              <div className="timeline-time">-60 min</div>
              <div className="timeline-content">Alert triggered: High Error Rate (6.42%)</div>
            </div>
            <div className="timeline-event">
              <div className="timeline-time">Now</div>
              <div className="timeline-content">Investigation initiated</div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleInvestigate} className="btn btn-primary">
            Load Investigation Context
          </button>
          <button onClick={handleGenerateReport} className="btn btn-secondary">
            Generate Report
          </button>
        </div>

        {report && (
          <div className="report-preview">
            <h3>Generated Report</h3>
            <div className="report-content">
              <h4>{report.title}</h4>
              <pre>{report.content}</pre>
              <button className="btn btn-sm">Export as PDF</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
