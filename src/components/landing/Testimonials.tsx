import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Senior Architect',
    company: 'Metropolitan Design Group',
    image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTAwOTUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    quote: 'This platform reduced our compliance review time from days to minutes. The AI accuracy is remarkable, and the auto-fix suggestions have saved us countless hours.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Principal',
    company: 'Chen & Associates Architecture',
    image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTAwOTUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    quote: 'The multi-city support is a game-changer for our firm. We work across multiple jurisdictions, and having all building codes in one platform is invaluable.',
    rating: 5
  },
  {
    name: 'Jennifer Rodriguez',
    role: 'Project Manager',
    company: 'Urban Planning Solutions',
    image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NTAwOTUyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    quote: 'Outstanding tool for our workflow. The redline editing feature and real-time collaboration have transformed how our team works together on projects.',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4">Trusted by Architecture Professionals</h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto">
            Join thousands of architects and planners who have transformed their compliance workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F97316" color="#F97316" />
                  ))}
                </div>
                <p className="text-[#F8FAFC] mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[#F8FAFC]">{testimonial.name}</p>
                    <small className="text-[#6B7280]">
                      {testimonial.role} at {testimonial.company}
                    </small>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
