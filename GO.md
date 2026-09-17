# ✅ COMPLETE - Here's How to Run the App

## 🚀 FASTEST WAY (Literally 3 Steps)

### Step 1: Open PowerShell
Click Windows Start → Type "PowerShell" → Click it

### Step 2: Paste This
```powershell
cd "C:\Users\sarawal\OneDrive - Microsoft\SamMicrosoft\FedWork\learning\azure-dependency-atlas" && docker-compose up
```

### Step 3: Open Browser
```
http://localhost:3000
```

**That's it! 🎉**

---

## 📊 What You'll See

### Left Panel (Assistant)
```
🤖 Hello! I'm your infrastructure assistant.
Ask me about dependencies, deployments, or issues.
```

### Middle Panel (Dashboard - Default)
```
INFRASTRUCTURE HEALTH
┌─────────────────────────────────┐
│ 100% Healthy  1 Alert  1 Incident│
│   Resources    (Critical)   (Open)│
│                                  │
│ 🔴 CRITICAL: Payments error rate │
│    Current: 6.42%, Threshold: 5% │
│                                  │
│ ⚠️  INCIDENT: Payments Service   │
│    Status: Investigating         │
│                                  │
│ 🔮 FORECAST: SQL Database risk   │
│    HIGH confidence, 2-3 days     │
└─────────────────────────────────┘
```

### Right Panel (Details)
Empty until you click something

---

## 🎮 3 Things to Try First

### 1. Click "Payments Service" (Left side)
**Right panel shows:**
- Status: DEGRADED ⚠️
- Dependencies: SQL DB, User API
- Active Alerts: Error rate 6.42%
- Recent Deploy: v2.1.4 (90 min ago, risk: 70%)

**What you learn:** "A recent deployment with risky config changes might be causing errors"

### 2. Type in Chat (Left panel)
```
Type: "What changed?"
Response: "Deployment v2.1.4 changed DB timeout 3000ms→2000ms"
Confidence: 98%
```

**What you learn:** "Assistant gives evidence-backed answers"

### 3. Click "Incidents" Tab (Top)
**You see:**
- Timeline: Deployment → Alert → Investigation
- Button to generate report
- Investigation notes area

**What you learn:** "Platform guides you through incident investigation"

---

## ⏱️ Total Time

- Setup: 1-2 minutes
- First look: 30 seconds
- Exploration: 5-10 minutes

**Total to see the full value: < 15 minutes**

---

## 🛑 Stop When Done

Press **Ctrl+C** in the PowerShell window

---

## ❌ Quick Fixes

| Problem | Fix |
|---------|-----|
| Port 3000 in use | Stop other apps or wait, it will free up |
| Docker not found | Install Docker Desktop, restart computer |
| Blank screen | Wait 60 seconds, refresh browser |
| Can't connect | Check PowerShell shows "listening on port 3000" |

---

## 📚 If You Want More Info

| Need | File |
|------|------|
| Impatient? | [RUN_NOW.md](./RUN_NOW.md) |
| One page? | [CHEATSHEET.md](./CHEATSHEET.md) |
| Step by step? | [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) |
| Full guide? | [HOW_TO_RUN.md](./HOW_TO_RUN.md) |
| Walkthrough? | [WALKTHROUGH.md](./WALKTHROUGH.md) |

---

## ✨ What Makes This Special

This isn't just a demo - it's a **complete working application** showing:

1. **Infrastructure Visibility** - See everything running
2. **Dependency Mapping** - Understand connections
3. **Problem Detection** - Alerts highlight issues
4. **Root Cause Analysis** - Find what changed
5. **Intelligence** - Assistant explains relationships
6. **Incident Management** - Investigate and report
7. **Risk Forecasting** - See problems before they happen

**All in one integrated platform.**

---

## 🎬 Demo Script (If Showing Someone)

**"Let me show you Cloud Dependency Atlas"**

Run: `docker-compose up`

Open: `http://localhost:3000`

**"Here's our infrastructure dashboard. We have one critical alert on our Payments Service - error rate is 6.42%, above the 5% threshold."**

Click "Payments Service"

**"Here we can see exactly what it depends on - the SQL database, our User API, and the deployment that happened 90 minutes ago shows high risk with a configuration change."**

Type in chat: "What changed?"

**"The assistant immediately tells us the problem - database timeout reduced from 3000ms to 2000ms. This aggressive change is likely causing queries to timeout under load, which explains the spike in errors."**

Click "Incidents"

**"We can see the complete timeline and generate a comprehensive incident report."**

Click "Generate Report"

**"Here's the report ready to share with the team - probable cause, recommended actions, and supporting evidence all in one place."**

**"That's infrastructure intelligence in action - going from 'we have an alert' to 'here's what happened and what to do' in minutes."**

---

## 🎯 Success Checklist

After opening the app, you should have:

- [ ] Browser shows http://localhost:3000
- [ ] Dark theme dashboard visible
- [ ] 4 stat cards at top
- [ ] Left panel with 🤖 assistant
- [ ] Can click tabs (Dashboard, Topology, Incidents)
- [ ] Can click services and see details
- [ ] Can type in chat
- [ ] Can generate reports

**All checked?** You're done! App is working perfectly. ✅

---

## 🚀 Ready?

**Command:**
```powershell
cd "C:\Users\sarawal\OneDrive - Microsoft\SamMicrosoft\FedWork\learning\azure-dependency-atlas" && docker-compose up
```

**Then:**
```
http://localhost:3000
```

**Enjoy! 🎉**

---

**Questions? See [RUN_NOW.md](./RUN_NOW.md) for more details.**
