// types/compliance.ts

export interface Violation {
  code: string;
  description: string;
  severity: "critical" | "major" | "minor";
  location: string;
  found: string;
  required: string;
  fix: string;
  code_reference: string;
}

export interface CompliantItem {
  code: string;
  description: string;
  location: string;
}

export interface ComplianceDetail {
  decision: "approved" | "rejected";
  overview: {
    total_violations: number;
    compliance_score: number;
    critical_issues: number;
  };
  violations: Violation[];
  compliant_items: CompliantItem[];
}

export interface ComplianceResult {
  compliance_id: number;
  project_id: number;
  compliance_result: ComplianceDetail;
  revision_date: string;
}
