import { ComplianceResult } from "../types/compliance";
import api from "./api";

export interface CreateCompliancePayload {
  projectId: number;
  use_cache?: boolean;
  cache_ttl?: number;
  file: File; // Only one file (API expects single "file")
}

export const createCompliance = async (
  payload: CreateCompliancePayload
): Promise<ComplianceResult> => {
  const formData = new FormData();
  formData.append("file", payload.file); // Must be "file"

  const query = new URLSearchParams({
    use_cache: (payload.use_cache ?? true).toString(),
    cache_ttl: (payload.cache_ttl ?? 3600).toString(),
  });

  const { data } = await api.post<ComplianceResult>(
    `/compliance/check/${payload.projectId}?${query.toString()}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// List compliances for a given project
export const getCompliancesByProject = async (
  projectId: number
): Promise<ComplianceResult[]> => {
  const { data } = await api.get<ComplianceResult[]>(`/compliance/${projectId}`);

  return data;
};

// Get a single compliance record by its ID
export const getComplianceRecord = async (
  complianceId: number
): Promise<any> => {
  const { data } = await api.get(`/compliance/record/${complianceId}`);
  return data;
};
