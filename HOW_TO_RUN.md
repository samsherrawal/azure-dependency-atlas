# 🚀 Run Cloud Dependency Atlas - Easy Setup Guide

## ⚡ Fastest Way (Recommended - 2 minutes)

### Step 1: Open Terminal/PowerShell
Navigate to the project folder:
```powershell
cd "C:\Users\sarawal\OneDrive - Microsoft\SamMicrosoft\FedWork\learning\azure-dependency-atlas"
```

### Step 2: Run One Command
```bash
docker-compose up
```

That's it! ✅

### Step 3: Open in Browser
Once you see `listening on port 3000`, open:
```
http://localhost:3000
```

**You're in! 🎉**

---

## 📍 What You'll See

### First Screen - Dashboard
You'll see:
- **4 stat cards** at top (100% healthy, 1 critical alert, 1 incident, 2 risks)
- **Critical Alert** - Red banner about Payments Service error rate
- **Open Incidents** - Yellow warning about Payments degradation
- **Risk Warnings** - Database capacity issue and deployment pattern

### Click "Topology" Tab
See a **list of services and resources**:
- User API (✓ healthy)
- **Payments Service (⚠️ degraded)**
- Notifications Service (✓ healthy)
- Data Pipeline (✓ healthy)
- Plus 11 resources (SQL DB, Redis, App Services, etc.)

### Click on "Payments Service"
**Right panel appears** with:
- Dependencies (which resources it uses)
- Active alerts (showing error rate spike)
- Recent deployments (v2.1.4 deployed 90 min ago)

### Click "Incidents" Tab
See the **investigation workspace**:
- Timeline showing: Deployment → Alert → Investigation
- Investigation notes (you can edit)
- Button to generate report

### Chat with Assistant (Left Panel)
The 🤖 **robot assistant** is ready! Try:
- Type: "What depends on this?"
- Type: "What changed before this?"
- Type: "Why might this fail?"
- Get answers with confidence scores

---

## 🎮 Interactive Demo (5 Minutes)

### Follow This Flow:

**1. Dashboard Overview** (30 sec)
- Look at the 4 stat cards
- Notice the critical alert about Payments
- See the forecast warnings

**2. Explore Services** (60 sec)
- Click "Topology" tab
- Click on "Payments Service" (degraded one)
- See dependencies, alerts, and recent changes

**3. Ask the Assistant** (90 sec)
- Look at left panel with 🤖 robot
- Click suggested question: "What depends on this?"
- Read the evidence-backed answer
- Ask another: "What changed?"

**4. Investigate Incident** (120 sec)
- Click "Incidents" tab
- See the timeline: deployment → alert → investigation
- Click "Generate Report"
- See incident summary created

**Done! ✅**

---

## 🛑 Stop the App

Press `Ctrl+C` in the terminal where `docker-compose up` is running.

---

## ❌ Not Working? Troubleshoot

### Problem: "Port 3000 is already in use"
**Solution:** Either:
- Stop other apps using port 3000, OR
- Edit `docker-compose.yml` line with `"3000:3000"` to `"3001:3000"`
- Then open `http://localhost:3001`

### Problem: Docker not installed
**Solution:** Install from https://www.docker.com/products/docker-desktop
- Restart computer after install
- Try again

### Problem: PostgreSQL container won't start
**Solution:** Run this first:
```bash
docker system prune -a
```
Then try `docker-compose up` again

### Problem: Slow to load
**Solution:** First time can take 30-60 seconds as containers start
- Wait for "listening on port 3000" message
- Then refresh browser

---

## 🔄 Alternative: Local Development (Without Docker)

If Docker doesn't work, run locally:

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```
Wait for: `🚀 listening on port 5000`

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```
Wait for: `VITE v5.0.8 ready in [X] ms`

### Terminal 3 - Open Browser:
```
http://localhost:3000
```

---

## 🎯 What Each Screen Does

| Screen | What to Try |
|--------|-----------|
| **Dashboard** | See health overview, alerts, incidents |
| **Topology** | See services + resources, click to view details |
| **Incidents** | Investigate degradation, see timeline |
| **Service Details** (Right panel) | View metadata when you click a service |
| **Assistant** (Left panel) | Ask questions about infrastructure |

---

## 🚀 Pro Tips

1. **Everything is fake data** - Safe to click anything
2. **Refresh browser** - Simulates real-time updates
3. **Try all questions** in assistant for different responses
4. **Click incident number** to see investigation context
5. **Generate report** multiple times with different notes

---

## 📱 Mobile/Tablet?

The app is responsive! Try:
- Shrink browser window to tablet size
- On phone, use Firefox or Chrome
- Layout automatically adjusts

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| View API Live | http://localhost:5000/api/workspace |
| Check Backend Health | http://localhost:5000/health |
| Full Guide | See [START_HERE.md](./START_HERE.md) |
| API Endpoints | See [README.md](./README.md#-api-endpoints) |

---

## ✅ Success Checklist

After running, you should see:

- [ ] Browser opens http://localhost:3000
- [ ] Dashboard shows 4 stat cards
- [ ] Critical alert visible about Payments Service
- [ ] Can click "Topology" and see services
- [ ] Can click Payments Service and see details
- [ ] Can click "Incidents" and see timeline
- [ ] Assistant on left responds to questions

**If all checked ✅ - App is working!**

---

## 🎬 Recording What You See

Want to screenshot/share what you see? The app shows:

```
┌─────────────────────────────────────────────┐
│  🤖 Cloud Dependency Atlas              ┌─┐ │
├──────────── Dashboard | Topology | Incidents │
├─────────────┬──────────────────┬─────────────┤
│ Assistant   │ Health Dashboard │  Details    │
│ (Left)      │  (Center)        │  (Right)    │
│             │                  │             │
│ 🤖 Chat     │ Stats Cards      │ Service     │
│ Questions   │ Alerts           │ Health      │
│ Evidence    │ Incidents        │ Dependencies│
│             │ Forecasts        │ Alerts      │
└─────────────┴──────────────────┴─────────────┘
```

---

## 🆘 Need More Help?

1. **Quickest start?** → Run `docker-compose up`
2. **Not working?** → Check troubleshooting above
3. **Want details?** → Read [QUICKSTART.md](./QUICKSTART.md)
4. **Technical questions?** → Read [README.md](./README.md)

---

## 🎉 That's It!

**Run the command, wait 30 seconds, open the browser, explore!**

```bash
docker-compose up
```

Then: http://localhost:3000

**Enjoy! 🚀**
