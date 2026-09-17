# Cloud Dependency Atlas - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLOUD DEPENDENCY ATLAS MVP                  │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────── FRONTEND (React + TS) ──────────────────────┐
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Navigation Bar                         │   │
│  │    🤖 Cloud Dependency Atlas | Dashboard | Topology...   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────┬──────────────────────┬──────────────────┐      │
│  │             │                      │                  │      │
│  │  ASSISTANT  │      CANVAS          │     DETAILS      │      │
│  │  (25%)      │      (50%)           │      (25%)       │      │
│  │             │                      │                  │      │
│  │ • Chat      │ Dashboard Component  │ Service Info     │      │
│  │ • Questions │  ├─ Stats Cards      │ ├─ Health        │      │
│  │ • Context   │  ├─ Alerts List      │ ├─ Dependencies  │      │
│  │             │  ├─ Incidents        │ ├─ Alerts        │      │
│  │             │  └─ Forecasts        │ └─ Deployments   │      │
│  │             │                      │                  │      │
│  │             │ Graph Component      │                  │      │
│  │             │  ├─ Service Nodes    │                  │      │
│  │             │  ├─ Resource Nodes   │                  │      │
│  │             │  └─ Dependencies     │                  │      │
│  │             │                      │                  │      │
│  │             │ Incident Component   │                  │      │
│  │             │  ├─ Timeline         │                  │      │
│  │             │  ├─ Investigation    │                  │      │
│  │             │  └─ Report Gen       │                  │      │
│  │             │                      │                  │      │
│  └─────────────┴──────────────────────┴──────────────────┘      │
│                                                                   │
│  Technologies: React 18.2 | TypeScript 5.3 | Vite | Axios      │
│  Styling: Custom CSS Dark Theme (~1000 lines)                   │
└───────────────────────────────────┬─────────────────────────────┘
                                    │
                   HTTP/REST (CORS Enabled)
                                    │
┌───────────────────────────────────▼─────────────────────────────┐
│              BACKEND (Express + TypeScript + Node.js)            │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Express HTTP Server (Port 5000)             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────── API Routes ─────────────────────────┐  │
│  │                                                           │  │
│  │  GET /health                                             │  │
│  │  GET /api/workspace                                      │  │
│  │  GET /api/environments                                   │  │
│  │  GET /api/resources [?environment, ?status]             │  │
│  │  GET /api/resources/:id                                  │  │
│  │  GET /api/services [?environment]                        │  │
│  │  GET /api/services/:id                                   │  │
│  │  GET /api/dependencies [?sourceId, ?targetId]           │  │
│  │  GET /api/blast-radius/:resourceId/:resourceType        │  │
│  │  GET /api/alerts [?severity, ?status]                   │  │
│  │  GET /api/incidents [?status, ?severity]                │  │
│  │  POST /api/incidents/:id/investigate                     │  │
│  │  GET /api/forecasts [?riskLevel, ?acknowledged]         │  │
│  │  POST /api/reports                                       │  │
│  │  POST /api/assistant/ask                                 │  │
│  │  GET /api/teams                                          │  │
│  │  GET /api/deployments [?serviceId, ?status]             │  │
│  │                                                           │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────── Data Generators ──────────────────┐   │
│  │                                                          │   │
│  │  fixtures.ts                                            │   │
│  │  ├─ generateFictionalData()  → Workspaces, Services    │   │
│  │  ├─ generateAlerts()         → 3 alerts                │   │
│  │  ├─ generateDeployments()    → 2 deployments           │   │
│  │  ├─ generateIncidents()      → 1 incident              │   │
│  │  └─ generateForecasts()      → 2 forecasts             │   │
│  │                                                          │   │
│  │  app.ts                                                 │   │
│  │  ├─ Initialize fixtures on startup                     │   │
│  │  ├─ In-memory data store                               │   │
│  │  └─ Query/filter logic                                 │   │
│  │                                                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Technologies: Express 4.18 | Node.js 18+ | TypeScript 5.3    │
│  Architecture: Pattern-Based (ready for LLM integration)       │
└───────────────────────────────────┬──────────────────────────────┘
                                    │
                    (Future: Real Database)
                                    │
