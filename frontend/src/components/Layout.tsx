import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  workspace: any;
  onPageChange: (page: string) => void;
  onServiceSelect: (service: any) => void;
  selectedService: any;
}

export default function Layout({
  children,
  workspace,
  onPageChange,
  onServiceSelect,
  selectedService,
}: LayoutProps) {
  return (
    <div className="layout">
      {/* Top navigation bar */}
      <div className="navbar">
        <div className="navbar-brand">
          <span className="robot-icon">🤖</span>
          <h1>{workspace?.name || 'Cloud Dependency Atlas'}</h1>
        </div>
        <div className="navbar-menu">
          <button onClick={() => onPageChange('dashboard')} className="nav-btn">
            Dashboard
          </button>
          <button onClick={() => onPageChange('graph')} className="nav-btn">
            Topology
          </button>
          <button onClick={() => onPageChange('incident')} className="nav-btn">
            Incidents
          </button>
          <button className="nav-btn">Settings</button>
        </div>
      </div>

      {/* Three-pane workspace */}
      <div className="workspace">{children}</div>
    </div>
  );
}
