-- Cloud Dependency Atlas - PostgreSQL Schema
-- Fictional data model for MVP

-- Workspace
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer', -- admin, editor, viewer
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, email)
);

-- Cloud Account (subscription, project, etc.)
CREATE TABLE IF NOT EXISTS cloud_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  provider VARCHAR(50) NOT NULL, -- azure, aws, gcp
  account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Environment
CREATE TABLE IF NOT EXISTS environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  cloud_account_id UUID REFERENCES cloud_accounts(id),
  name VARCHAR(255) NOT NULL, -- prod, staging, dev
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, name)
);

-- Team/Owner
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource (VM, Database, Function, etc.)
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  environment_id UUID REFERENCES environments(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- vm, database, function, storage, network, etc.
  provider_type VARCHAR(100), -- azure-vm, azure-sql, azure-function, etc.
  provider_id VARCHAR(255), -- resource id from cloud provider
  status VARCHAR(50) DEFAULT 'running', -- running, stopped, degraded, failed
  owner_id UUID REFERENCES teams(id),
  metadata JSONB, -- flexible storage for resource-specific data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, environment_id, name)
);

-- Application/Service
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  environment_id UUID REFERENCES environments(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES teams(id),
  critical BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'healthy', -- healthy, degraded, unhealthy
  repo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, environment_id, name)
);

-- Dependency Relationship
CREATE TABLE IF NOT EXISTS dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  source_id UUID NOT NULL,
  source_type VARCHAR(50) NOT NULL, -- resource, service
  target_id UUID NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- resource, service
  environment_id UUID REFERENCES environments(id),
  confidence FLOAT DEFAULT 1.0, -- 0.0 to 1.0
  discovery_method VARCHAR(100), -- terraform, kubernetes, logs, manual, api-call
  direction VARCHAR(20) DEFAULT 'unknown', -- inbound, outbound, bidirectional
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB, -- evidence, related resources
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(workspace_id, source_id, target_id, environment_id)
);

-- Repository
CREATE TABLE IF NOT EXISTS repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  owner_id UUID REFERENCES teams(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pipeline / CI/CD Job
CREATE TABLE IF NOT EXISTS pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  repository_id UUID REFERENCES repositories(id),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'idle', -- idle, running, success, failed
  last_run TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deployment
CREATE TABLE IF NOT EXISTS deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  service_id UUID REFERENCES services(id),
  pipeline_id UUID REFERENCES pipelines(id),
  environment_id UUID REFERENCES environments(id),
  version VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, successful, failed, rolled_back
  deployed_by VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  risk_score FLOAT DEFAULT 0.0,
  metadata JSONB, -- changed files, config diffs
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alert
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  resource_id UUID REFERENCES resources(id),
  service_id UUID REFERENCES services(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  severity VARCHAR(50) NOT NULL, -- critical, high, medium, low
  status VARCHAR(50) DEFAULT 'active', -- active, acknowledged, resolved
  source VARCHAR(100), -- azure-monitor, application, synthetic
  triggered_at TIMESTAMP,
  resolved_at TIMESTAMP,
  metadata JSONB, -- metric value, threshold, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incident
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  severity VARCHAR(50) NOT NULL, -- critical, high, medium, low
  status VARCHAR(50) DEFAULT 'open', -- open, investigating, mitigated, resolved
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Investigation Message / Evidence Trail
CREATE TABLE IF NOT EXISTS investigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  message TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL, -- question, observation, hypothesis, confirmed
  evidence_data JSONB, -- references to alerts, logs, changes
  confidence VARCHAR(50), -- suspected, supported, confirmed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Change Proposal / Review
CREATE TABLE IF NOT EXISTS changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  deployment_id UUID REFERENCES deployments(id),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, deployed, rolled_back
  affected_resources JSONB, -- array of resource IDs and types
  risk_assessment JSONB, -- risk score, affected services, dependencies
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forecast / Risk Signal
CREATE TABLE IF NOT EXISTS forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  resource_id UUID REFERENCES resources(id),
  service_id UUID REFERENCES services(id),
  risk_type VARCHAR(100) NOT NULL, -- capacity, latency, errors, deployment_failure, cert_expiry
  risk_level VARCHAR(50) NOT NULL, -- low, medium, high, critical
  confidence FLOAT DEFAULT 0.0, -- 0.0 to 1.0
  supporting_signals JSONB, -- worsening trends, historical patterns, etc.
  expected_timeframe TEXT, -- e.g., "24-48 hours", "next week"
  acknowledged BOOLEAN DEFAULT FALSE,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Report
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  title VARCHAR(500) NOT NULL,
  type VARCHAR(100) NOT NULL, -- incident, deployment_impact, operational_summary
  content TEXT,
  incident_id UUID REFERENCES incidents(id),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metric (time series - in real scenario, use InfluxDB or similar)
CREATE TABLE IF NOT EXISTS metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  resource_id UUID REFERENCES resources(id),
  service_id UUID REFERENCES services(id),
  metric_name VARCHAR(255) NOT NULL, -- cpu, memory, latency, error_rate, throughput
  metric_value FLOAT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

-- Indexes for performance
CREATE INDEX idx_users_workspace ON users(workspace_id);
CREATE INDEX idx_resources_workspace ON resources(workspace_id);
CREATE INDEX idx_resources_environment ON resources(environment_id);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_services_workspace ON services(workspace_id);
CREATE INDEX idx_services_environment ON services(environment_id);
CREATE INDEX idx_dependencies_workspace ON dependencies(workspace_id);
CREATE INDEX idx_dependencies_source ON dependencies(source_id, source_type);
CREATE INDEX idx_dependencies_target ON dependencies(target_id, target_type);
CREATE INDEX idx_alerts_workspace ON alerts(workspace_id);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_incidents_workspace ON incidents(workspace_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_investigations_incident ON investigations(incident_id);
CREATE INDEX idx_deployments_service ON deployments(service_id);
CREATE INDEX idx_deployments_environment ON deployments(environment_id);
CREATE INDEX idx_forecasts_resource ON forecasts(resource_id);
CREATE INDEX idx_forecasts_risk_level ON forecasts(risk_level);
CREATE INDEX idx_metrics_resource ON metrics(resource_id, timestamp);
CREATE INDEX idx_metrics_service ON metrics(service_id, timestamp);
