// api/projects.ts
import api from "./api";
import { Project } from "../types/project";

export const getProjects = async (): Promise<Project[]> => {
  const { data } = await api.get("/project/get");
  return data;
};

export const createProject = async (
  project: Partial<Project>
): Promise<Project> => {
  const { data } = await api.post("/project/create", project);
  return data;
};
