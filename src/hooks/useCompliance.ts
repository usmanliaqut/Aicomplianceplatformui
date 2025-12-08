// hooks/useCompliance.ts
import { useState } from "react";
import { createCompliance, CreateCompliancePayload } from "../api/compliance";
import { ComplianceResult } from "../types/compliance";

export const useCompliance = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCompliance = async (payload: CreateCompliancePayload) => {
    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      // Call real API
      const res = await createCompliance(payload);
      setResult(res);
      setProgress(100); // immediately mark as completed
    } catch (err: any) {
      setError(err.message || "Failed to create compliance");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return { runCompliance, result, loading, progress, error };
};
