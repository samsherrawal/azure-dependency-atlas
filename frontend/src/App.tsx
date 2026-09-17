import React, { useEffect, useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import DependencyGraph from './components/DependencyGraph';
import ServiceDetails from './components/ServiceDetails';
import AssistantChat from './components/AssistantChat';
import HealthDashboard from './components/HealthDashboard';
import IncidentWorkspace from './components/IncidentWorkspace';

type Page = 'dashboard' | 'graph' | 'incident';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch workspace data
    fetch('http://localhost:5000/api/workspace')
      .then((res) => res.json())
      .then((data) => {
        setWorkspace(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load workspace:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading Atlas...</div>;
  }

  return (
    <Layout
      workspace={workspace}
      onPageChange={setCurrentPage}
      onServiceSelect={setSelectedService}
      selectedService={selectedService}
    >
      {/* Left pane: Assistant */}
      <div className="pane pane-left">
        <AssistantChat selectedService={selectedService} />
      </div>

      {/* Center pane: Canvas */}
      <div className="pane pane-center">
        {currentPage === 'dashboard' && <HealthDashboard onIncidentSelect={() => setCurrentPage('incident')} />}
        {currentPage === 'graph' && <DependencyGraph onServiceSelect={setSelectedService} />}
        {currentPage === 'incident' && <IncidentWorkspace />}
      </div>

      {/* Right pane: Service Details */}
      <div className="pane pane-right">
        {selectedService && <ServiceDetails service={selectedService} />}
      </div>
    </Layout>
  );
}

export default App;
