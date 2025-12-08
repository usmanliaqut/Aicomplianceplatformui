import { create } from "zustand";
import { Project } from "../types/project";

interface ProjectState {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
}

const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),
}));

export default useProjectStore;
