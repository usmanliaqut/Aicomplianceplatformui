// types/project.ts
export interface Project {
  project_id: number; // API id
  applicant_name: string; // API name
  location: string; // API city/location
  building_type: string; // API building type
  submission_date: string; // API submission date

  // UI-specific fields
  status?: "approved" | "pending" | "rejected"; // optional, default 'pending'
  progress?: number; // optional, default 0
  image?: string; // optional placeholder for UI
}
