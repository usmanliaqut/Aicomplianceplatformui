// hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject } from "../api/projects";
import useProjectStore from "../store/useProjectStore";
import { toast } from "react-hot-toast";

export const useProjects = () => {
  const setProjects = useProjectStore((s) => s.setProjects);
  const addProject = useProjectStore((s) => s.addProject);
  const queryClient = useQueryClient();

  // Fetch projects and update store directly in queryFn
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const data = await getProjects();
      setProjects(data); // update store here
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Mutation to create project
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      addProject(newProject);
      toast.success("Project created successfully!");
      queryClient.invalidateQueries(["projects"]);
    },
    onError: () => toast.error("Failed to create project"),
  });

  return { projectsQuery, createProjectMutation };
};