┌───────────────────────────────────▼──────────────────────────────┐
│                   PostgreSQL Database (Port 5432)                 │
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Database Schema (11 Tables)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Core Entities:                    Support Tables:             │
│  ├─ workspaces                     ├─ audit_logs              │
│  ├─ users                          └─ metrics                 │
│  ├─ cloud_accounts                                            │
│  ├─ environments                    Relationships:            │
│  ├─ teams                          ├─ dependencies           │
│  ├─ resources                      └─ todo_deps             │
│  ├─ services                                                  │
│  ├─ repositories                   Monitoring:              │
│  ├─ pipelines                      ├─ alerts                │
│  ├─ deployments                    ├─ incidents             │
│  ├─ changes                        ├─ investigations        │
│  ├─ forecasts                      ├─ reports               │
│  └─ investigations                 └─ forecasts             │
│                                                                  │
│  Features:                                                      │
│  ├─ 26 Performance Indexes                                      │
│  ├─ Foreign Key Constraints                                     │
│  ├─ Workspace Isolation (workspace_id on all tables)           │
│  └─ Audit Trail Ready                                          │
│                                                                  │
│  Capacity:                                                      │
│  ├─ 1000+ resources per workspace                              │
│  ├─ 100+ services per environment                              │
│  └─ Real-time queries < 100ms (with indexing)                  │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                          │
│                        (React Browser)                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                    HTTP Request
                           │
        ┌──────────────────▼──────────────────┐
        │    Express Router / Middleware      │
        │  • CORS Handler                     │
        │  • JSON Parser                      │
        │  • Request Logger                   │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │     Route Handler (app.ts)          │
        │  • Parse query parameters           │
        │  • Validate request                 │
        │  • Apply filters                    │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │   Data Access (Fictional/Real)      │
        │  • Query fixture data (MVP)         │
        │  • Or: Query database (Future)      │
        │  • Or: Call Azure API (Future)      │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │   Response Formatter                │
        │  • Convert to JSON                  │
        │  • Include metadata                 │
        │  • Add timestamps                   │
        └──────────────────┬──────────────────┘
                           │
                    HTTP Response (JSON)
                           │
        ┌──────────────────▼──────────────────┐
        │   React State Management            │
        │  • useState / useEffect             │
        │  • Update component state           │
        │  • Trigger re-render                │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │     React Rendering                 │
        │  • Transform state to JSX           │
        │  • Apply CSS styling                │
        │  • Paint to DOM                     │
        └──────────────────┬──────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Browser   │
                    │   Display   │
                    └─────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Docker Compose Network                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐    ┌──────────────────────┐
│   Frontend Service   │    │   Backend Service    │
├──────────────────────┤    ├──────────────────────┤
│ Port: 3000           │    │ Port: 5000           │
│ Image: node:18       │    │ Image: node:18       │
│ Build: ./frontend    │    │ Build: ./backend     │
│                      │    │                      │
│ ┌────────────────┐   │    │ ┌────────────────┐   │
│ │ Vite Dev Server│   │    │ │ Express Server │   │
│ │ Auto-reload    │   │    │ │ Hot-reload     │   │
│ └────────────────┘   │    │ └────────────────┘   │
│                      │    │                      │
│ Env: VITE_API_URL   │    │ Env: NODE_ENV,      │
│      http://backend  │    │      DB_HOST, etc    │
└──────────────────────┘    └──────────────────────┘
         │                           │
         │                    ┌──────▼──────────┐
         │                    │ Health Check    │
         │                    │ Dependencies    │
         │                    └─────────────────┘
         │                           │
         └───────────┬───────────────┘
                     │
              ┌──────▼──────────┐
              │ PostgreSQL      │
              │ Service         │
              ├─────────────────┤
              │ Port: 5432      │
              │ Volume: postgres_data
              │ Init: schema.sql│
              └─────────────────┘

