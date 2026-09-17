# ✨ Cloud Dependency Atlas

> Infrastructure intelligence platform for developers, DevOps engineers, and platform teams

## 🚀 **QUICKEST START (30 seconds)**

### Double-click this file from Windows Explorer:
```
START_APP.bat
```

OR if you prefer PowerShell:
```
START_APP.ps1
```

Both will:
- ✅ Install dependencies
- ✅ Start backend (port 5000)
- ✅ Start frontend (port 3000)
- ✅ Open in two windows

Then open: **http://localhost:3000**

---

## 📚 Choose Your Path

### 👤 I just want to run it
→ Double-click **START_APP.bat** or **START_APP.ps1**

### 🎯 I want a 5-minute overview
→ Read **GO.md** (2 min) + **CHEATSHEET.md** (2 min)

### 🔧 I want to run it manually
→ Read **RUN_THE_APP.md** (complete setup guide)

### 🏗️ I want to understand the architecture
→ Read **ARCHITECTURE.md**

### 📖 I want a detailed walkthrough
→ Read **WALKTHROUGH.md** (interactive guided tour)

### 🐳 I want to use Docker
→ Run: `docker-compose up`
→ Then open: http://localhost:3000

### 🧪 I want to verify it works
→ Read **TESTING.md** (test verification report)

---

## 📋 What's Included

**Complete Full-Stack Application:**
- ✅ Express.js backend with 13 REST API endpoints
- ✅ React frontend with interactive components
- ✅ PostgreSQL schema ready for production data
- ✅ Fictional Acme Corp infrastructure data
- ✅ Dark-mode professional UI
- ✅ Dependency graph visualization
- ✅ Incident investigation workspace
- ✅ Infrastructure chatbot assistant
- ✅ Docker Compose orchestration
- ✅ Complete documentation (16 guides)

---

## ⚡ Features

### Dashboard
- Health overview of services and resources
- Active alerts and incidents
- Risk forecasts with evidence
- Synchronized data freshness indicators

### Topology
- Interactive dependency graph
- Service and resource visualization
- Blast radius analysis
- Environment filtering

### Incidents
- Investigation timeline
- Evidence collection
- Hypothesis tracking
- Report generation

### Assistant
- Context-aware infrastructure Q&A
- Evidence-based recommendations
- Troubleshooting guidance
- Infrastructure explanations

---

## 🎯 Example Questions to Ask

```
"What depends on the payments API?"
"What changed before this latency spike?"
"Which production services depend on this network?"
"Show the most likely failure path"
"What should I check next?"
"Summarize today's infrastructure risks"
```

---

## 📊 Sample Data

The application includes a complete fictional scenario:

**Acme Corp Infrastructure:**
- 🏢 **Workspaces:** 1 (Acme Corp)
- 🌍 **Environments:** 3 (dev, staging, production)
- 🔧 **Services:** 4 (User API, Payments, Notifications, Analytics)
- 📦 **Resources:** 11 (VMs, databases, networks, etc.)
- 🔗 **Dependencies:** 10 (how services connect)
- 🚨 **Alerts:** 3 (with evidence and context)
- 📋 **Incidents:** 1 (complete investigation scenario)
- ⚠️ **Forecasts:** 2 (with confidence and supporting data)

---

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- PostgreSQL (schema included)
- CORS enabled

**Frontend:**
- React 18
- TypeScript
- Vite
- Custom CSS (dark theme)

**Deployment:**
- Docker & Docker Compose
- Multi-stage builds
- Production optimized

---

## 📖 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| **START_APP.bat** | Run everything (Windows) | - |
| **START_APP.ps1** | Run everything (PowerShell) | - |
| **GO.md** | Ultra-quick start | 2 min |
| **RUN_THE_APP.md** | Complete setup guide | 5 min |
| **CHEATSHEET.md** | One-page command reference | 2 min |
| **WALKTHROUGH.md** | Interactive guided tour | 7 min |
| **VISUAL_GUIDE.md** | Step-by-step with diagrams | 5 min |
| **ARCHITECTURE.md** | System design deep-dive | 10 min |
| **README.md** | Feature & API reference | 10 min |
| **TESTING.md** | Verification report | 3 min |
| **DELIVERY.md** | Executive summary | 3 min |
| **IMPLEMENTATION.md** | Technical implementation details | 10 min |
| **BUILD_SUMMARY.md** | What was built & statistics | 3 min |
| **QUICKSTART.md** | Quick reference with examples | 3 min |
| **START_HERE.md** | Complete overview for first-time users | 5 min |
| **INDEX.md** | Central navigation hub | 2 min |

