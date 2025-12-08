import { motion } from 'motion/react';
import { Upload, Zap, CheckCircle, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Plans',
    description: 'Drag and drop your architectural plans in PDF, DWG, or image format.',
    color: '#0B67FF'
  },
  {
    icon: Zap,
    title: 'AI Analysis',
    description: 'Our AI instantly analyzes your plans against local building codes and regulations.',
    color: '#06B6D4'
  },
  {
    icon: CheckCircle,
    title: 'Review Results',
    description: 'Get detailed compliance reports with highlighted issues and auto-fix suggestions.',
    color: '#10B981'
  },
  {
    icon: Download,
    title: 'Export & Submit',
    description: 'Download corrected plans with redline annotations ready for submission.',
    color: '#F97316'
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-[#0F172A] to-[#1E293B]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">How It Works</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Get your architectural plans compliance-checked in four simple steps. 
            No complex workflows, no steep learning curve.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0B67FF] via-[#06B6D4] to-[#F97316] -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="text-center"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                    style={{ backgroundColor: `${step.color}20`, border: `2px solid ${step.color}` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon size={36} style={{ color: step.color }} />
                    <div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: step.color }}
                    >
                      <span className="text-white">{index + 1}</span>
                    </div>
                  </motion.div>
                  <h3 className="mb-3">{step.title}</h3>
                  <p className="text-[#6B7280]">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
