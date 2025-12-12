import { motion } from "motion/react";
import { Card } from "../ui/Card";
import {
  MoreVertical,
  FolderOpen,
  MapPin,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { NewProjectModal } from "./NewProjectModal";
import { ProjectView } from "./ProjectView";
import { Project } from "../../types/project";
import { useProjects } from "../../hooks/useProjects";

const statusConfig = {
  approved: { color: "#10B981", label: "Approved", bg: "#10B981" },
  pending: { color: "#F97316", label: "Pending", bg: "#F97316" },
  rejected: { color: "#EF4444", label: "Rejected", bg: "#EF4444" },
};

// Helper function to map API project to UI project
const mapProject = (apiProject: any): Project => ({
  project_id: apiProject.project_id,
  applicant_name: apiProject.applicant_name,
  location: apiProject.location,
  submission_date: apiProject.submission_date,
  status: "pending",
  progress: 0,
  image:
    "https://images.unsplash.com/photo-1616418534243-ab757ff8ce3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
  building_type: apiProject.building_type,
});

export function ProjectList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const { projectsQuery, createProjectMutation } = useProjects();
  const rawProjects = Array.isArray(projectsQuery.data) ? projectsQuery.data : [];
  const projectsList: Project[] = rawProjects.map(mapProject);

  const handleCreateProject = (projectData: any) => {
    createProjectMutation.mutate({
      applicant_name: projectData.applicant_name,
      location: projectData.location,
      building_type: projectData.building_type,
    });
    setIsModalOpen(false);
  };

  const handleProjectClick = (project: any) => setSelectedProject(project);
  const handleBackToList = () => setSelectedProject(null);

  if (projectsQuery.isLoading) {
    return (
      <div className="p-6 text-[#6B7280]">
        Loading projects...
      </div>
    );
  }

  if (projectsQuery.isError) {
    return (
      <div className="p-6 text-red-400">
        Failed to load projects. Please check your API URL or try again later.
      </div>
    );
  }

  if (selectedProject) {
    return <ProjectView project={selectedProject} onBack={handleBackToList} />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="mb-2">Projects</h2>
          <p className="text-[#6B7280]">
            Manage and track all your architectural projects
          </p>
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
          {
            label: "Total Projects",
            value: projectsList.length.toString(),
            icon: FolderOpen,
            color: "#0B67FF",
          },
          {
            label: "Approved",
            value: projectsList
              .filter((p) => p.status === "approved")
              .length.toString(),
            icon: TrendingUp,
            color: "#10B981",
          },
          {
            label: "Pending Review",
            value: projectsList
              .filter((p) => p.status === "pending")
              .length.toString(),
            icon: Calendar,
            color: "#F97316",
          },
          {
            label: "Needs Revision",
            value: projectsList
              .filter((p) => p.status === "rejected")
              .length.toString(),
            icon: MapPin,
            color: "#EF4444",
          },
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
      {projectsList.length === 0 ? (
        <div className="text-center py-20 text-[#6B7280]">
          No projects found. Click “+ New Project” to add your first project.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsList.map((project: Project, index: number) => {
            const status =
              statusConfig[project.status as keyof typeof statusConfig];
            console.log("first", project);

            return (
              <motion.div
                key={project.project_id}
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
                      alt={project.applicant_name}
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
                    <h3 className="flex-1">{project.applicant_name}</h3>
                    <button className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[#6B7280] mb-3">
                    <MapPin size={14} />
                    <small>{project.location}</small>
                  </div>

                  <div className="flex items-center gap-2 text-[#6B7280] mb-4">
                    <Calendar size={14} />
                    <small>Submitted {project.submission_date}</small>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-2">
                      <small className="text-[#6B7280]">Completion</small>
                      <small style={{ color: status.color }}>
                        {project.progress}%
                      </small>
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
      )}

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
