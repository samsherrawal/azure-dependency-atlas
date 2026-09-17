# How to Run Cloud Dependency Atlas

Welcome! This guide will help you get the application running quickly.

## 🚀 Fastest Way (Recommended for Everyone)

### Windows Users
Double-click one of these files from the project root directory:

```
START_APP.bat          (for Command Prompt users)
START_APP.ps1          (for PowerShell users)
```

Both scripts will:
- ✅ Install dependencies automatically
- ✅ Start the backend server (port 5000)
- ✅ Start the frontend server (port 3000)  
- ✅ Open two terminal windows automatically
- ✅ Display ready message when both are running

Then open your browser to: **http://localhost:3000**

---

## Manual Setup (If Scripts Don't Work)

### Prerequisites
- **Node.js 18+** — [Download from nodejs.org](https://nodejs.org)
- **npm** — Included with Node.js

### Step 1: Open Terminal
Open PowerShell or Command Prompt in the project root directory.

### Step 2: Install Backend Dependencies
```powershell
cd backend
npm install
npm run dev
```

You should see:
```
✓ Fictional data initialized
  - Workspace: Acme Corp
  - Environments: 3
  - Services: 4
  ...
Server running on port 5000
```

### Step 3: Open Another Terminal Window
In a **separate** terminal, in the project root:

```powershell
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.4.21  ready in 2171 ms

  ➜  Local:   http://localhost:3000/
```

### Step 4: Open Your Browser
Navigate to: **http://localhost:3000**

---

## 🐳 Using Docker (If Docker Desktop is Running)

First, make sure Docker Desktop is running on your machine, then:

```powershell
docker-compose up
```

This will start all services:
- **PostgreSQL** on port 5432
- **Backend API** on port 5000
- **Frontend** on port 3000

Open browser to: **http://localhost:3000**

---

## ✅ Verify Everything is Working

### Backend API Test
In PowerShell/Terminal:
```powershell
curl http://localhost:5000/health
```

You should see:
```json
{"status":"ok","timestamp":"2026-09-17T17:41:14.056Z"}
```

### Test API Endpoints
```powershell
# Get all services
curl http://localhost:5000/api/services

# Get all resources
curl http://localhost:5000/api/resources

# Get all dependencies
curl http://localhost:5000/api/dependencies
```

### Frontend Test
Visit http://localhost:3000 and you should see:
- Dashboard tab showing health overview
- Topology tab showing dependency graph
- Incidents tab showing investigation scenario
- Assistant panel on the left

---

## 🐛 Troubleshooting

### "Port 5000 already in use"
Another application is using port 5000. Either:
- Kill the process: `taskkill /IM node.exe` (careful—this stops all Node processes)
- Change backend port: Edit `backend/src/app.ts` line 5: `const port = 5001;`

### "Port 3000 already in use"
Edit `frontend/vite.config.ts` and add:
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  }
})
```

### "npm: command not found"
Node.js is not installed. [Download Node.js 18+](https://nodejs.org)

### "Cannot find module '@types/cors'"
Run in the backend directory:
```powershell
npm install --save-dev @types/cors
```

### Frontend won't connect to backend
Check:
1. Backend is running: `curl http://localhost:5000/health`
2. Frontend has correct API URL: Check `frontend/src/components/*.tsx` for `http://localhost:5000`
3. No firewall blocking port 5000

### Docker Compose fails to connect
Docker Desktop is not running:
- **Windows:** Search for "Docker Desktop" in Start Menu and launch it
- **Wait 30-60 seconds** for Docker daemon to fully start
- Then run `docker-compose up`

---

## 📚 Next Steps

Once the app is running:

1. **Explore the Dashboard**
   - See health overview, active incidents, and forecasts
   - Click on services to see detailed information

2. **Explore Topology**
   - Interactive dependency graph
   - See how services connect
   - View resource details

3. **Investigate an Incident**
   - Go to Incidents tab
   - See investigation timeline with evidence
   - Review hypotheses and supporting data

4. **Chat with Assistant**
   - Ask questions about infrastructure
   - Get context-aware recommendations
   - Example questions:
     - "What depends on the payments API?"
     - "What services might be affected by this deployment?"
     - "Show me the most likely failure path"

---

## 🛑 Stopping the Application

### If Running with Scripts
- Close the backend and frontend terminal windows

### If Running Manually
- In each terminal: Press **Ctrl+C**

### If Running with Docker
- Press **Ctrl+C** in the Docker terminal
- Or run: `docker-compose down`

---

## 📖 Additional Resources

- **GO.md** — Ultra-quick 2-minute start
- **CHEATSHEET.md** — One-page command reference
- **VISUAL_GUIDE.md** — Step-by-step with ASCII diagrams
- **WALKTHROUGH.md** — Interactive guided tour
- **ARCHITECTURE.md** — System design and component overview
- **README.md** — Complete feature documentation

---

## ✨ Enjoy!

The Cloud Dependency Atlas is now ready to explore. Ask the assistant questions, visualize dependencies, and investigate incidents using realistic fictional Acme Corp infrastructure data.

Questions? Check the documentation files listed above or review the code in `backend/src/` and `frontend/src/`.
