import { useState } from "react";
import { createCompliance, CreateCompliancePayload } from "../api/compliance";
import { ComplianceResult } from "../types/compliance";

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
