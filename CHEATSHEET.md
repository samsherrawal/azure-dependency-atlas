# Cloud Dependency Atlas - One-Page Cheat Sheet

## 🚀 RUN IN 3 STEPS

### Step 1️⃣ Open PowerShell/Terminal
```
cd "C:\Users\sarawal\OneDrive - Microsoft\SamMicrosoft\FedWork\learning\azure-dependency-atlas"
```

### Step 2️⃣ Start the App
```
docker-compose up
```

### Step 3️⃣ Open Browser
```
http://localhost:3000
```

**Done! ✅**

---

## 🎯 WHAT TO DO WHEN YOU OPEN IT

### See This First?
```
Dashboard with:
- 100% Healthy Resources
- 1 Critical Alert (Payments Service error)
- 1 Open Incident (investigating degradation)
- 2 Risk Warnings
```

### Click These Tabs
| Tab | What You See |
|-----|------------|
| **Dashboard** | Health overview + alerts |
| **Topology** | Services & resources list |
| **Incidents** | Investigation timeline |

### Click on Services/Resources (Right Side Appears)
- Service metadata
- Dependencies
- Alerts
- Recent changes

### Use the Assistant (Left Panel)
**Try typing:**
- "What depends on this?"
- "What changed before this?"
- "Why might this fail?"

---

## 📊 THE SCENARIO

**Company:** Acme Corp  
**Problem:** Payments Service degraded (error rate too high)  
**Cause:** Recent deployment changed timeout config  
**Your job:** Investigate using the platform

---

## 🎮 5-MINUTE DEMO

1. **Look at Dashboard** (30 sec) - See what's broken
2. **Click Topology** (30 sec) - See services involved
3. **Click Payments Service** (30 sec) - See details
4. **Ask Assistant** (60 sec) - "What changed?"
5. **Click Incidents** (60 sec) - See investigation timeline
6. **Generate Report** (30 sec) - See summary

---

## ❌ NOT WORKING?

| Issue | Fix |
|-------|-----|
| Port 3000 in use | Edit `docker-compose.yml` or stop other apps |
| Docker not found | Install Docker Desktop |
| Very slow | Wait 30-60 sec, refresh browser |
| Can't reach localhost | Check `docker ps` shows containers running |

---

## 🛑 STOP THE APP

Press: `Ctrl + C` in terminal

---

## 📚 FULL GUIDES

- **Detailed setup:** [HOW_TO_RUN.md](./HOW_TO_RUN.md)
- **Quick reference:** [QUICKSTART.md](./QUICKSTART.md)
- **All features:** [README.md](./README.md)
- **Start here:** [START_HERE.md](./START_HERE.md)

---

**Keep this page open while using the app!** 🎯
