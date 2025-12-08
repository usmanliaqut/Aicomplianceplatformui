import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-[#0B67FF]/10 via-[#06B6D4]/10 to-[#F97316]/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-[#0B67FF]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#06B6D4]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0B67FF]/20 border border-[#0B67FF]/30 rounded-full mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={16} className="text-[#0B67FF]" />
            <small className="text-[#0B67FF]">Start Your Free Trial Today</small>
          </motion.div>

          <h2 className="mb-6">
            Ready to Transform Your Architectural Workflow?
          </h2>
          
          <p className="text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Join thousands of architects who have accelerated their compliance process with AI. 
            Get started in less than 60 seconds—no credit card required.
          </p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button variant="primary" onClick={() => navigate('/register')}>
              Get Started Free <ArrowRight size={20} className="inline ml-2" />
            </Button>
            <Button variant="secondary">Schedule a Demo</Button>
          </motion.div>

          <motion.p
            className="text-[#6B7280] mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <small>Free 14-day trial • No credit card required • Cancel anytime</small>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
