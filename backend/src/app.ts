import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { generateFictionalData, generateAlerts, generateDeployments, generateIncidents, generateForecasts } from './fixtures';

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory store for fictional data
let fixtureData: any = null;
let alerts: any[] = [];
let deployments: any[] = [];
let incidents: any[] = [];
let forecasts: any[] = [];

// Initialize data on startup
function initializeData() {
  fixtureData = generateFictionalData();
  const { workspace, resources, services } = fixtureData;

  alerts = generateAlerts(resources, services, workspace.id);
  deployments = generateDeployments(services, workspace.id);
  incidents = generateIncidents(workspace.id);
  forecasts = generateForecasts(resources, services, workspace.id);

  console.log('✓ Fictional data initialized');
  console.log(`  - Workspace: ${workspace.name}`);
  console.log(`  - Environments: ${fixtureData.environments.length}`);
  console.log(`  - Resources: ${resources.length}`);
  console.log(`  - Services: ${services.length}`);
  console.log(`  - Dependencies: ${fixtureData.dependencies.length}`);
  console.log(`  - Alerts: ${alerts.length}`);
  console.log(`  - Incidents: ${incidents.length}`);
  console.log(`  - Forecasts: ${forecasts.length}`);
}

// API Routes

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Workspace
app.get('/api/workspace', (req: Request, res: Response) => {
  res.json(fixtureData.workspace);
});

// Environments
app.get('/api/environments', (req: Request, res: Response) => {
  res.json(fixtureData.environments);
});

// Resources
app.get('/api/resources', (req: Request, res: Response) => {
  const { environment, status } = req.query;
  let filtered = fixtureData.resources;

  if (environment) {
    filtered = filtered.filter((r: any) => r.environment_id === environment);
  }
  if (status) {
    filtered = filtered.filter((r: any) => r.status === status);
  }

  res.json(filtered);
});

app.get('/api/resources/:id', (req: Request, res: Response) => {
  const resource = fixtureData.resources.find((r: any) => r.id === req.params.id);
  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }
  res.json(resource);
});

// Services
app.get('/api/services', (req: Request, res: Response) => {
  const { environment } = req.query;
  let filtered = fixtureData.services;

  if (environment) {
    filtered = filtered.filter((s: any) => s.environment_id === environment);
  }

  res.json(filtered);
});

app.get('/api/services/:id', (req: Request, res: Response) => {
  const service = fixtureData.services.find((s: any) => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
});

// Dependencies
app.get('/api/dependencies', (req: Request, res: Response) => {
  const { sourceId, targetId, environment } = req.query;
  let filtered = fixtureData.dependencies;

  if (sourceId) {
    filtered = filtered.filter((d: any) => d.source_id === sourceId);
  }
  if (targetId) {
    filtered = filtered.filter((d: any) => d.target_id === targetId);
  }
  if (environment) {
    filtered = filtered.filter((d: any) => d.environment_id === environment);
  }

  res.json(filtered);
});

// Blast radius - find all downstream dependencies
app.get('/api/blast-radius/:resourceId/:resourceType', (req: Request, res: Response) => {
  const { resourceId, resourceType } = req.params;
  const affected = new Set<string>();
  const queue = [{ id: resourceId, type: resourceType }];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const outgoing = fixtureData.dependencies.filter(
      (d: any) => d.source_id === current.id && d.source_type === current.type
    );

    outgoing.forEach((dep: any) => {
      if (!affected.has(dep.target_id)) {
        affected.add(dep.target_id);
        queue.push({ id: dep.target_id, type: dep.target_type });
      }
    });
  }

  res.json({ resourceId, resourceType, affected_count: affected.size, affected: Array.from(affected) });
});

// Alerts
app.get('/api/alerts', (req: Request, res: Response) => {
  const { severity, status } = req.query;
  let filtered = alerts;

  if (severity) {
    filtered = filtered.filter((a: any) => a.severity === severity);
  }
  if (status) {
    filtered = filtered.filter((a: any) => a.status === status);
  }

  res.json(filtered);
});

