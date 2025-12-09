import { Topbar } from './dashboard/Topbar';
import { Sidebar } from './dashboard/Sidebar';
import { Outlet } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="h-screen flex flex-col bg-[#0F172A]">
      <Topbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}