import { v4 as uuidv4 } from 'uuid';

interface Workspace {
  id: string;
  name: string;
}

interface Environment {
  id: string;
  name: string;
  workspace_id: string;
}

interface Team {
  id: string;
  name: string;
}

interface Resource {
  id: string;
  name: string;
  type: string;
  environment_id: string;
  status: string;
  owner_id: string;
}

interface Service {
  id: string;
  name: string;
  environment_id: string;
  owner_id: string;
  status: string;
}

interface Dependency {
  source_id: string;
  source_type: string;
  target_id: string;
  target_type: string;
  confidence: number;
  discovery_method: string;
}

// Generate fictional Azure infrastructure data
export function generateFictionalData() {
  const workspace: Workspace = {
    id: uuidv4(),
    name: 'Acme Corp - Production Atlas',
  };

  // Teams
  const teams: Team[] = [
    { id: uuidv4(), name: 'Platform Team' },
    { id: uuidv4(), name: 'Payments Team' },
    { id: uuidv4(), name: 'User Services Team' },
    { id: uuidv4(), name: 'Data & Analytics' },
  ];

  // Environments
  const environments: Environment[] = [
    { id: uuidv4(), name: 'production', workspace_id: workspace.id },
    { id: uuidv4(), name: 'staging', workspace_id: workspace.id },
    { id: uuidv4(), name: 'development', workspace_id: workspace.id },
  ];

  const prodEnv = environments[0];
  const stagingEnv = environments[1];
  const devEnv = environments[2];

  // Resources (Azure services)
  const resources: Resource[] = [
    // Production - Core Infrastructure
    {
      id: uuidv4(),
      name: 'prod-apim-primary',
      type: 'api-gateway',
      environment_id: prodEnv.id,
      status: 'running',
      owner_id: teams[0].id,
    },
    {
      id: uuidv4(),
      name: 'prod-sql-primary',
      type: 'database',
      environment_id: prodEnv.id,
      status: 'running',
      owner_id: teams[3].id,
    },
    {
      id: uuidv4(),
      name: 'prod-app-service-api',
      type: 'app-service',
      environment_id: prodEnv.id,
      status: 'running',
      owner_id: teams[2].id,
    },
    {
      id: uuidv4(),
      name: 'prod-app-service-payments',
      type: 'app-service',
      environment_id: prodEnv.id,
      status: 'degraded',
      owner_id: teams[1].id,
    },
    {
      id: uuidv4(),
      name: 'prod-redis-cache',
      type: 'cache',
      environment_id: prodEnv.id,
      status: 'running',
      owner_id: teams[0].id,
    },
    {
      id: uuidv4(),
      name: 'prod-storage-blobs',
      type: 'storage',
      environment_id: prodEnv.id,
      status: 'running',
      owner_id: teams[3].id,
    },
    {
      id: uuidv4(),
      name: 'prod-function-notifications',
      type: 'function-app',
      environment_id: prodEnv.id,
      status: 'running',
      owner_id: teams[0].id,
    },
    {
      id: uuidv4(),
      name: 'prod-cosmos-events',
      type: 'database',
      environment_id: prodEnv.id,
      status: 'running',
      owner_id: teams[3].id,
    },

    // Staging
    {
      id: uuidv4(),
      name: 'staging-apim',
      type: 'api-gateway',
      environment_id: stagingEnv.id,
      status: 'running',
      owner_id: teams[0].id,
    },
    {
      id: uuidv4(),
      name: 'staging-sql',
      type: 'database',
      environment_id: stagingEnv.id,
      status: 'running',
      owner_id: teams[3].id,
    },

    // Development
    {
      id: uuidv4(),
      name: 'dev-sql',
      type: 'database',
      environment_id: devEnv.id,
      status: 'running',
      owner_id: teams[3].id,
    },
  ];

  // Services
  const services: Service[] = [
    {
      id: uuidv4(),
      name: 'User API',
      environment_id: prodEnv.id,
      owner_id: teams[2].id,
      status: 'healthy',
    },
    {
      id: uuidv4(),
      name: 'Payments Service',
      environment_id: prodEnv.id,
      owner_id: teams[1].id,
      status: 'unhealthy',
    },
    {
      id: uuidv4(),
      name: 'Notifications Service',
      environment_id: prodEnv.id,
      owner_id: teams[0].id,
      status: 'healthy',
    },
    {
      id: uuidv4(),
      name: 'Data Pipeline',
      environment_id: prodEnv.id,
      owner_id: teams[3].id,
      status: 'healthy',
    },
  ];

  const userApi = services[0];
  const paymentsService = services[1];
  const notificationsService = services[2];
  const dataPipeline = services[3];

  // Dependencies
  const dependencies: Dependency[] = [
    // User API depends on
    {
      source_id: userApi.id,
      source_type: 'service',
      target_id: resources[2].id, // prod-app-service-api
      target_type: 'resource',
      confidence: 1.0,
      discovery_method: 'kubernetes',
    },
    {
      source_id: userApi.id,
      source_type: 'service',
      target_id: resources[1].id, // prod-sql-primary
      target_type: 'resource',
      confidence: 1.0,
      discovery_method: 'logs',
    },
    {
      source_id: userApi.id,
      source_type: 'service',
      target_id: resources[4].id, // prod-redis-cache
      target_type: 'resource',
      confidence: 0.95,
      discovery_method: 'terraform',
    },

    // Payments Service depends on
    {
      source_id: paymentsService.id,
      source_type: 'service',
      target_id: resources[3].id, // prod-app-service-payments
      target_type: 'resource',
      confidence: 1.0,
      discovery_method: 'kubernetes',
    },
    {
      source_id: paymentsService.id,
      source_type: 'service',
      target_id: resources[1].id, // prod-sql-primary
      target_type: 'resource',
      confidence: 1.0,
      discovery_method: 'logs',
    },
    {
      source_id: paymentsService.id,
      source_type: 'service',
      target_id: userApi.id,
      target_type: 'service',
      confidence: 0.98,
      discovery_method: 'api-call',
    },

    // Notifications Service depends on
    {
      source_id: notificationsService.id,
      source_type: 'service',
      target_id: resources[6].id, // prod-function-notifications
      target_type: 'resource',
      confidence: 1.0,
      discovery_method: 'kubernetes',
    },
    {
      source_id: notificationsService.id,
      source_type: 'service',
      target_id: paymentsService.id,
      target_type: 'service',
      confidence: 0.95,
      discovery_method: 'logs',
    },

    // Data Pipeline depends on
    {
      source_id: dataPipeline.id,
      source_type: 'service',
      target_id: resources[7].id, // prod-cosmos-events
      target_type: 'resource',
      confidence: 1.0,
      discovery_method: 'terraform',
    },
    {
      source_id: dataPipeline.id,
      source_type: 'service',
      target_id: resources[5].id, // prod-storage-blobs
      target_type: 'resource',
      confidence: 1.0,
      discovery_method: 'terraform',
    },
  ];

  return {
    workspace,
    teams,
    environments,
    resources,
    services,
    dependencies,
  };
}

