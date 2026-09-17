# Cloud Dependency Atlas - Quick Reference

## 🚀 Start Here

### Option 1: Local (Recommended for Development)
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run dev
# Listening on http://localhost:5000

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
# Listening on http://localhost:3000
```

### Option 2: Docker Compose
```bash
docker-compose up
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432
```

## 📍 What to See

### Dashboard (http://localhost:3000)
- **Stats:** 100% healthy resources, 1 critical alert, 1 open incident, 2 risk warnings
- **Critical Alert:** Payments Service error rate 6.42% (threshold 5%)
- **Incident:** Payments Service degradation (investigating)
- **Forecast:** SQL capacity risk (HIGH confidence, 2-3 days)

### Topology Screen
- 4 services: User API, Payments (degraded), Notifications, Data Pipeline
- 11 resources: API Gateway, SQL DB, App Services, Redis, Storage, Cosmos, Functions
- Dependencies with confidence scores (95-100%)

### Incident Workspace
- Open incident: "Payments Service - High Error Rate"
- Timeline: Deployment → Alert → Investigation
- Investigation: Related alerts, deployments, suggested checks
- Report: Auto-generated post-incident summary

### Assistant Chat
- Ask: "What depends on this?"
- Ask: "What changed before this?"
- Ask: "Why might this fail?"
- Get: Answers with evidence references and confidence scores

## 🔌 API Quick Test

```bash
# Check system health
curl http://localhost:5000/health

# Get workspace
curl http://localhost:5000/api/workspace

# Get resources
curl http://localhost:5000/api/resources

# Get services
curl http://localhost:5000/api/services

# Get alerts
curl http://localhost:5000/api/alerts

# Ask assistant
curl -X POST http://localhost:5000/api/assistant/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What depends on this?", "context": {}}'
```

## 📊 Key Entities

| Entity | Count | Details |
|--------|-------|---------|
| Environments | 3 | production, staging, development |
| Services | 4 | User API, Payments, Notifications, Data Pipeline |
| Resources | 11 | SQL DB, Redis, App Services, etc. |
| Dependencies | 10 | Service→Resource + Service→Service |
| Alerts | 3 | 1 critical, 1 high, 1 medium |
| Incidents | 1 | Payments Service degradation (investigating) |
| Forecasts | 2 | Capacity + Deployment failure patterns |
| Teams | 4 | Platform, Payments, User Services, Data & Analytics |

## 💾 Database Setup

```bash
# Connect to PostgreSQL (if using Docker)
docker-compose exec postgres psql -U atlas_user -d atlas

# View tables
\dt

# Query resources
SELECT name, type, status FROM resources;

# Query dependencies
SELECT * FROM dependencies LIMIT 5;
```

## 🛠️ Development Commands

### Backend
```bash
npm run dev         # Run with hot reload
npm run build       # Compile TypeScript
npm run type-check  # Check types
```

### Frontend
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run type-check  # Check types
```

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/src/app.ts` | 13 API endpoints |
| `backend/src/fixtures.ts` | Fictional data generators |
| `frontend/src/App.tsx` | Main layout (three panes) |
| `frontend/src/App.css` | All styling (dark theme) |
| `backend/schema.sql` | PostgreSQL schema |
| `docker-compose.yml` | Container orchestration |

## ❌ Troubleshooting

**Frontend can't connect to backend:**
- Check backend is running on :5000
- Verify CORS is enabled (it is)
- Check firewall/antivirus

**Database connection fails:**
- Ensure PostgreSQL is running (via Docker)
- Check credentials in backend code
- Verify schema.sql loaded

**Port already in use:**
- Backend: `lsof -i :5000` or `netstat -ano | findstr :5000`
- Frontend: `lsof -i :3000` or `netstat -ano | findstr :3000`

**TypeScript errors:**
- Run `npm run type-check` to see all issues
- Check tsconfig.json paths

## 📚 Documentation

- **README.md** - Full feature overview and architecture
- **IMPLEMENTATION.md** - Technical details and next steps
- This file - Quick reference

## 🎯 Demo Script (5 minutes)

1. Open http://localhost:3000
2. Show dashboard with critical alert
3. Click Topology, highlight service dependencies
4. Click Payments Service, show recent deployment
5. Go to Incidents, show timeline and investigation
6. Ask assistant: "What changed before this?"
7. Generate report, show output

## 🔐 Data Freshness

All fictional data:
- Timestamps are relative to server startup time
- "90 minutes ago" = deployment time
- "60 minutes ago" = alert trigger
- All data resets when backend restarts

## 🎨 Customization

**Change colors:** Edit CSS variables in `frontend/src/App.css` (lines 1-12)

**Add new service:** Edit `backend/src/fixtures.ts` `generateFictionalData()` function

**Add new API endpoint:** Add to `backend/src/app.ts`

## 📞 Next Steps

1. ✅ Explore fictional data structure
2. ✅ Try all UI screens and interactions
3. ✅ Test API endpoints with curl
4. ✅ Review code architecture
5. ⏭️ Plan Azure API integration
6. ⏭️ Add authentication
7. ⏭️ Implement real data sources

---

**Status:** MVP Complete - Ready for API integration
**Built:** Full-stack end-to-end solution
**Time to Production:** Add real APIs, auth, tests
