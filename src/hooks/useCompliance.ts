import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createCompliance,
  CreateCompliancePayload,
  getCompliancesByProject,
  getComplianceRecord,
} from "../api/compliance";
import { ComplianceResult } from "../types/compliance";

// Hook for running a single compliance check (upload flow)
export function useCompliance() {
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const runCompliance = async (payload: CreateCompliancePayload) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);

      // Simulate progress (optional)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      const data = await createCompliance(payload);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { runCompliance, result, loading, progress, error };
}

// Hook for listing compliances for a project (similar to useProjects)
export function useCompliances(projectId: number) {
  const query = useQuery<ComplianceResult[]>({
    queryKey: ["compliances", projectId],
    queryFn: () => getCompliancesByProject(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}

// Hook for a single compliance detail record
export function useComplianceRecord(complianceId: number | null) {
  return useQuery({
    queryKey: ["complianceRecord", complianceId],
    queryFn: () => getComplianceRecord(complianceId as number),
    enabled: !!complianceId,
  });
}
