# Cloud Dependency Atlas

A **high-density, dark-themed operations dashboard** for visualizing Azure cloud dependencies and incident analysis. Single-page React (Vite + Tailwind CSS) hackathon application.

## Quick Start

### 1. Install & Run
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production
```bash
npm run build
npm run preview
```

## Features

- **3-Zone Layout**
  - **Left Pane**: Atlas Assistant chatbot with quick-action buttons
  - **Center Pane**: Interactive dependency topology, incidents, and forecasts
  - **Right Pane**: Resource metadata, CI/CD deployment context, early warning forecasts

- **Dark Operations Aesthetic**: Slate-950 background with high-contrast text and status badges (green = healthy, yellow = degraded, red = failing)

- **Mock Data Included**: Realistic Azure resources, DevOps pipelines, alerts, and risk forecasts

- **Interactive Graph**: Visual dependency topology with status indicators and blast-radius visualization

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                 # Main 3-zone layout
│   ├── index.css               # Tailwind + global styles
│   ├── main.jsx                # React entry point
│   ├── mockData.js             # All mock data (resources, pipelines, alerts, forecasts)
│   └── components/
│       ├── LeftPane.jsx        # Chatbot interface
│       ├── CenterPane.jsx      # Canvas with tabs (Overview, Topology, Incidents, Forecasts)
│       ├── RightPane.jsx       # Context & action panel
│       └── DependencyGraph.jsx # Interactive node graph
├── package.json
├── index.html
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Development

### Add Mock Data
Edit `src/mockData.js` to update resources, pipelines, alerts, and forecasts.

### Customize Styling
Modify `tailwind.config.js` for theme customization or `src/index.css` for global overrides.

### Add New Components
Create new components in `src/components/` and import into App.jsx or appropriate parent component.

## License

ISC