Network: cda-network
Volume: postgres_data (persistent)
```

## Component Dependency Tree

```
App.tsx
├── Layout.tsx
│   └── Navigation Bar
└── Three Panes
    │
    ├── Pane Left (25%)
    │   └── AssistantChat.tsx
    │       ├── Message History
    │       ├── Input Form
    │       └── Suggested Questions
    │
    ├── Pane Center (50%) [Conditional Rendering]
    │   ├── HealthDashboard.tsx (Page: dashboard)
    │   │   ├── Stat Cards (4)
    │   │   ├── Alert Cards
    │   │   ├── Incident Cards
    │   │   └── Forecast Cards
    │   │
    │   ├── DependencyGraph.tsx (Page: graph)
    │   │   ├── Node List (Services)
    │   │   ├── Node List (Resources)
    │   │   └── Dependencies Info
    │   │
    │   └── IncidentWorkspace.tsx (Page: incident)
    │       ├── Incident List
    │       ├── Investigation Details
    │       ├── Timeline
    │       └── Report Preview
    │
    └── Pane Right (25%)
        └── ServiceDetails.tsx
            ├── Header (Name + Status)
            ├── Health Indicator
            ├── Dependencies Section
            ├── Alerts Section
            └── Deployments Section

API Endpoint Usage Map:
├── /api/workspace → All components
├── /api/environments → HealthDashboard, DependencyGraph
├── /api/resources → DependencyGraph
├── /api/services → All, AssistantChat context
├── /api/dependencies → DependencyGraph, ServiceDetails
├── /api/alerts → HealthDashboard, ServiceDetails
├── /api/incidents → HealthDashboard, IncidentWorkspace
├── /api/deployments → HealthDashboard, ServiceDetails, IncidentWorkspace
├── /api/forecasts → HealthDashboard
├── /api/blast-radius/:id/:type → DependencyGraph (on demand)
├── /api/assistant/ask → AssistantChat
└── /api/reports → IncidentWorkspace
```

## Data State Management

```
Frontend State (React Hooks)

Per Component:
├── HealthDashboard
│   ├── alerts: Alert[]
│   ├── incidents: Incident[]
│   ├── forecasts: Forecast[]
│   └── resources: Resource[]
│
├── DependencyGraph
│   ├── services: Service[]
│   ├── resources: Resource[]
│   ├── dependencies: Dependency[]
│   └── selectedId: string | null
│
├── ServiceDetails
│   ├── dependencies: Dependency[]
│   ├── alerts: Alert[]
│   └── deployments: Deployment[]
│
├── IncidentWorkspace
│   ├── incidents: Incident[]
│   ├── selectedIncident: Incident
│   ├── investigationNotes: string
│   └── report: Report | null
│
└── AssistantChat
    ├── messages: Message[]
    ├── input: string
    └── loading: boolean

Global State (localStorage - Future):
├── selectedEnvironment: string
├── selectedService: Service
├── theme: 'dark' | 'light'
└── sidebarCollapsed: boolean
```

## Deployment Pipeline (Future)

```
┌────────────────┐
│  Git Push      │
└────────┬───────┘
         │
    ┌────▼────┐
    │ GitHub  │
    │ Actions │
    └────┬────┘
         │
    ┌────▼──────────────┐
    │ CI Pipeline       │
    ├──────────────────┤
    │ 1. Lint (ESLint) │
    │ 2. Type Check    │
    │ 3. Unit Tests    │
    │ 4. Build Image   │
    └────┬─────────────┘
         │
    ┌────▼──────────────────┐
    │ Push to Registry      │
    │ (Docker Hub / ACR)    │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │ Deploy to Staging     │
    │ - Run migrations      │
    │ - Smoke tests         │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │ Approval Required     │
    └────┬─────────────────┘
         │
    ┌────▼──────────────────┐
    │ Deploy to Production  │
    │ - Blue/Green Deploy   │
    │ - Health Checks       │
    │ - Rollback Ready      │
    └──────────────────────┘
```

---

**This architecture supports:**
- ✅ Single workspace MVP
- ✅ Multi-workspace future
- ✅ Real-time updates (WebSocket ready)
- ✅ ML-based forecasting (data structure ready)
- ✅ Enterprise deployments (Kubernetes ready)
- ✅ API-first design (any frontend can consume)

