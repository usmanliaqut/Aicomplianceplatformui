import { motion } from 'motion/react';
import { Building2, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useState } from 'react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard on login
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#0F172A] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0B67FF]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#06B6D4]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-[#1E293B] rounded-2xl p-8 shadow-2xl shadow-[#0B67FF]/10 border border-[#0B67FF]/20">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-[#0B67FF]/20 rounded-2xl mb-4"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Building2 size={32} className="text-[#0B67FF]" />
            </motion.div>
            <h2 className="mb-2">Welcome Back</h2>
            <p className="text-[#6B7280]">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-[#F8FAFC] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] placeholder:text-[#6B7280] focus:outline-none focus:border-[#0B67FF] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-[#F8FAFC] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] placeholder:text-[#6B7280] focus:outline-none focus:border-[#0B67FF] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-[#0F172A] border border-[#0B67FF]/30 rounded accent-[#0B67FF]"
                />
                <span className="text-[#6B7280]">Remember me</span>
              </label>
              <a href="#" className="text-[#0B67FF] hover:text-[#0952CC] transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button variant="primary" className="w-full">
              Sign In <ArrowRight size={20} className="inline ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#0B67FF]/20" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-[#1E293B] text-[#6B7280]">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] hover:bg-[#0B67FF]/10 transition-colors"
            >
              Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] hover:bg-[#0B67FF]/10 transition-colors"
            >
              GitHub
            </motion.button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-[#6B7280] mt-6">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[#0B67FF] hover:text-[#0952CC] transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
