import { Building2, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';

export function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const isActive = (path: string) =>
    path === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(path);

  return (
    <div className="bg-[#1E293B] border-b border-[#0B67FF]/20 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Building2 size={32} className="text-[#0B67FF]" />
        <span className="text-xl">ComplianceAI</span>
      </div>

      {/* Center Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <button
          onClick={() => navigate('/dashboard')}
          className={`transition-colors ${
            isActive('/dashboard')
              ? 'text-[#F8FAFC]'
              : 'text-[#6B7280] hover:text-[#F8FAFC]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/dashboard/projects')}
          className={`transition-colors ${
            isActive('/dashboard/projects')
              ? 'text-[#F8FAFC]'
              : 'text-[#6B7280] hover:text-[#F8FAFC]'
          }`}
        >
          Projects
        </button>
        <button
          disabled
          className="transition-colors text-[#6B7280] cursor-not-allowed"
        >
          Analytics
        </button>
        <button
          onClick={() => navigate('/dashboard/settings')}
          className={`transition-colors ${
            isActive('/dashboard/settings')
              ? 'text-[#F8FAFC]'
              : 'text-[#6B7280] hover:text-[#F8FAFC]'
          }`}
        >
          Settings
        </button>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-lg hover:bg-[#0B67FF]/10 transition-colors"
        >
          <Bell size={20} className="text-[#6B7280]" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
        </motion.button>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F172A] border border-[#0B67FF]/30">
              <div className="w-8 h-8 rounded-full bg-[#0B67FF]/20 flex items-center justify-center text-xs font-medium text-[#0B67FF]">
                {user.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?' }
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm text-[#F8FAFC] leading-tight">
                  {user.full_name || user.email}
                </span>
                <span className="text-xs text-[#6B7280] leading-tight">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="text-xs md:text-sm text-[#FCA5A5] hover:text-[#F87171]"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
