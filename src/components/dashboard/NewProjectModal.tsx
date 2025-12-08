import { motion } from "motion/react";
import { X, Building2, MapPin, User } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useProjects } from "../../hooks/useProjects";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectFormValues {
  applicant_name: string;
  name: string;
  city: string;
  location: string;
  building_type: string;
}

const CITIES = ["North Bay Village", "Miami", "Miami Beach"];

const BUILDING_TYPES = [
  "Residential - Single Family",
  "Residential - Multi Family",
  "Commercial - Office",
  "Commercial - Retail",
  "Commercial - Restaurant",
  "Mixed Use",
  "Industrial",
  "Institutional",
];

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const { createProjectMutation } = useProjects();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>();

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    createProjectMutation.mutate(
      {
        applicant_name: data.applicant_name,
        location: data.location,
        building_type: data.building_type,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully!");
          reset();
          onClose();
        },
        onError: () => {
          toast.error("Failed to create project");
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#1E293B] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#0B67FF]/20"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#1E293B] border-b border-[#0B67FF]/20 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B67FF]/20 rounded-lg flex items-center justify-center">
                <Building2 size={20} className="text-[#0B67FF]" />
              </div>
              <div>
                <h3>Create New Project</h3>
                <p className="text-[#6B7280]">
                  Add a new architectural project
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-[#6B7280] hover:text-[#F8FAFC] transition-colors"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Applicant Name */}
            <div>
              <label
                htmlFor="applicant_name"
                className="block text-[#F8FAFC] mb-2"
              >
                Applicant Name <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  id="applicant_name"
                  {...register("applicant_name", { required: true })}
                  placeholder="e.g. John Smith"
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] placeholder:text-[#6B7280] focus:outline-none focus:border-[#0B67FF] transition-colors"
                />
              </div>
              {errors.applicant_name && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-[#F8FAFC] mb-2">
                Project Name <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <Building2
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  id="name"
                  {...register("name", { required: true })}
                  placeholder="e.g. Downtown Office Complex"
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] placeholder:text-[#6B7280] focus:outline-none focus:border-[#0B67FF] transition-colors"
                />
              </div>
              {errors.name && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-[#F8FAFC] mb-2">
                City <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <MapPin
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <select
                  id="city"
                  {...register("city", { required: true })}
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#0B67FF] transition-colors appearance-none"
                >
                  <option value="">Select city</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              {errors.city && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-[#F8FAFC] mb-2">
                Specific Location <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <MapPin
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  id="location"
                  {...register("location", { required: true })}
                  placeholder="e.g. 123 Ocean Drive"
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] placeholder:text-[#6B7280] focus:outline-none focus:border-[#0B67FF] transition-colors"
                />
              </div>
              {errors.location && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            {/* Building Type */}
            <div>
              <label
                htmlFor="building_type"
                className="block text-[#F8FAFC] mb-2"
              >
                Building Type <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <Building2
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <select
                  id="building_type"
                  {...register("building_type", { required: true })}
                  className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-[#0B67FF]/30 rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#0B67FF] transition-colors appearance-none"
                >
                  <option value="">Select building type</option>
                  {BUILDING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {errors.building_type && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#0B67FF]/20">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 text-[#6B7280] hover:text-[#F8FAFC] transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#0B67FF] hover:bg-[#0952CC] text-white rounded-lg transition-colors"
              >
                Create Project
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
