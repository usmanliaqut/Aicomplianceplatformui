import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
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

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B67FF]/10 border border-[#0B67FF]/30 rounded-full mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles size={16} className="text-[#0B67FF]" />
            <small className="text-[#0B67FF]">Powered by Advanced AI</small>
          </motion.div>
          
          <h1 className="mb-6 bg-gradient-to-r from-[#F8FAFC] to-[#06B6D4] bg-clip-text text-transparent">
            AI Architectural Compliance in 60 Seconds
          </h1>
          
          <p className="text-[#6B7280] mb-8 max-w-xl">
            Revolutionize your architectural review process with AI-powered compliance checking. 
            Upload plans, get instant feedback, and ensure your designs meet all regulatory requirements 
            across multiple cities.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" onClick={() => navigate('/register')}>
              Get Started <ArrowRight size={20} className="inline ml-2" />
            </Button>
            <Button variant="ghost">Learn More</Button>
          </div>

          <div className="mt-12 flex gap-8">
            <div>
              <h3 className="text-[#0B67FF]">10,000+</h3>
              <p className="text-[#6B7280]">Plans Reviewed</p>
            </div>
            <div>
              <h3 className="text-[#06B6D4]">50+</h3>
              <p className="text-[#6B7280]">Cities Supported</p>
            </div>
            <div>
              <h3 className="text-[#10B981]">98%</h3>
              <p className="text-[#6B7280]">Accuracy Rate</p>
            </div>
          </div>
        </motion.div>

        {/* Right Content - Hero Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0B67FF]/20">
            <img
              src="https://images.unsplash.com/photo-1742415106160-594d07f6cc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwYmx1ZXByaW50JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY1MDkzMTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Architectural Blueprint"
              className="w-full h-auto"
            />
            {/* AI Overlay Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#0B67FF]/40 to-transparent"
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Floating Analysis Cards */}
            <motion.div
              className="absolute top-8 right-8 bg-[#1E293B]/90 backdrop-blur-sm rounded-lg p-4 shadow-xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                <small className="text-[#10B981]">Analysis Complete</small>
              </div>
              <p className="text-[#F8FAFC]">Compliance: 96%</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
