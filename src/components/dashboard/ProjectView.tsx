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
import { useEffect, useMemo, useRef, useState } from "react";
import { ComplianceCreate } from "./ComplianceCreate";
import { ComplianceDetail } from "./ComplianceDetail";
import { useCompliances } from "../../hooks/useCompliance";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectViewProps {
  project: any;
  onBack: () => void;
}

export function ProjectView({ project, onBack }: ProjectViewProps) {
  console.log("project", project);
  const [showComplianceCreate, setShowComplianceCreate] = useState(false);
  const [selectedComplianceId, setSelectedComplianceId] = useState<number | null>(
    null
  );
  const [activeTasks, setActiveTasks] = useState<
    {
      complianceId?: number;
      taskId: string;
      websocketUrl: string;
    }[]
  >([]);
  const [taskProgressByCompliance, setTaskProgressByCompliance] = useState<
    Record<number, { step?: string; progress?: number }>
  >({});
  const { data, isLoading, error, refetch } = useCompliances(project.project_id);
  const queryClient = useQueryClient();

  // Map API compliance results to the UI shape used below
  const compliances = useMemo(
    () =>
      (data || []).map((item) => {
        const detail = item.compliance_result;

        // Backend sends an 'approved' boolean, not a 'decision' string.
        // Treat records with a defined 'approved' flag as completed.
        let status: "approved" | "rejected" | "pending" = "pending";
        if (typeof detail?.approved === "boolean") {
          status = detail.approved ? "approved" : "rejected";
        }

        return {
          id: item.compliance_id,
          fileName: `Compliance #${item.compliance_id}`,
          uploadDate: item.revision_date?.split("T")[0] || "",
          status,
          // Backend sends `score` at the top level of compliance_result
          score: typeof detail?.score === "number" ? detail.score : 0,
          checks: [] as { name: string; status: string; message: string }[],
        };
      }),
    [data]
  );

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

  const wsMapRef = useRef<Record<string, WebSocket>>({});

  // Listen for updates on active compliance tasks via WebSocket
  useEffect(() => {
    const sockets = wsMapRef.current;

    // Close sockets whose tasks are no longer active
    Object.entries(sockets).forEach(([taskId, ws]) => {
      if (!activeTasks.find((t) => t.taskId === taskId)) {
        try {
          ws.close();
        } catch {}
        delete sockets[taskId];
      }
    });

    // Open sockets for any new active tasks
    activeTasks.forEach((task) => {
      if (sockets[task.taskId]) return; // already open

      const ws = new WebSocket(task.websocketUrl);
      sockets[task.taskId] = ws;

      ws.onopen = () => {
        console.log("WebSocket connected for task", task.taskId);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.task_id && msg.task_id !== task.taskId) {
            return;
          }

          const complianceId =
            msg.compliance_id ?? task.complianceId ?? undefined;

          if (msg.event === "progress" && complianceId) {
            console.log("WS progress", msg);
            setTaskProgressByCompliance((prev) => ({
              ...prev,
              [complianceId]: {
                step: msg.step,
                progress: msg.progress,
              },
            }));
          }

          if (msg.event === "completed" || msg.status === "completed") {
            queryClient.invalidateQueries({
              queryKey: ["compliances", project.project_id],
            });

            if (complianceId) {
              setTaskProgressByCompliance((prev) => {
                const next = { ...prev };
                delete next[complianceId];
                return next;
              });
            }

            setActiveTasks((prev) =>
              prev.filter((t) => t.taskId !== task.taskId)
            );

            try {
              ws.close();
            } catch {}
            delete sockets[task.taskId];
          }
        } catch (e) {
          console.error("Failed to parse WebSocket message", e);
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket error", e);
        try {
          ws.close();
        } catch {}
        delete sockets[task.taskId];
      };
    });

    return () => {
      Object.values(sockets).forEach((ws) => {
        try {
          ws.close();
        } catch {}
      });
      wsMapRef.current = {};
    };
  }, [activeTasks, project.project_id, queryClient]);

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
        onBack={() => {
          setShowComplianceCreate(false);
          // Refresh compliances when returning from the create screen
          refetch();
        }}
        onTaskStarted={(task) => {
          setActiveTasks((prev) => [
            ...prev,
            {
              complianceId: task.complianceId,
              taskId: task.taskId,
              websocketUrl: task.websocketUrl,
            },
          ]);
          setShowComplianceCreate(false);
          // As soon as the backend starts the task and (ideally) creates a pending record,
          // refresh the compliances list so the new pending item appears.
          refetch();
        }}
      />
    );
  }

  // Show compliance detail page when a compliance is selected
  if (selectedComplianceId !== null) {
    return (
      <ComplianceDetail
        complianceId={selectedComplianceId}
        projectId={project.project_id}
        onBack={() => setSelectedComplianceId(null)}
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

      {/* Main Content: Compliance only */}
      <div className="space-y-6">
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
          {isLoading && (
            <div className="text-center py-8 text-[#6B7280]">
              <Clock size={24} className="mx-auto mb-2" />
              <p>Loading compliance checks...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="text-center py-8 text-red-400">
              Failed to load compliance checks
            </div>
          )}
          {!isLoading && !error && (
            <div className="space-y-4">
              {compliances.map((compliance, index) => {
                const complianceStatus =
                  statusConfig[compliance.status as keyof typeof statusConfig];
                const isPending = compliance.status === "pending";
                const progressForThis =
                  taskProgressByCompliance[compliance.id as number];
                return (
                  <motion.div
                    key={compliance.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 bg-[#0F172A] rounded-lg border border-[#0B67FF]/10 ${
                      isPending
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer hover:border-[#0B67FF]/40"
                    }`}
                    onClick={() => {
                      if (!isPending) {
                        setSelectedComplianceId(compliance.id);
                      }
                    }}
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
                          console.log("check",check)
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
                        <small>
                          {progressForThis?.step || "Processing compliance check..."}
                          {typeof progressForThis?.progress === "number"
                            ? ` (${progressForThis.progress}%)`
                            : ""}
                        </small>
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
          )}
          </Card>
      </div>
    </div>
  );
}
