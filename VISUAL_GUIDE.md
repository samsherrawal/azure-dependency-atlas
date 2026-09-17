# 🎯 QUICK START - Visual Guide

## 1️⃣ OPEN TERMINAL/POWERSHELL

```
Click Windows Start → Type "PowerShell" → Open PowerShell
OR
Click Windows Start → Type "cmd" → Open Command Prompt
```

---

## 2️⃣ NAVIGATE TO PROJECT

Paste this command:
```powershell
cd "C:\Users\sarawal\OneDrive - Microsoft\SamMicrosoft\FedWork\learning\azure-dependency-atlas"
```

Press **Enter** ↩️

---

## 3️⃣ START THE APPLICATION

Type this:
```bash
docker-compose up
```

Press **Enter** ↩️

You should see:
```
✓ Starting PostgreSQL...
✓ Starting Backend...
✓ Starting Frontend...

🚀 Frontend listening on port 3000
```

**Wait 30-60 seconds for everything to start** ⏱️

---

## 4️⃣ OPEN IN BROWSER

Open your web browser and go to:
```
http://localhost:3000
```

**🎉 App is now open!**

---

## 5️⃣ WHAT YOU SEE

### Left Panel (25%)
```
🤖 Atlas Assistant
└─ Chat area
└─ Type your questions here
└─ Get answers about infrastructure
```

### Middle Panel (50%)
```
📊 Working Canvas
├─ Dashboard (default)
│  ├─ Health stats
│  ├─ Critical alerts
│  ├─ Open incidents
│  └─ Risk forecasts
├─ Topology (click tab)
│  ├─ Services list
│  └─ Resources list
└─ Incidents (click tab)
   ├─ Investigation timeline
   ├─ Evidence
   └─ Report generator
```

### Right Panel (25%)
```
📋 Service Details
├─ Click a service
├─ See metadata
├─ See dependencies
├─ See alerts
└─ See recent changes
```

---

## 6️⃣ QUICK INTERACTIONS

### Try This (30 seconds each)

**A) Look at Dashboard**
- See 4 big numbers at top
- Notice "1 Critical Alert" - Payments Service error
- See "1 Open Incident" - currently investigating
- Spot "2 Risk Warnings" - upcoming problems

**B) Click "Topology" Tab**
- Scroll through the services list
- Click on "Payments Service" (orange indicator)
- See details appear on right

**C) Type in Assistant Chat**
- Type: "What depends on this?"
- Get answer with evidence
- Try: "What changed?"
- Try: "Why might this fail?"

**D) Click "Incidents" Tab**
- See timeline of events
- Read investigation details
- Click "Generate Report"
- See incident summary

---

## 7️⃣ WHEN YOU'RE DONE

In the terminal/PowerShell where you ran `docker-compose up`:

Press: **Ctrl + C**

This stops the app.

---

## ❌ QUICK TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Port 3000 already in use" | Stop other apps, or change port in docker-compose.yml |
| "Docker: command not found" | Install Docker Desktop from docker.com |
| Browser shows "Can't reach server" | Wait 60 seconds and refresh |
| Nothing appears in terminal | Scroll up to find the actual output |
| App loads but looks broken | Clear browser cache (Ctrl+Shift+Delete) |

---

## 📊 WHAT THE APP SHOWS

```
SCENARIO: Payments Service Degradation

Timeline:
-90 min → Deployment v2.1.4 released
-60 min → Error rate alert triggered (6.42% vs 5% threshold)
-30 min → Investigation started
  Now  → Looking at incident data

Root Cause (what we discover):
- DB timeout config changed: 3000ms → 2000ms
- Too aggressive change causes timeouts
- Timeouts = error rate spike

Solution Path:
1. Identify → Via dashboard alerts
2. Investigate → Via incident workspace
3. Understand → Via assistant questions
4. Report → Via report generation
```

---

## 🎮 THREE WAYS TO EXPLORE

### Way 1: Dashboard First
```
1. See health overview
2. Notice critical alert on Payments
3. Click "Incidents" to investigate
4. Generate report
```

### Way 2: Topology First
```
1. Click "Topology" tab
2. Click on a service
3. See dependencies and details
4. Click "Incidents" to see investigations
```

### Way 3: Assistant First
```
1. Ask questions in left panel chat
2. Get evidence-based answers
3. Use insights to navigate rest of app
4. Verify findings in other screens
```

---

## ✅ SUCCESS CHECKLIST

After opening http://localhost:3000, you should see:

- [ ] Dashboard with 4 stat cards (or Topology/Incidents)
- [ ] Left panel with 🤖 assistant
- [ ] Right panel (empty until you click something)
- [ ] Top navigation bar with tabs
- [ ] Everything in dark theme (professional)

If all checked ✅ → **App is working!**

---

## 🎯 30-SECOND DEMO

1. **Open app** → See Dashboard
2. **Click "Topology"** → See services
3. **Click "Payments Service"** → See details
4. **Type in chat** → "What changed?"
5. **See answer** → Evidence with confidence
6. **Click "Incidents"** → See timeline
7. **Click "Generate Report"** → See summary

**That's the power! 🚀**

---

## 🔗 WHERE TO GO FROM HERE

- **Questions about running it?** → [HOW_TO_RUN.md](./HOW_TO_RUN.md)
- **Step-by-step walkthrough?** → [WALKTHROUGH.md](./WALKTHROUGH.md)
- **Keep this handy?** → [CHEATSHEET.md](./CHEATSHEET.md)
- **Want all features?** → [README.md](./README.md)
- **Starting point?** → [START_HERE.md](./START_HERE.md)

---

## 🎉 YOU'RE READY!

### Command to run:
```bash
docker-compose up
```

### URL to open:
```
http://localhost:3000
```

**Enjoy! 🚀**

---

**Questions while using the app? Check [CHEATSHEET.md](./CHEATSHEET.md) - it stays on your screen!**
