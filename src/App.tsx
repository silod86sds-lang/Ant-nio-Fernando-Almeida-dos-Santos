import React, { useState } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CitizenView from './components/CitizenView';
import VehicleView from './components/VehicleView';
import AgentPanel from './components/AgentPanel';

function AppContent() {
  const { currentUser } = useAppContext();
  const [currentView, setCurrentView] = useState<{ name: string; id?: string }>({ name: 'dashboard' });

  if (!currentUser) {
    return <Login />;
  }

  const navigate = (view: string, id?: string) => {
    setCurrentView({ name: view, id });
  };

  switch (currentView.name) {
    case 'citizen':
      return <CitizenView bi={currentView.id!} onBack={() => navigate('dashboard')} />;
    case 'vehicle':
      return <VehicleView plate={currentView.id!} onBack={() => navigate('dashboard')} />;
    case 'agent':
      return <AgentPanel onBack={() => navigate('dashboard')} />;
    case 'dashboard':
    default:
      return <Dashboard onNavigate={navigate} />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

