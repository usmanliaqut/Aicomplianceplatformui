import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const recentActivity = [
  { id: 1, action: 'Downtown Office Complex approved', time: '2 hours ago', status: 'success' },
  { id: 2, action: 'Riverside Residential Tower submitted', time: '5 hours ago', status: 'info' },
  { id: 3, action: 'Tech Campus Expansion needs revision', time: '1 day ago', status: 'warning' },
  { id: 4, action: 'Medical Center Renovation approved', time: '2 days ago', status: 'success' }
];

export function Overview() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="mb-2">Dashboard Overview</h2>
        <p className="text-[#6B7280]">Welcome back! Here&apos;s what&apos;s happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Projects', value: '24', change: '+12%', icon: TrendingUp, color: '#0B67FF' },
          { label: 'Avg. Compliance', value: '87%', change: '+5%', icon: CheckCircle, color: '#10B981' },
          { label: 'Processing Time', value: '45s', change: '-23%', icon: Clock, color: '#06B6D4' },
          { label: 'Active Issues', value: '8', change: '-15%', icon: AlertTriangle, color: '#F97316' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hoverable={false}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[#6B7280]">{stat.label}</p>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon size={20} style={{ color: stat.color }} />
                  </div>
                </div>
                <h2 className="mb-2">{stat.value}</h2>
                <p className="text-[#10B981]">{stat.change} from last month</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card hoverable={false}>
            <h3 className="mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 pb-4 border-b border-[#0B67FF]/10 last:border-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-[#10B981]' :
                      activity.status === 'warning' ? 'bg-[#F97316]' :
                      'bg-[#06B6D4]'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-[#F8FAFC]">{activity.action}</p>
                    <small className="text-[#6B7280]">{activity.time}</small>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card hoverable={false}>
            <h3 className="mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                className="w-full p-4 bg-[#0B67FF]/10 hover:bg-[#0B67FF]/20 rounded-lg text-left transition-colors border border-[#0B67FF]/20"
              >
                <p className="text-[#0B67FF]">+ Upload New Plans</p>
                <small className="text-[#6B7280]">Start a new compliance check</small>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                className="w-full p-4 bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 rounded-lg text-left transition-colors border border-[#06B6D4]/20"
              >
                <p className="text-[#06B6D4]">View All Reports</p>
                <small className="text-[#6B7280]">Access compliance reports</small>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                className="w-full p-4 bg-[#F97316]/10 hover:bg-[#F97316]/20 rounded-lg text-left transition-colors border border-[#F97316]/20"
              >
                <p className="text-[#F97316]">Manage Cities</p>
                <small className="text-[#6B7280]">Update supported jurisdictions</small>
              </motion.button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
