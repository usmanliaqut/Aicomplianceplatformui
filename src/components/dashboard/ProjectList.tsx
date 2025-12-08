import { motion } from 'motion/react';
import { Card } from '../ui/Card';
import { MoreVertical, FolderOpen, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { NewProjectModal } from './NewProjectModal';
import { ProjectView } from './ProjectView';

const projects = [
  {
    id: 1,
    name: 'Downtown Office Complex',
    city: 'San Francisco, CA',
    status: 'approved',
    lastUpdated: '2 hours ago',
    progress: 98,
    image: 'https://images.unsplash.com/photo-1616418534243-ab757ff8ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzY1MDQ2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 2,
    name: 'Riverside Residential Tower',
    city: 'Seattle, WA',
    status: 'pending',
    lastUpdated: '5 hours ago',
    progress: 67,
    image: 'https://images.unsplash.com/photo-1616418534243-ab757ff8ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzY1MDQ2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 3,
    name: 'Tech Campus Expansion',
    city: 'Austin, TX',
    status: 'rejected',
    lastUpdated: '1 day ago',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1616418534243-ab757ff8ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzY1MDQ2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 4,
    name: 'Medical Center Renovation',
    city: 'Boston, MA',
    status: 'approved',
    lastUpdated: '2 days ago',
    progress: 92,
    image: 'https://images.unsplash.com/photo-1616418534243-ab757ff8ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzY1MDQ2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 5,
    name: 'Urban Mixed-Use Development',
    city: 'Portland, OR',
    status: 'pending',
    lastUpdated: '3 days ago',
    progress: 78,
    image: 'https://images.unsplash.com/photo-1616418534243-ab757ff8ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzY1MDQ2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 6,
    name: 'Waterfront Hotel Complex',
    city: 'Miami, FL',
    status: 'approved',
    lastUpdated: '1 week ago',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1616418534243-ab757ff8ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzY1MDQ2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

const statusConfig = {
  approved: { color: '#10B981', label: 'Approved', bg: '#10B981' },
  pending: { color: '#F97316', label: 'Pending', bg: '#F97316' },
  rejected: { color: '#EF4444', label: 'Rejected', bg: '#EF4444' }
};

export function ProjectList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState(projects);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleCreateProject = (projectData: any) => {
    // Create new project object with correct API structure
    const newProject = {
      id: projectsList.length + 1,
      name: projectData.applicant_name, // Using applicant_name as display name
      city: projectData.location,
      status: 'pending',
      lastUpdated: 'Just now',
      progress: 0,
      image: 'https://images.unsplash.com/photo-1616418534243-ab757ff8ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBkZXNpZ258ZW58MXx8fHwxNzY1MDQ2OTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      applicant_name: projectData.applicant_name,
      building_type: projectData.building_type
    };
    
    // Add to projects list
    setProjectsList([newProject, ...projectsList]);
    
    // Close modal
    setIsModalOpen(false);
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  // If a project is selected, show the project view
  if (selectedProject) {
    return <ProjectView project={selectedProject} onBack={handleBackToList} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="mb-2">Projects</h2>
          <p className="text-[#6B7280]">Manage and track all your architectural projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#0B67FF] hover:bg-[#0952CC] text-white rounded-lg transition-colors"
        >
          + New Project
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: '24', icon: FolderOpen, color: '#0B67FF' },
          { label: 'Approved', value: '18', icon: TrendingUp, color: '#10B981' },
          { label: 'Pending Review', value: '4', icon: Calendar, color: '#F97316' },
          { label: 'Needs Revision', value: '2', icon: MapPin, color: '#EF4444' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hoverable={false} className="border border-[#0B67FF]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#6B7280] mb-1">{stat.label}</p>
                    <h2 style={{ color: stat.color }}>{stat.value}</h2>
                  </div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsList.map((project, index) => {
          const status = statusConfig[project.status as keyof typeof statusConfig];
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleProjectClick(project)}
              className="cursor-pointer"
            >
              <Card>
                <div className="relative mb-4 rounded-lg overflow-hidden h-40">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-white backdrop-blur-sm"
                    style={{ backgroundColor: `${status.bg}80` }}
                  >
                    <small>{status.label}</small>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <h3 className="flex-1">{project.name}</h3>
                  <button className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[#6B7280] mb-3">
                  <MapPin size={14} />
                  <small>{project.city}</small>
                </div>

                <div className="flex items-center gap-2 text-[#6B7280] mb-4">
                  <Calendar size={14} />
                  <small>Updated {project.lastUpdated}</small>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <small className="text-[#6B7280]">Completion</small>
                    <small style={{ color: status.color }}>{project.progress}%</small>
                  </div>
                  <div className="w-full h-2 bg-[#0F172A] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: status.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}