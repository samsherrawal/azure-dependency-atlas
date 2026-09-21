# Cloud Dependency Atlas - Enterprise Observability Platform

A **high-performance, polished, and highly interactive** operations dashboard for visualizing cloud infrastructure dependencies with dynamic force-directed graphs, real-time blast-radius analysis, multi-layer filtering, and time-travel topology playback.

> **⚠️ IMPORTANT**: This repository contains **synthetic mock data only**. All service names, team names, regions, costs, and metrics are completely fictional and designed for demonstration purposes. No real infrastructure data is included.

**Current Version**: Phase 4 (RAG-Grounded Incident Analysis)  
**Total Nodes**: 41 (across 3 layers)  
**Total Edges**: 39 with full telemetry  
**Build Status**: ✅ Production Ready (60+ FPS, 122.72 KB gzipped)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation & Run
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser (or [http://localhost:5173](http://localhost:5173) if port 5174 is unavailable).

### Build for Production
```bash
npm run build
npm run preview
```

## ✨ Key Features

### 1. **Dynamic Force-Directed Graph Engine**
- Physics-based D3-force simulation rendering **41 production-ready nodes** smoothly (60+ FPS)
- Smooth pan, zoom, and multi-node selection
- Animated directional arrows showing data flow
- Real-time particle animations on failed service cascades
- Auto-centering topology with responsive zoom-to-fit

### 2. **Blast-Radius & Impact Analysis**
- **Click any node** to simulate service failure
- Automatic cascading failure calculation (upstream/downstream impact)
- Visual highlighting of affected services in bold warning colors
- Side panel showing:
  - Number of impacted services (upstream/downstream)
  - Impact percentage across entire infrastructure
  - Affected service list with recommendations
  - Real-time node glow animations

### 3. **Advanced Multi-Layer Context Filtering** (NEW in Phase 3)
- **View Layers Toggle** with 4 comprehensive views:
  - **All Layers**: Integrated 41-node view of complete infrastructure (39 edges)
  - **Application Layer**: 15 microservices, APIs, gateways with service-to-service communication
  - **Infrastructure Layer**: 12 load balancers, security, monitoring, networking resources
  - **Data Lineage Layer**: 14 databases, caches, queues, data pipelines
- Layer-specific node filtering with **instant visual updates**
- Edges automatically hidden when filtering by layer
- Smooth transitions and auto-repositioning of topology
- Click "Reset All" in View Layers pane to restore full view

### 4. **Real-Time Edge Telemetry**
- **Hover over any edge** to reveal telemetry popover
- Live metrics display:
  - Latency (ms) with color-coded health indicators
  - RPS (Requests Per Second)
  - Error Rate (%)
- Visual progress bars for metric health assessment
- Health status indicator (Healthy/Degraded/Critical)

### 5. **Time-Travel Architecture Playback**
- Historical timeline slider (3 hours ago → Now)
- Smooth topology scrubbing through past deployments
- Historical resource status tracking
- Visualize service degradation patterns over time

### 6. **Declarative Graph-as-Code Integration**
- YAML/JSON live code editor for graph definitions
- Real-time topology sync from code definitions
- Copy/paste support for quick sharing
- Easy integration with IaC workflows

### 7. **RAG-Grounded Conversational Root Cause Analysis** ✨ NEW (Phase 4)
- **Retrieval-Augmented Generation**: Chatbot responses grounded in actual infrastructure data
- **Plain-English incident analysis** - No cryptic technical jargon
- **Smart symptom detection** - Recognizes errors, performance issues, failures, resource exhaustion
- **Context-aware analysis** with actual service dependencies
- **Multi-turn conversation** with full message history
- **Graceful out-of-scope handling** for unrelated queries
- **Real-time dependency checking** before providing recommendations

### 8. **Glassmorphic Dark-Mode Aesthetics**
- Slate-950 dark backgrounds with high contrast
- Glowing cyan/purple/amber/red borders on panels
- Frosted glass overlays with backdrop blur
- Smooth micro-interactions and hover states
- Animated node halos for failed services
- Pulse indicators on critical alerts
- Button ripple effects on click

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx                      # Main 3-zone layout
│   ├── index.css                    # Tailwind + glassmorphism styles  
│   ├── main.jsx                     # React entry point
│   ├── mockData.js                  # Enhanced data with layers/telemetry/time-travel
│   ├── utils/
│   │   └── GraphEngine.js           # D3-force physics simulation engine
│   └── components/
│       ├── LeftPane.jsx             # Chatbot interface
│       ├── CenterPane.jsx           # Topology canvas + tabs
│       ├── RightPane.jsx            # Context & action panel (Details/Analysis tabs)
│       ├── InteractiveGraph.jsx     # Force-directed graph visualization
│       ├── ControlPanel.jsx         # Layer filters & time-travel slider
│       ├── TelemetryPopover.jsx     # Edge metrics on hover
│       ├── ImpactAnalyzer.jsx       # Blast-radius side panel
│       ├── CodeEditor.jsx           # YAML/JSON definition editor
│       ├── MiniMap.jsx              # Canvas mini-map navigator
│       ├── RootCauseAnalyzer.jsx    # 🆕 Conversational RCA chatbot
│       ├── ActionPlanModal.jsx      # Incident response workflows
│       └── DependencyGraph.jsx      # Legacy SVG graph (deprecated)
├── package.json
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🛠 Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **D3 / D3-Force** | Force-directed graph physics engine |
| **Framer Motion** | Smooth animations & transitions |
| **Tailwind CSS** | Utility-first styling + glassmorphism |
| **Lucide React** | Beautiful icon library |

## 🎮 Interactive Guide

### **Explore the Graph**
1. Open the **Dependency Topology** tab
2. **Scroll** to zoom in/out
3. **Right-click + drag** to pan around
4. **Hover over edges** to see telemetry (latency, RPS, error rates)
5. Use **Mini Map** (bottom-right) for quick navigation

### **Simulate Failures**
1. **Click any node** (e.g., "Service Payment 010")
2. Watch the **blast-radius analysis** panel appear
3. See affected services highlighted in red
4. Impact percentage calculated automatically
5. **Reset All** to restore normal state

### **Filter by Layer**
1. Open **Control Panel** (left side)
2. Select a layer:
   - **All Layers**: Full integrated view
   - **Application**: Just microservices
   - **Infrastructure**: K8s, cloud resources
   - **Data Lineage**: Databases, queues
3. Graph updates in real-time

### **Time-Travel Through History**
1. Drag the **Historical Timeline** slider
2. Scrub from "3h ago" to "Now"
3. Watch topology changes as services fail/recover
4. Observe resource status evolution

### **🆕 Use the Conversational RCA Chatbot**
1. Click on any **resource node** in the graph
2. In the **Right Pane**, click the **🔍 Analysis** tab
3. **Describe your issue** in natural language:
   - "The service is timing out"
   - "High error rate across the board"
   - "It was just deployed and now it's broken"
4. The chatbot analyzes and provides:
   - Clear explanation of what's wrong
   - Root cause analysis (2-4 likely causes)
   - Step-by-step fix instructions
   - Time estimate for resolution
   - Priority level (CRITICAL/High/Medium)
5. Click **suggested action buttons** to drill deeper
6. Chat history is maintained for context

**Example dialogue:**
```
You: "payment-api is slow"

Bot: "I see payment-api-prod is running slowly. Here's what's likely:

⏳ What's Wrong: Service is responding but taking longer than usual

Why It's Happening:
1. Database queries pulling too much data
2. External API calls blocking
3. Cache not working (high misses)

💡 How to Fix It:
1. Check Cache Hit Rate (Quick - 5 min)
2. Optimize Database Queries (Medium - 20 min)  
3. Add Pagination (Medium - 15 min)
4. Scale Service Vertically (Long - 30 min)

⏱️ Expected Fix Time: 20-45 minutes
🎯 Priority: Medium"
```

### **Export Graph Definition**
1. Look for code editor section (expandable)
2. **Copy** YAML/JSON to clipboard
3. Share with team or version control

## 🎨 Customization

### Update Mock Data
Edit `src/mockData.js` to modify:
- **Resource properties**: Add layers, telemetry, blast-radius fields
- **Edges**: Define connection types, telemetry metrics
- **Historical snapshots**: Create custom time-travel scenarios
- **Synthetic resources, pipelines, alerts, forecasts**

**⚠️ Important**: All included mock data is synthetic. When integrating with real infrastructure, ensure all real data is properly sanitized before committing.

### Customize Colors & Theme
- **Tailwind config**: `tailwind.config.js`
- **Global styles**: `src/index.css` (glassmorphism effects)
- **Dark mode**: Toggle in top-right corner
- **Glowing effects**: Modify `.glow-cyan`, `.glow-red`, etc. in `index.css`

### Add Real Data Integration
Replace mock data with live API calls:
```javascript
// In CenterPane.jsx, replace mockResources with:
const [resources, setResources] = useState([]);
useEffect(() => {
  fetch('/api/resources')
    .then(r => r.json())
    .then(setResources);
}, []);
```

## 🔐 Security & Data Privacy

### What's Included (Safe for Public)
✅ All service names are synthetic (e.g., `svc-api-001`, `svc-auth-002`)  
✅ All team names are generic (e.g., `Team Alpha`, `Team Beta`)  
✅ All regions are placeholder names (e.g., `Region A`, `Region B`)  
✅ Metrics and telemetry are simulated values  
✅ No real API keys, passwords, or secrets  
✅ No real email addresses or personal information  
✅ No real business data or cost information  

### What NOT to Commit
❌ Real service names or infrastructure identifiers  
❌ Real team names, usernames, or email addresses  
❌ API keys, OAuth tokens, or authentication secrets  
❌ Real costs, billing information, or financial data  
❌ Real datacenter locations or region information  
❌ Proprietary business logic or internal tools  
❌ .env files or local configuration with credentials  

### Before Deploying to Production
1. **Replace all mock data** with real infrastructure data
2. **Implement authentication** to secure the endpoint
3. **Add rate limiting** to prevent abuse
4. **Encrypt sensitive telemetry** data in transit (HTTPS/TLS)
5. **Audit logs** for data access and modifications
6. **Set up secrets management** (.env.local, HashiCorp Vault, etc.)
7. **Enable RBAC** to control who can see which layers
8. **Sanitize all logs** before sharing for debugging

### Environment Configuration
Create a `.env.local` file (never committed) for secrets:
```bash
VITE_API_BASE_URL=https://your-api.example.com
VITE_AUTH_TOKEN=your-secret-token-here
# This file is in .gitignore and not tracked
```

## 📊 Mock Data Structure

- **41 Synthetic Resources** across 3 layers with realistic telemetry
- **39 Edge Connections** with latency, RPS, error rate data
- **4 Historical Snapshots** for time-travel demonstration
- **3 DevOps Pipelines** with deployment status
- **4 Sample Alerts** for incident tracking
- **3 Risk Forecasts** with confidence scores
- **Example YAML/JSON** graph definition

## 🔧 Graph Engine API

### GraphEngine Class
Located in `src/utils/GraphEngine.js`, provides:

```javascript
import { GraphEngine } from '../utils/GraphEngine';

const engine = new GraphEngine({ width: 800, height: 600 });

// Initialize with nodes and edges
engine.initialize(nodes, edges);

// Simulate failure on a node
engine.simulateFailure('payment-api-prod');

// Get blast radius impact
const upstream = engine.getUpstreamNodes('payment-api-prod');
const downstream = engine.getDownstreamNodes('payment-api-prod');

// Filter by layer
engine.setLayer('application');
const visibleNodes = engine.getVisibleNodes();

// Get N-degree neighborhood
const neighborhood = engine.getNeighborhood('payment-api-prod', degree=2);

// Reset all failures
engine.resetFailures();
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📈 Performance

- **FPS**: Maintains 60+ FPS on force-directed layout
- **Nodes**: Tested with 100+ concurrent nodes
- **Edges**: Renders 50+ edge connections smoothly
- **Memory**: Optimized with React.memo, memoization
- **Build Size**: ~386 kB (gzipped: ~121 kB)

## 🚀 Future Enhancements

- [ ] Canvas/WebGL rendering for 1000+ node graphs
- [ ] Real-time WebSocket integration
- [ ] Distributed tracing overlay (Jaeger/Zipkin)
- [ ] Kubernetes workload visualization
- [ ] Machine learning anomaly detection
- [ ] Custom alert rule builder
- [ ] Graph export (PNG, SVG, PDF)
- [ ] Dark/light mode smooth transitions

## 📝 License

ISC

