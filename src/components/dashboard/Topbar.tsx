import { Building2, Bell, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

export function Topbar() {
  return (
    <div className="bg-[#1E293B] border-b border-[#0B67FF]/20 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Building2 size={32} className="text-[#0B67FF]" />
        <span className="text-xl">ComplianceAI</span>
      </div>

      {/* Center Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <a href="#" className="text-[#F8FAFC] hover:text-[#0B67FF] transition-colors">
          Dashboard
        </a>
        <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
          Projects
        </a>
        <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
          Analytics
        </a>
        <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
          Settings
        </a>
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

        {/* Profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#0B67FF]/10 transition-colors"
        >
          <img
            src="https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTAwOTUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="hidden md:block text-[#F8FAFC]">Sarah M.</span>
          <ChevronDown size={16} className="text-[#6B7280]" />
        </motion.button>
      </div>
    </div>
  );
}
