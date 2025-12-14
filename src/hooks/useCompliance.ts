import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createCompliance,
  CreateCompliancePayload,
  getCompliancesByProject,
  getComplianceRecord,
} from "../api/compliance";
import { ComplianceResult } from "../types/compliance";
import api from "../api/api";

// Hook for starting a single compliance check (upload flow)
// It only starts the async task via REST and returns task metadata
// including a fully resolved WebSocket URL. It does NOT listen on the WebSocket.
export function useCompliance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCompliance = async (payload: CreateCompliancePayload) => {
    try {
      setLoading(true);
      setError(null);

      // Start the async task
      const task = await createCompliance(payload);

      // Derive full WebSocket URL
      const baseURL = (api.defaults.baseURL || "") as string;
      let wsUrl = task.websocket_url;
      if (!wsUrl.startsWith("ws")) {
        if (baseURL.startsWith("https")) {
          wsUrl = baseURL.replace(/^https/, "wss") + wsUrl;
        } else if (baseURL.startsWith("http")) {
          wsUrl = baseURL.replace(/^http/, "ws") + wsUrl;
        }
      }

      setLoading(false);

      return { ...task, websocket_url: wsUrl };
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
      throw err;
    }
  };

  return { runCompliance, loading, error };
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
