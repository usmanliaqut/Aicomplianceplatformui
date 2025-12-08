import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';
import { Button } from './ui/Button';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#1E293B]/80 backdrop-blur-lg border-b border-[#0B67FF]/20"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          whileHover={{ scale: 1.05 }}
        >
          <Building2 size={32} className="text-[#0B67FF]" />
          <span className="text-xl text-[#F8FAFC]">ComplianceAI</span>
        </motion.button>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('landing');
            }}
            className={`transition-colors ${
              currentPage === 'landing'
                ? 'text-[#0B67FF]'
                : 'text-[#6B7280] hover:text-[#F8FAFC]'
            }`}
          >
            Home
          </a>
          <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
            Features
          </a>
          <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
            Pricing
          </a>
          <a href="#" className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
            About
          </a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => onNavigate('login')}
          >
            Login
          </Button>
          <Button
            variant="primary"
            onClick={() => onNavigate('register')}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
