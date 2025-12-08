import { ComplianceResult } from "../types/compliance";
import api from "./api";

export interface CreateCompliancePayload {
  projectId: number;
  use_cache?: boolean;
  cache_ttl?: number;
  files: File[];
}

export const createCompliance = async (
  payload: CreateCompliancePayload
): Promise<ComplianceResult> => {
  const formData = new FormData();
  payload.files.forEach((file) => formData.append("files", file));

  const query = new URLSearchParams({
    use_cache: (payload.use_cache ?? true).toString(),
    cache_ttl: (payload.cache_ttl ?? 3600).toString(),
  });

  const { data } = await api.post<ComplianceResult>(
    `/compliance/${payload.projectId}?${query.toString()}`,
    formData
  );

  return data;
};
