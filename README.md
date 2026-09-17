# Cloud Dependency Atlas - MVP

An end-to-end infrastructure intelligence platform demonstrating deployment impact analysis, incident investigation, and infrastructure troubleshooting workflows.

## 🎯 What's Included

### Backend (Express + TypeScript)
- REST API endpoints for resources, services, dependencies, alerts, incidents, forecasts
- Fictional Azure infrastructure data (3 environments: prod, staging, dev)
- Context-aware assistant with evidence references (ready for LLM integration)
- Blast radius calculation
- Investigation and report generation endpoints

### Frontend (React + TypeScript + Tailwind)
- **Three-pane workspace layout:**
  - Left: Persistent atlas assistant chatbot
  - Center: Dependency graph, health dashboard, incident workspace
  - Right: Service details with health, dependencies, alerts, changes
- **Screens:**
  - Dashboard: Health overview, active alerts, risks, recent changes
  - Topology: Interactive dependency graph visualization
  - Incidents: Investigation workspace with timeline and report generation
- **Responsive design**: Desktop, tablet, mobile support

### Data Model
- Workspaces, users, cloud accounts
- Environments, resources, services
- Dependencies with confidence and discovery method
- Alerts, incidents, deployments, forecasts
- Teams/ownership metadata

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)
- npm or pnpm

### Option 1: Local Development (No Docker)

```bash
# Install backend dependencies
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000

# In another terminal, install frontend dependencies
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### Option 2: Docker Compose

```bash
docker-compose up
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
# PostgreSQL: localhost:5432
```

## 📊 Features

### Health Dashboard
- Resource health summary (% healthy)
- Critical alerts count and details
- Open incidents tracker
- Early-warning forecasts with confidence scores
- Real-time sync status

### Dependency Topology
- Service and resource nodes
- Dependency confidence levels
- Discovery method indicators (terraform, logs, kubernetes, api-call)
- Blast radius analysis
- Service health status visualization

### Service Details Panel
- Service name and status
- Dependencies count and types
- Active alerts with severity
- Recent deployments with risk scores
- Owner/team assignment

### Incident Investigation
- Incident timeline with events
- Related alerts and deployments
- Investigation notes (freeform)
- Post-incident report generation
- Evidence linking

### Atlas Assistant
- Context-aware Q&A about dependencies
- Infrastructure explanation
- Deployment impact analysis
- Pattern-based query resolver (ready for LLM)
- Evidence references and confidence indicators
- Suggested next steps

### Early-Warning Forecasts
- Capacity trending
- Deployment failure patterns
- Service health risk indicators
- Confidence scoring
- Dismissal/acknowledgment tracking

## 🏗️ Architecture

```
cloud-dependency-atlas/
├── backend/
│   ├── src/
│   │   ├── app.ts           (Express server, route handlers)
│   │   └── fixtures.ts      (Fictional data generators)
│   ├── schema.sql           (PostgreSQL schema)
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.tsx          (Main layout)
│   │   ├── App.css          (Styling)
│   │   ├── main.tsx         (Entry point)
│   │   └── components/
│   │       ├── Layout.tsx
│   │       ├── DependencyGraph.tsx
│   │       ├── ServiceDetails.tsx
│   │       ├── AssistantChat.tsx
│   │       ├── HealthDashboard.tsx
│   │       └── IncidentWorkspace.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📡 API Endpoints

### Workspace & Configuration
- `GET /health` - Health check
- `GET /api/workspace` - Current workspace
- `GET /api/environments` - All environments
- `GET /api/teams` - All teams

### Resources & Services
- `GET /api/resources` - List resources (filters: environment, status)
- `GET /api/resources/:id` - Resource details
- `GET /api/services` - List services (filters: environment)
- `GET /api/services/:id` - Service details

### Dependencies & Impact
- `GET /api/dependencies` - List dependencies (filters: sourceId, targetId, environment)
- `GET /api/blast-radius/:resourceId/:resourceType` - Calculate blast radius

### Monitoring
- `GET /api/alerts` - List alerts (filters: severity, status)
- `GET /api/alerts/:id` - Alert details
- `GET /api/deployments` - List deployments (filters: serviceId, status)

### Incidents & Investigation
- `GET /api/incidents` - List incidents (filters: status, severity)
- `GET /api/incidents/:id` - Incident details
- `POST /api/incidents/:id/investigate` - Get investigation context
- `POST /api/reports` - Generate incident report

