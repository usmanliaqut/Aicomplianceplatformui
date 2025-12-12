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

// Hook for running a single compliance check (upload flow)
export function useCompliance() {
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);

  const runCompliance = async (payload: CreateCompliancePayload) => {
    try {
      setLoading(true);
      setError(null);
      setProgress(0);
      setStatusText("Starting compliance check...");

      // Start the async task
      const task = await createCompliance(payload);
      setStatusText(task.message || "Compliance check started");

      // Derive full WebSocket URL
      const baseURL = (api.defaults.baseURL || "") as string;
      let wsUrl = task.websocket_url;
      if (!wsUrl.startsWith("ws")) {
        if (baseURL.startsWith("https")) {
          wsUrl = baseURL.replace(/^https/, "wss") + wsUrl;
        } else if (baseURL.startsWith("http")) {
          wsUrl = baseURL.replace(/^http/, "ws") + wsUrl;
        } else {
          wsUrl = wsUrl;
        }
      }

      setStatusText("Connecting to results stream...");

      await new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setStatusText("Waiting for compliance results...");
          setProgress(25);
        };

        ws.onerror = () => {
          setError("WebSocket connection error while fetching compliance results.");
          setStatusText("Connection error");
          setLoading(false);
          reject(new Error("WebSocket error"));
        };

        ws.onclose = () => {
          // If we closed without having set a result or error, just resolve
          resolve();
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);

            // Ignore messages for other tasks
            if (msg.task_id && msg.task_id !== task.task_id) {
              return;
            }

            if (msg.status) {
              setStatusText(msg.status);
              if (msg.status === "processing") {
                setProgress(60);
              }
            }

            // Assume the server sends the final structured result in msg.result
            if (msg.result) {
              setResult(msg.result as ComplianceResult);
              setProgress(100);
              setLoading(false);
              setStatusText("Compliance analysis completed.");
              ws.close();
              resolve();
            }
          } catch (e: any) {
            setError("Failed to parse compliance result from server.");
            setStatusText("Error while reading results");
            setLoading(false);
            ws.close();
            reject(e);
          }
        };
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return { runCompliance, result, loading, progress, error, statusText };
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
