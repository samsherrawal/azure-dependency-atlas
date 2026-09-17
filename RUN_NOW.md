# 🎯 HOW TO RUN - FINAL ANSWER

## The Simplest Way - Copy & Paste

### 1. Open PowerShell or Command Prompt
- Press **Windows Key**
- Type **"powershell"**
- Click **"Windows PowerShell"**

### 2. Copy This Command (Exactly)
```powershell
cd "C:\Users\sarawal\OneDrive - Microsoft\SamMicrosoft\FedWork\learning\azure-dependency-atlas" && docker-compose up
```

### 3. Paste Into PowerShell
- Right-click → Paste
- OR Ctrl+Shift+V

### 4. Press Enter
- Wait 30-60 seconds
- You'll see: `🚀 Frontend listening on port 3000`

### 5. Open Browser
- Go to: **http://localhost:3000**
- 🎉 **App is open!**

---

## 🎮 What You Can Do Right Now

### The Dashboard Opens
You'll see:
- **Stat cards** showing health metrics
- **Critical alert** about Payments Service
- **Open incident** that needs investigating
- **Risk forecasts** for upcoming problems

### Try These 3 Things

**1. Click "Payments Service" in the list**
- Right panel shows: dependencies, alerts, recent deployments
- Notice: v2.1.4 deployed 90 minutes ago
- Notice: DB timeout changed from 3000ms to 2000ms
- **"Aha! That's probably the problem!"**

**2. Type in Left Panel Chat**
```
What changed before this error?
```
- Assistant answers: "Deployment v2.1.4 changed DB timeout"
- Shows confidence: 98%
- Lists evidence

**3. Click "Incidents" Tab**
- See timeline: Deployment → Alert → Investigation
- Click "Generate Report"
- Get incident summary ready to share

---

## 📊 What You're Looking At

Your fictional infrastructure:
- **Company:** Acme Corp
- **Problem:** Payments Service error rate too high
- **When:** Started 90 minutes after deployment
- **Why:** Database timeout changed too aggressively
- **What to do:** Investigate using the platform

**The app helps you:**
1. See what's running (Dashboard)
2. Understand dependencies (Topology)
3. Find problems (Alerts)
4. Investigate incidents (Timeline)
5. Get recommendations (Assistant)
6. Generate reports (Export)

---

## ⏱️ Time Breakdown

| Task | Time |
|------|------|
| Setup Docker | 1 min |
| Start app | 1 min |
| Open browser | 30 sec |
| Explore dashboard | 1 min |
| Investigate service | 1 min |
| Ask assistant | 1 min |
| View incident | 1 min |
| Generate report | 1 min |
| **Total** | **~8 minutes** |

---

## 🛑 To Stop the App

In the PowerShell window where it's running:

**Press: Ctrl + C**

Done! App stops.

---

## ❌ Doesn't Work?

### Problem 1: "Port 3000 already in use"
**Fix:** 
```
Stop Docker
docker-compose down
docker-compose up
```

### Problem 2: "Docker: command not found"
**Fix:** Install Docker Desktop
- Go to: https://www.docker.com/products/docker-desktop/
- Download and install
- Restart computer
- Try again

### Problem 3: Browser shows "Can't reach localhost:3000"
**Fix:**
- Wait 60 full seconds
- Refresh browser (Ctrl+R)
- Check PowerShell shows "listening on port 3000"

### Problem 4: Still stuck?
**Read:** [HOW_TO_RUN.md](./HOW_TO_RUN.md) - Full troubleshooting guide

---

## 🎬 Quick Video Script (If You Want to Record)

**Say:** "Here's Cloud Dependency Atlas in action"

**Show:** Run the command
```
docker-compose up
```

**Say:** "It starts three services - frontend, backend, and database"

**Show:** Open browser to http://localhost:3000

**Say:** "Here's the dashboard showing infrastructure health. We have one critical alert."

**Do:** Click "Payments Service"

**Say:** "We can see all the details - it depends on the SQL database, and there was a recent deployment v2.1.4 with a risky configuration change."

**Do:** Type in chat "What changed?"

**Say:** "The assistant gives us evidence-backed answers with confidence scores."

**Do:** Click "Incidents"

**Say:** "We can investigate, see the timeline, and generate a report - all in one place."

**Do:** Click "Generate Report"

**Say:** "Report ready to share with the team. That's infrastructure intelligence in action!"

---

## 📚 Pick Your Learning Style

| Style | Document |
|-------|----------|
| **Impatient?** | [CHEATSHEET.md](./CHEATSHEET.md) - One page |
| **Visual learner?** | [VISUAL_GUIDE.md](./VISUAL_GUIDE.md) - Step-by-step |
| **Detail oriented?** | [HOW_TO_RUN.md](./HOW_TO_RUN.md) - Full guide |
| **Want walkthrough?** | [WALKTHROUGH.md](./WALKTHROUGH.md) - Interactive |

---

## ✅ Verification

**The app is running correctly if you see:**

```
✓ http://localhost:3000 loads
✓ Dark theme dashboard appears
✓ Left panel has 🤖 assistant
✓ Dashboard shows stat cards
✓ Can click "Topology" and see services
✓ Can click "Incidents" and see timeline
✓ Can type in chat and get responses
```

If all ✓ → **You're good to go!**

---

## 🚀 The Command (One More Time)

Copy and paste this into PowerShell:

```powershell
cd "C:\Users\sarawal\OneDrive - Microsoft\SamMicrosoft\FedWork\learning\azure-dependency-atlas" && docker-compose up
```

Then open: `http://localhost:3000`

---

## 💡 Pro Tips

1. **Keep browser open** - You'll use it while reading docs
2. **Keep PowerShell open** - App runs in this window
3. **Refresh browser** - Simulates new data arriving
4. **Everything is safe** - Can't break anything, all fake data
5. **Ask questions** - The assistant is waiting for you

---

## 🎉 That's It!

You now have:
- ✅ Running application
- ✅ Fictional incident to investigate
- ✅ Full platform to explore
- ✅ Multiple guides to help you

**Go explore and enjoy! 🚀**

---

**Questions? Check the relevant guide above or review [START_HERE.md](./START_HERE.md)**