app.get('/api/alerts/:id', (req: Request, res: Response) => {
  const alert = alerts.find((a: any) => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  res.json(alert);
});

// Deployments
app.get('/api/deployments', (req: Request, res: Response) => {
  const { serviceId, status } = req.query;
  let filtered = deployments;

  if (serviceId) {
    filtered = filtered.filter((d: any) => d.service_id === serviceId);
  }
  if (status) {
    filtered = filtered.filter((d: any) => d.status === status);
  }

  res.json(filtered);
});

// Incidents
app.get('/api/incidents', (req: Request, res: Response) => {
  const { status, severity } = req.query;
  let filtered = incidents;

  if (status) {
    filtered = filtered.filter((i: any) => i.status === status);
  }
  if (severity) {
    filtered = filtered.filter((i: any) => i.severity === severity);
  }

  res.json(filtered);
});

app.get('/api/incidents/:id', (req: Request, res: Response) => {
  const incident = incidents.find((i: any) => i.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  res.json(incident);
});

// Forecasts
app.get('/api/forecasts', (req: Request, res: Response) => {
  const { riskLevel, acknowledged } = req.query;
  let filtered = forecasts;

  if (riskLevel) {
    filtered = filtered.filter((f: any) => f.risk_level === riskLevel);
  }
  if (acknowledged !== undefined) {
    filtered = filtered.filter((f: any) => f.acknowledged === (acknowledged === 'true'));
  }

  res.json(filtered);
});

// Teams
app.get('/api/teams', (req: Request, res: Response) => {
  res.json(fixtureData.teams);
});

// Assistant - Simple question resolver
app.post('/api/assistant/ask', (req: Request, res: Response) => {
  const { question, context } = req.body;

  // Simple pattern-based assistant (ready for LLM integration)
  let answer = '';
  let evidence: any[] = [];
  let confidence = 0;

  if (question.toLowerCase().includes('depends on')) {
    // "What depends on X?"
    const deps = fixtureData.dependencies.filter((d: any) => d.target_id === context?.selectedId);
    answer = `${deps.length} service(s) depend on this resource.`;
    evidence = deps;
    confidence = 0.95;
  } else if (question.toLowerCase().includes('changed') || question.toLowerCase().includes('deployment')) {
    answer = 'A deployment occurred 90 minutes ago to the Payments Service (v2.1.4). Changed files: payments/handler.ts, payments/db-queries.sql. Configuration changed: DB_TIMEOUT reduced from 3000ms to 2000ms.';
    evidence = deployments;
    confidence = 0.98;
  } else if (question.toLowerCase().includes('failing') || question.toLowerCase().includes('error')) {
    answer = 'The Payments Service is experiencing a critical error rate (6.42% vs 5% threshold). Root cause may be related to the recent deployment and database timeout configuration.';
    evidence = alerts;
    confidence = 0.85;
  } else {
    answer = 'I need more context. Try asking about: what depends on X, what changed, why is X failing, or what should we check next.';
    confidence = 0.6;
  }

  res.json({
    answer,
    evidence,
    confidence,
    context: { environment: 'production', timeframe: 'last 2 hours' },
    next_steps: ['Check deployment rollback option', 'Review database connection pool', 'Analyze error logs'],
  });
});

// Incident investigation
app.post('/api/incidents/:id/investigate', (req: Request, res: Response) => {
  const incident = incidents.find((i: any) => i.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }

  // Return investigation context
  const relatedAlerts = alerts.filter((a: any) => a.severity === 'critical');
  const relatedDeployments = deployments.filter((d: any) => d.risk_score > 0.5);

  res.json({
    incident,
    related_alerts: relatedAlerts,
    related_deployments: relatedDeployments,
    timeline: [
      { time: new Date(Date.now() - 90 * 60 * 1000).toISOString(), event: 'Deployment v2.1.4 completed' },
      {
        time: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        event: 'Alert triggered: High Error Rate on Payments Service',
      },
      { time: new Date().toISOString(), event: 'Investigation initiated' },
    ],
  });
});

// Generate report
app.post('/api/reports', (req: Request, res: Response) => {
  const { incidentId, type } = req.body;

  const report = {
    id: require('uuid').v4(),
    title: 'Post-Incident Report - Payments Service Degradation',
    type: type || 'incident',
    content: `# Incident Summary
    
Service: Payments Service
Severity: Critical
Duration: ~60 minutes
Status: Investigating

## Timeline
- 90 minutes ago: Deployment v2.1.4 deployed
- 60 minutes ago: High error rate alert triggered (6.42%)
- Now: Investigation ongoing

## Probable Cause
Database timeout configuration change in recent deployment reduced timeout from 3000ms to 2000ms, causing query timeouts under load.

## Recommended Actions
1. Rollback to previous version
2. Review database performance metrics
3. Implement gradual timeout reduction
4. Add automated testing for timeout scenarios

## Evidence
- Error rate spike correlates exactly with deployment time
- Database CPU elevated to 87%
- Similar incident pattern observed 2x historically`,
    generated_at: new Date().toISOString(),
  };

  res.json(report);
});

// Start server
app.listen(port, () => {
  console.log(`\n🚀 Cloud Dependency Atlas Backend listening on port ${port}`);
  console.log(`   GET  http://localhost:${port}/health`);
  console.log(`   GET  http://localhost:${port}/api/workspace`);
  console.log(`   GET  http://localhost:${port}/api/resources`);
  console.log(`   GET  http://localhost:${port}/api/services`);
  console.log(`   POST http://localhost:${port}/api/assistant/ask\n`);

  initializeData();
});

export default app;
