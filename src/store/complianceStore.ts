import { create } from "zustand";
import { ComplianceResult } from "../types/compliance";

interface ComplianceState {
  lastResult: ComplianceResult | null;
  setLastResult: (result: ComplianceResult) => void;
}

export const useComplianceStore = create<ComplianceState>((set) => ({
  lastResult: null,
  setLastResult: (result) => set({ lastResult: result }),
}));
