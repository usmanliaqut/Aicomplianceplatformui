import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Brain, Globe, Smartphone, Wrench, Edit3 } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your plans instantly, identifying compliance issues with 98% accuracy.',
    color: '#0B67FF'
  },
  {
    icon: Globe,
    title: 'Multi-City Support',
    description: 'Check compliance across 50+ cities and municipalities with continuously updated building codes and regulations.',
    color: '#06B6D4'
  },
  {
    icon: Smartphone,
    title: 'Mobile + Web Platform',
    description: 'Access your projects anywhere, anytime. Full-featured mobile and web applications for maximum flexibility.',
    color: '#F97316'
  },
  {
    icon: Wrench,
    title: 'Auto-Fix Suggestions',
    description: 'Receive intelligent recommendations to fix compliance issues automatically, saving hours of manual work.',
    color: '#10B981'
  },
  {
    icon: Edit3,
    title: 'Redline Editing',
    description: 'Mark up plans with professional redline tools, add annotations, and collaborate with your team in real-time.',
    color: '#EF4444'
  }
];

export function Features() {
  return (
    <section className="py-24 px-4 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">Powerful Features for Modern Architecture</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Everything you need to streamline your architectural compliance workflow, 
            from initial upload to final approval.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon size={28} style={{ color: feature.color }} />
                  </div>
                  <h3 className="mb-3">{feature.title}</h3>
                  <p className="text-[#6B7280]">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