---

## ✅ Verification

All components have been tested and verified:

- ✅ Backend API: All 13 endpoints responding with fictional data
- ✅ Frontend: Loads and connects to backend successfully
- ✅ TypeScript: Strict mode compilation passing
- ✅ Dependencies: All npm packages installed
- ✅ Startup: Both servers start without errors
- ✅ Data: Fictional scenario fully initialized

See **TESTING.md** for complete verification report.

---

## 🚀 Getting Started

### Option 1: Automatic (Recommended)
```
Double-click START_APP.bat or START_APP.ps1
```

### Option 2: Manual
```powershell
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend (new window)
cd frontend
npm install
npm run dev

# Browser
http://localhost:3000
```

### Option 3: Docker
```powershell
docker-compose up
# http://localhost:3000
```

---

## 🐛 Troubleshooting

**"Port 5000 already in use"**
→ See RUN_THE_APP.md "Troubleshooting" section

**"Docker not found"**
→ Install Docker Desktop or use manual setup (Option 2)

**"npm not found"**
→ Install Node.js 18+ from nodejs.org

**"Frontend won't load"**
→ Check backend is running: curl http://localhost:5000/health

---

## 📞 Need Help?

1. **Quick answer?** → Check CHEATSHEET.md
2. **Setup problem?** → Check RUN_THE_APP.md troubleshooting
3. **Want to understand?** → Read ARCHITECTURE.md
4. **Everything else?** → Check INDEX.md for navigation

---

## 🎓 What You'll Learn

By exploring this application, you'll see:

- ✅ How to build a production-ready Node.js/React stack
- ✅ How to structure REST APIs for operational data
- ✅ How to implement realistic fictional data generators
- ✅ How to build professional dark-mode UI
- ✅ How to orchestrate services with Docker Compose
- ✅ How to write comprehensive documentation
- ✅ How to test and verify applications thoroughly

---

## 🚀 Next Steps

After running the app:

1. **Explore the Dashboard** — See health overview
2. **Click on a Service** — View dependencies and metadata
3. **Go to Incidents** — Investigate a sample incident
4. **Ask the Assistant** — Try infrastructure questions
5. **Read the Architecture** — Understand how it works

---

## 📦 Project Structure

```
azure-dependency-atlas/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── app.ts          # 13 REST endpoints
│   │   └── fixtures.ts     # Fictional data generators
│   ├── schema.sql          # PostgreSQL schema
│   └── Dockerfile
├── frontend/                # React.js UI
│   ├── src/
│   │   ├── App.tsx         # Main component
│   │   ├── App.css         # Styling (1000+ lines)
│   │   └── components/     # 6 React components
│   └── Dockerfile
├── docker-compose.yml       # Service orchestration
├── START_APP.bat/ps1       # Startup scripts
├── RUN_THE_APP.md          # Complete setup guide
└── [15 documentation files]
```

---

## 💡 Key Concepts

- **Dependency Graph:** Services and resources connected by discovered relationships
- **Evidence-Based:** Recommendations include supporting data (logs, metrics, changes)
- **Confidence Scoring:** All relationships and forecasts include confidence levels
- **Blast Radius:** Understand impact of changes across services
- **Fictional Data:** Realistic Acme Corp infrastructure scenario, easily replaceable with real APIs

---

## ✨ Ready to Start?

### 👉 Double-click: **START_APP.bat** (or **START_APP.ps1**)

Then open: **http://localhost:3000**

---

**Questions?** See INDEX.md for complete documentation navigation.

**Questions about code?** See ARCHITECTURE.md for system design.

**Need to troubleshoot?** See RUN_THE_APP.md for complete setup guide with troubleshooting.

Enjoy exploring the Cloud Dependency Atlas! 🚀
