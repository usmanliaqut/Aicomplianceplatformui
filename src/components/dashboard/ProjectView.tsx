import { motion } from "motion/react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Upload,
  Plus,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useState } from "react";
import { ComplianceCreate } from "./ComplianceCreate";

interface ProjectViewProps {
  project: any;
  onBack: () => void;
}

export function ProjectView({ project, onBack }: ProjectViewProps) {
  console.log("project", project);
  const [activeTab, setActiveTab] = useState<
    "overview" | "compliance" | "documents"
  >("overview");
  const [showComplianceCreate, setShowComplianceCreate] = useState(false);
  const [compliances, setCompliances] = useState([
    {
      id: 1,
      fileName: "Floor_Plans_v1.pdf",
      uploadDate: "2024-01-15",
      status: "approved",
      score: 98,
      checks: [
        {
          name: "Zoning Compliance",
          status: "passed",
          message: "Meets all local zoning requirements",
        },
        {
          name: "Building Height",
          status: "passed",
          message: "Within 150ft height limit",
        },
        {
          name: "Fire Safety",
          status: "passed",
          message: "All fire exits compliant",
        },
        {
          name: "ADA Accessibility",
          status: "warning",
          message: "Requires additional ramp",
        },
      ],
    },
    {
      id: 2,
      fileName: "Site_Survey_Updated.dwg",
      uploadDate: "2024-01-14",
      status: "pending",
      score: 67,
      checks: [],
    },
  ]);

  const handleCreateCompliance = (complianceData: any) => {
    const newCompliance = {
      id: compliances.length + 1,
      fileName: complianceData.file.name,
      uploadDate: new Date().toISOString().split("T")[0],
      status: "pending",
      score: 0,
      checks: [],
    };

    setCompliances([newCompliance, ...compliances]);
    setShowComplianceCreate(false);
  };

  const statusConfig = {
    approved: { color: "#10B981", label: "Approved", bg: "#10B981" },
    pending: { color: "#F97316", label: "Pending Review", bg: "#F97316" },
    rejected: { color: "#EF4444", label: "Needs Revision", bg: "#EF4444" },
  };

  const status = statusConfig[project.status as keyof typeof statusConfig];

  const documents = [
    {
      name: "Architectural Plans.pdf",
      size: "12.5 MB",
      uploadedDate: "2024-01-15",
      type: "PDF",
    },
    {
      name: "Site Survey.dwg",
      size: "8.2 MB",
      uploadedDate: "2024-01-14",
      type: "DWG",
    },
    {
      name: "Floor Plans.pdf",
      size: "15.8 MB",
      uploadedDate: "2024-01-14",
      type: "PDF",
    },
    {
      name: "Elevation Drawings.dxf",
      size: "6.4 MB",
      uploadedDate: "2024-01-13",
      type: "DXF",
    },
  ];

  const timeline = [
    {
      date: "2024-01-15",
      event: "Project submitted for review",
      user: "John Smith",
    },
    { date: "2024-01-14", event: "Documents uploaded", user: "John Smith" },
    {
      date: "2024-01-14",
      event: "Initial compliance check completed",
      user: "System",
    },
    { date: "2024-01-13", event: "Project created", user: "John Smith" },
  ];

  // Show compliance creation flow if active
  if (showComplianceCreate) {
    return (
      <ComplianceCreate
        projectId={project.project_id}
        projectName={project.applicant_name}
        onBack={() => setShowComplianceCreate(false)}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 text-[#6B7280] hover:text-[#F8FAFC] mb-6 transition-colors"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft size={20} />
        Back to Projects
      </motion.button>

      {/* Header */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Main Info */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-[#0B67FF]/20 rounded-lg flex items-center justify-center">
                  <Building2 size={24} className="text-[#0B67FF]" />
                </div>
                <div>
                  <h2>{project.applicant_name}</h2>
                  <div className="flex items-center gap-2 text-[#6B7280] mt-1">
                    <MapPin size={16} />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>
              <div
                className="inline-block px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: `${status.bg}20`,
                  color: status.color,
                }}
              >
                {status.label}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#0B67FF]/20">
            <div>
              <p className="text-[#6B7280] mb-1">Project Type</p>
              <p className="text-[#F8FAFC]">{project.building_type}</p>
            </div>
            <div>
              <p className="text-[#6B7280] mb-1">Start Date</p>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#0B67FF]" />
                <span className="text-[#F8FAFC]">
                  {project.submission_date}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Tabs */}
        <Card>
          <div className="flex gap-1 border-b border-[#0B67FF]/20">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 transition-all ${
                activeTab === "overview"
                  ? "text-[#0B67FF] border-b-2 border-[#0B67FF]"
                  : "text-[#6B7280] hover:text-[#F8FAFC]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`px-6 py-3 transition-all flex items-center gap-2 ${
                activeTab === "compliance"
                  ? "text-[#0B67FF] border-b-2 border-[#0B67FF]"
                  : "text-[#6B7280] hover:text-[#F8FAFC]"
              }`}
            >
              <CheckCircle2 size={18} />
              Compliance
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-6 py-3 transition-all flex items-center gap-2 ${
                activeTab === "documents"
                  ? "text-[#0B67FF] border-b-2 border-[#0B67FF]"
                  : "text-[#6B7280] hover:text-[#F8FAFC]"
              }`}
            >
              <FileText size={18} />
              Documents
            </button>
          </div>
        </Card>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Project Description */}
            <Card>
              <h3 className="mb-4">Project Description</h3>
              <p className="text-[#6B7280] leading-relaxed">
                A modern office complex featuring sustainable design principles
                and state-of-the-art amenities. The project includes a 12-story
                main building with ground-floor retail spaces, underground
                parking, and landscaped outdoor areas. The design emphasizes
                energy efficiency, natural lighting, and employee wellness with
                integrated green spaces and recreational facilities.
              </p>
            </Card>
          </>
        )}

        {/* Compliance Tab */}
        {activeTab === "compliance" && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3>Compliance Checks ({compliances.length})</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComplianceCreate(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0B67FF] hover:bg-[#0B67FF]/90 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>New Compliance</span>
              </motion.button>
            </div>
            <div className="space-y-4">
              {compliances.map((compliance, index) => {
                const complianceStatus =
                  statusConfig[compliance.status as keyof typeof statusConfig];
                return (
                  <motion.div
                    key={compliance.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-[#0F172A] rounded-lg border border-[#0B67FF]/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-[#06B6D4]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={20} className="text-[#06B6D4]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#F8FAFC] mb-1">
                            {compliance.fileName}
                          </p>
                          <p className="text-[#6B7280]">
                            Uploaded {compliance.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div
                        className="px-3 py-1 rounded-lg text-white flex-shrink-0"
                        style={{ backgroundColor: complianceStatus.bg }}
                      >
                        <small>{complianceStatus.label}</small>
                      </div>
                    </div>

                    {/* Compliance Score */}
                    {compliance.status !== "pending" && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <small className="text-[#6B7280]">
                            Compliance Score
                          </small>
                          <small style={{ color: complianceStatus.color }}>
                            {compliance.score}%
                          </small>
                        </div>
                        <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: complianceStatus.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${compliance.score}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Individual Checks */}
                    {compliance.checks.length > 0 && (
                      <div className="space-y-2 mt-3 pt-3 border-t border-[#0B67FF]/10">
                        {compliance.checks.map((check, checkIndex) => {
                          const isPassed = check.status === "passed";
                          return (
                            <div
                              key={checkIndex}
                              className="flex items-start gap-2"
                            >
                              {isPassed ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-[#10B981] mt-0.5 flex-shrink-0"
                                />
                              ) : (
                                <AlertTriangle
                                  size={16}
                                  className="text-[#F97316] mt-0.5 flex-shrink-0"
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-[#F8FAFC]">{check.name}</p>
                                <p className="text-[#6B7280]">
                                  {check.message}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {compliance.status === "pending" && (
                      <div className="flex items-center gap-2 text-[#F97316] mt-3 pt-3 border-t border-[#0B67FF]/10">
                        <Clock size={16} />
                        <small>Processing compliance check...</small>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {compliances.length === 0 && (
                <div className="text-center py-8 text-[#6B7280]">
                  <FileText size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No compliance checks yet</p>
                  <p>Click &quot;New Compliance&quot; to upload a document</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3>Project Documents</h3>
              <Button variant="secondary" size="sm">
                <Upload size={16} className="mr-2" />
                Upload New
              </Button>
            </div>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg border border-[#0B67FF]/10 hover:border-[#0B67FF]/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0B67FF]/20 rounded-lg flex items-center justify-center">
                      <FileText size={20} className="text-[#0B67FF]" />
                    </div>
                    <div>
                      <p className="text-[#F8FAFC]">{doc.name}</p>
                      <p className="text-[#6B7280]">
                        {doc.size} • Uploaded {doc.uploadedDate}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download size={16} />
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