export function generateAlerts(resources: Resource[], services: Service[], workspace_id: string) {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  return [
    {
      id: uuidv4(),
      workspace_id,
      resource_id: resources[3].id, // prod-app-service-payments (degraded)
      service_id: services[1].id,
      title: 'High Error Rate on Payments Service',
      description: 'Error rate exceeded 5% threshold',
      severity: 'critical',
      status: 'active',
      source: 'azure-monitor',
      triggered_at: oneHourAgo,
      resolved_at: null,
      metadata: {
        metric: 'error_rate',
        current_value: 0.0642,
        threshold: 0.05,
        anomaly_detected_at: oneHourAgo,
      },
    },
    {
      id: uuidv4(),
      workspace_id,
      resource_id: resources[1].id, // prod-sql-primary
      service_id: null,
      title: 'SQL Database High CPU Usage',
      description: 'CPU utilization at 87%',
      severity: 'high',
      status: 'active',
      source: 'azure-monitor',
      triggered_at: twoHoursAgo,
      resolved_at: null,
      metadata: {
        metric: 'cpu_percent',
        current_value: 0.87,
        threshold: 0.8,
      },
    },
    {
      id: uuidv4(),
      workspace_id,
      resource_id: resources[4].id, // prod-redis-cache
      service_id: null,
      title: 'Redis Cache Eviction Rate High',
      description: 'Eviction rate indicates memory pressure',
      severity: 'medium',
      status: 'acknowledged',
      source: 'azure-monitor',
      triggered_at: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      resolved_at: null,
      metadata: {
        metric: 'eviction_rate',
        current_value: 0.12,
      },
    },
  ];
}

export function generateDeployments(services: Service[], workspace_id: string) {
  const now = new Date();

  return [
    {
      id: uuidv4(),
      workspace_id,
      service_id: services[1].id, // Payments Service - recent problematic deployment
      environment_id: services[1].environment_id,
      version: 'v2.1.4',
      status: 'successful',
      deployed_by: 'ci-pipeline',
      timestamp: new Date(now.getTime() - 90 * 60 * 1000), // 90 minutes ago
      risk_score: 0.7,
      metadata: {
        changed_files: ['payments/handler.ts', 'payments/db-queries.sql'],
        config_changes: ['DB_TIMEOUT: 3000->2000ms'],
        rollback_available: true,
      },
    },
    {
      id: uuidv4(),
      workspace_id,
      service_id: services[0].id, // User API
      environment_id: services[0].environment_id,
      version: 'v1.8.2',
      status: 'successful',
      deployed_by: 'ci-pipeline',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      risk_score: 0.2,
      metadata: {
        changed_files: ['api/users/index.ts'],
        config_changes: [],
        rollback_available: false,
      },
    },
  ];
}

export function generateIncidents(workspace_id: string) {
  const now = new Date();

  return [
    {
      id: uuidv4(),
      workspace_id,
      title: 'Payments Service - High Error Rate (Ongoing)',
      description:
        'Payments service experiencing elevated error rates. Started ~90 minutes after recent deployment.',
      severity: 'critical',
      status: 'investigating',
      created_at: new Date(now.getTime() - 60 * 60 * 1000),
      updated_at: now,
      resolved_at: null,
    },
  ];
}

export function generateForecasts(resources: Resource[], services: Service[], workspace_id: string) {
  return [
    {
      id: uuidv4(),
      workspace_id,
      resource_id: resources[1].id, // SQL Database
      service_id: null,
      risk_type: 'capacity',
      risk_level: 'high',
      confidence: 0.88,
      supporting_signals: {
        trend: 'worsening',
        days_to_limit: 3,
        current_usage: '87%',
        growth_rate: '5% per day',
      },
      expected_timeframe: '2-3 days',
      acknowledged: false,
      dismissed: false,
    },
    {
      id: uuidv4(),
      workspace_id,
      resource_id: null,
      service_id: services[1].id, // Payments Service
      risk_type: 'deployment_failure',
      risk_level: 'high',
      confidence: 0.75,
      supporting_signals: {
        recent_deployment: 'v2.1.4 - 90 minutes ago',
        error_rate_correlation: 'strong',
        previous_similar_failures: 2,
      },
      expected_timeframe: 'now',
      acknowledged: false,
      dismissed: false,
    },
  ];
}
