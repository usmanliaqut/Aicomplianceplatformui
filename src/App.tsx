import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'login' | 'register'>('landing');

  const handleNavigate = (page: string) => {
    setCurrentView(page as 'landing' | 'dashboard' | 'login' | 'register');
  };

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Render Current View */}
      {currentView === 'landing' && <LandingPage onNavigate={handleNavigate} />}
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'login' && <Login onNavigate={handleNavigate} />}
      {currentView === 'register' && <Register onNavigate={handleNavigate} />}
    </div>
  );
}