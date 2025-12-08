import { useState } from 'react';
import { Topbar } from './dashboard/Topbar';
import { Sidebar } from './dashboard/Sidebar';
import { Overview } from './dashboard/Overview';
import { ProjectList } from './dashboard/ProjectList';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'projects':
        return <ProjectList />;
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="mb-4">Settings</h2>
            <p className="text-[#6B7280]">Settings page coming soon...</p>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0F172A]">
      <Topbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}