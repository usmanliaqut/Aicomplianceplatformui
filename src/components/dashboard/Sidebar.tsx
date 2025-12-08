import { motion } from 'motion/react';
import { LayoutDashboard, FolderKanban, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div
      className="bg-[#1E293B] border-r border-[#0B67FF]/20 h-full relative"
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-[#0B67FF] rounded-full flex items-center justify-center text-white hover:bg-[#0952CC] transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Menu Items */}
      <nav className="py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors relative ${
                isActive
                  ? 'text-[#0B67FF] bg-[#0B67FF]/10'
                  : 'text-[#6B7280] hover:text-[#F8FAFC] hover:bg-[#0B67FF]/5'
              }`}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#0B67FF]"
                  transition={{ duration: 0.3 }}
                />
              )}
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
}