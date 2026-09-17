# 🎬 Interactive App Walkthrough

**Follow this guide step-by-step as the app is open in your browser.**

---

## ✅ Step 1: App is Open (http://localhost:3000)

### You should see:
```
┌─────────────────────────────────────────────────┐
│  🤖 Cloud Dependency Atlas | Dashboard | ...    │
├─────────────┬───────────────────┬───────────────┤
│ ASSISTANT   │ HEALTH DASHBOARD  │ (empty)       │
│ 🤖 Chat     │                   │               │
│ Hello!      │ 100% Healthy      │               │
│             │ 1 Critical Alert  │               │
│             │ 1 Open Incident   │               │
│             │ 2 Risk Warnings   │               │
└─────────────┴───────────────────┴───────────────┘
```

### ✅ If you see this, proceed!

---

## 🎯 Step 2: Understand the Problem

### Look at the Dashboard
You'll see:
- **100% Healthy:** 11 of 11 resources running (wait, that's not right!)
- **1 Critical Alert:** 🔴 "High Error Rate on Payments Service"
- **1 Open Incident:** "Payments Service - High Error Rate (Ongoing)"
- **2 Risk Warnings:** 
  - SQL Database capacity (2-3 days)
  - Payments deployment failure pattern (NOW)

### 🤔 Question for You:
**"Why is the Payments Service showing errors? What happened?"**

---

## 🔍 Step 3: Click "Topology" Tab (Top Right)

### What you'll see:
A list of services and resources:

**Services:**
- User API ✅ (healthy - green dot)
- Payments Service ⚠️ (degraded - orange dot)
- Notifications Service ✅ (healthy)
- Data Pipeline ✅ (healthy)

**Resources:**
- prod-sql-primary (database)
- prod-app-service-api
- prod-app-service-payments
- prod-redis-cache
- prod-storage-blobs
- And more...

### 📝 What this shows:
Your infrastructure topology - which services depend on which resources.

---

## 🔎 Step 4: Click on "Payments Service" (in Topology)

### The Right Panel Should Appear with:

**Health:** UNHEALTHY (red)

**Dependencies (what it needs):**
- prod-app-service-payments (95-100% confidence)
- prod-sql-primary (database)
- User API service

**Active Alerts:**
- 🔴 High Error Rate (6.42% vs 5% threshold)
- triggered 60 minutes ago

**Recent Deployments:**
- v2.1.4 deployed 90 minutes ago
- Risk score: 70% (concerning!)
- Changed files: payments/handler.ts, payments/db-queries.sql
- Config change: DB_TIMEOUT 3000ms → 2000ms

### 💡 Aha Moment:
**"The deployment happened BEFORE the error alert triggered!"**
**"And the database timeout got reduced!"**

---

## 💬 Step 5: Ask the Assistant

### Look at Left Panel (🤖 Assistant)

### Type this question:
```
What depends on the Payments Service?
```

### You'll get:
```
3 service(s) depend on this resource.
[Evidence: Dependencies list]
Confidence: 95%
```

### Try another question:
```
What changed before this latency spike?
```

### You'll get:
```
A deployment occurred 90 minutes ago to Payments Service v2.1.4.
Changed files: payments/handler.ts, payments/db-queries.sql.
Configuration changed: DB_TIMEOUT: 3000ms → 2000ms.
[Evidence: Deployment record]
Confidence: 98%
```

### One more:
```
Why is Payments failing?
```

### You'll get:
```
The Payments Service is experiencing critical error rate (6.42% vs 5%).
Root cause may be related to recent deployment and database timeout.
[Evidence: Alert + Deployment]
Confidence: 85%
Suggested next steps:
1. Check deployment rollback option
2. Review database connection pool
3. Analyze error logs
```

---

## 📋 Step 6: Click "Incidents" Tab

### You'll see:
**Left side:** List of incidents
- "Payments Service - High Error Rate (Ongoing)"

**Right side:** Investigation Details
- Title: Payments Service - High Error Rate (Ongoing)
- Severity: CRITICAL
- Status: INVESTIGATING
- Created: 60 minutes ago

**Timeline:**
```
-90 min  → Deployment v2.1.4 completed
-60 min  → Alert triggered: High Error Rate
  Now   → Investigation initiated
```

**Investigation Notes:**
Empty text area - you can type here to record your findings

---

## 📄 Step 7: Generate a Report

### Click Button: "Generate Report"

### You'll see:
```
POST-INCIDENT REPORT
═══════════════════════

Service: Payments Service
Severity: Critical
Duration: ~60 minutes
Status: Investigating

## Timeline
- 90 min ago: Deployment v2.1.4
- 60 min ago: Error rate alert
- Now: Investigation

## Probable Cause
Database timeout configuration reduced from 3000ms to 2000ms.
Causing query timeouts under load.

## Recommended Actions
1. Rollback to previous version
2. Review database performance metrics
3. Implement gradual timeout reduction

## Evidence
- Error rate spike correlates with deployment time
- Database CPU elevated to 87%
- Similar incident pattern observed 2x historically
```

### 💾 Download or Copy
Report is ready to share with your team!

---

## 🎓 What You Just Learned

### The App Can Help You:

1. **See What's Running** (Dashboard, Topology)
   - 100% visibility into services and dependencies
   - Real-time status indicators

2. **Understand Dependencies** (Topology, Details)
   - What depends on what
   - Blast radius of changes

3. **Find Problems** (Dashboard, Alerts)
   - Critical alerts highlighted
   - Risk forecasts for future issues

4. **Get Context** (Assistant, Evidence)
   - Ask questions about infrastructure
   - Get answers with confidence scores
   - See supporting evidence

5. **Investigate Incidents** (Incident Workspace)
   - Timeline of events
   - Related changes and alerts
   - Investigation notes
   - Auto-generated reports

---

## 🎯 Your Next Steps

### Simulate Different Scenarios:

**Scenario 1: Rollback Investigation**
- Go to Incidents
- Take notes: "v2.1.4 shows high risk, should rollback"
- Note: "DB timeout was 3000ms, now 2000ms - too aggressive"
- Generate report
- You have your incident summary!

**Scenario 2: Dependency Analysis**
- Click Topology
- Find a service
- Ask assistant: "What depends on X?"
- See blast radius of potential changes

**Scenario 3: Risk Assessment**
- Look at Forecasts (on Dashboard)
- SQL Database capacity 2-3 days
- Deployment failure pattern HIGH
- Plan preventive actions

---

## ⚡ Speed Test

**How fast can you:**
1. Identify the problem? (30 sec)
2. Find the root cause? (60 sec)
3. Get recommendations? (30 sec)
4. Generate report? (30 sec)

**Total: ~2-3 minutes to go from "there's a problem" to "here's a report"**

That's the power of infrastructure intelligence! 🚀

---

## 🎉 Congratulations!

You've successfully:
- ✅ Launched the application
- ✅ Explored the dashboard
- ✅ Examined the topology
- ✅ Investigated a service
- ✅ Asked the assistant
- ✅ Reviewed an incident
- ✅ Generated a report

**You're now an expert user of Cloud Dependency Atlas! 👏**

---

## 🤔 Questions?

| Question | Answer |
|----------|--------|
| Is this data real? | No, it's fictional (Acme Corp scenario). Ready for real Azure data. |
| Can I change things? | Yes! Edit investigation notes, try different scenarios. |
| Will it break? | No! Everything is safe to click. Just refresh to reset. |
| How do I stop it? | Press Ctrl+C in the terminal running docker-compose. |

---

## 📚 Want More?

- **More details on running:** [HOW_TO_RUN.md](./HOW_TO_RUN.md)
- **API documentation:** [README.md](./README.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Technical details:** [IMPLEMENTATION.md](./IMPLEMENTATION.md)

---

**🎬 End of Walkthrough**

**Enjoy exploring! 🚀**