### Forecasts & Risks
- `GET /api/forecasts` - List forecasts (filters: riskLevel, acknowledged)

### Assistant
- `POST /api/assistant/ask` - Query assistant (body: question, context)

## 🗂️ Fictional Data Scenario

**Workspace:** Acme Corp - Production Atlas

**Environments:**
- Production (critical)
- Staging
- Development

**Key Services:**
- User API (healthy) → Depends on: API Gateway, SQL DB, Redis Cache
- **Payments Service (DEGRADED)** → Depends on: App Service, SQL DB, User API
- Notifications Service (healthy) → Depends on: Function App, Payments Service
- Data Pipeline (healthy) → Depends on: Cosmos DB, Blob Storage

**Incident Scenario:**
- Deployment v2.1.4 to Payments Service 90 minutes ago
- DB timeout config reduced from 3000ms → 2000ms
- Error rate spike to 6.42% (threshold: 5%)
- SQL Database CPU high (87%)
- Incident status: Investigating

**Forecasts:**
1. SQL Database capacity risk (high confidence, 2-3 days)
2. Deployment failure pattern risk on Payments Service (high confidence, now)

## 🛠️ Development Guide

### Backend Development
```bash
cd backend

# Type check
npm run type-check

# Build TypeScript
npm run build

# Run dev server with hot reload
npm run dev
```

### Frontend Development
```bash
cd frontend

# Run dev server (Vite)
npm run dev

# Type check
npm run type-check

# Build for production
npm run build
```

### Adding New Fixture Data
Edit `backend/src/fixtures.ts`:
```typescript
export function generateCustomData() {
  // Add your fictional data here
  return { /* ... */ };
}
```

Then use in `backend/src/app.ts`:
```typescript
const customData = generateCustomData();
```

## 🎨 Design Features

- **Dark & light theme support** (currently dark mode)
- **High information density** without visual clutter
- **Rounded panels** with subtle borders
- **Status colors** with supporting icons/text
- **Progressive disclosure** for advanced details
- **Skeleton loading states** (placeholder ready)
- **Responsive layouts** (three-pane desktop → single-stack mobile)
- **Accessible keyboard navigation** (basic implementation)
- **Animated robot guide** (floating effect, accessible)

## 🔐 Security & Future API Integration

**Current:** Fictional in-memory data for demonstration

**Future Integration Points:**
1. **Azure Resource Graph** - Real resource inventory
2. **Azure Monitor** - Actual metrics, alerts, health
3. **Terraform State** - IaC parsing and change tracking
4. **Azure DevOps / GitHub** - Real deployments, repositories
5. **Kubernetes APIs** - Workload and service discovery
6. **Application Telemetry** - Real logs and traces

**API Design Ready For:**
- Bearer token authentication
- Role-based access control per environment
- Read-only mode by default
- Secret storage via managed vault
- Audit logging on all endpoints
- Tenant isolation (workspace-scoped)

## 📈 Next Steps

1. **Replace fictional data** with real Azure integrations
2. **Add LLM integration** to assistant (prompt engineering, context windows)
3. **Implement GraphQL** for flexible data querying
4. **Add WebSocket support** for real-time updates
5. **Build Cytoscape.js graph** for production-grade visualization
6. **Add ML-based forecasting** after collecting operational data
7. **Implement authentication & permissions**
8. **Add audit logging & compliance**
9. **Performance optimization** for large infrastructure graphs
10. **Mobile app** for on-call scenarios

## 📝 Demo Walkthrough

1. **Open Dashboard** → See health overview with active critical alert
2. **Click "Topology"** → Explore service and resource nodes
3. **Click Service** → View details, dependencies, recent deployments
4. **Ask Assistant** → "What depends on this?" → Get evidence-backed answer
5. **Click "Incidents"** → View ongoing incident, investigation timeline
6. **Generate Report** → Export incident summary

## 🐛 Known Limitations (MVP)

- Fictional data only (no live integrations yet)
- Assistant uses pattern matching (not LLM)
- Single workspace (no multi-tenancy)
- No persistent storage (data resets on backend restart)
- Graph visualization is mockup (ready for Cytoscape.js)
- No authentication/authorization
- Limited mobile optimization
- No WebSocket for real-time updates

## 📄 License

MIT

---

**Built for:** Infrastructure intelligence, deployment impact analysis, incident investigation
**Stack:** Node.js, Express, React, TypeScript, PostgreSQL, Docker
**Status:** MVP - Fictional data ready for API integration
