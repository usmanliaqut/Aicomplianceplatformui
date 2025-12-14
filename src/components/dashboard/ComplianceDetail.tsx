import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  FileText,
  ShieldAlert,
  BookOpen,
  Image as ImageIcon,
  ExternalLink,
  RefreshCw,
  Download,
  Loader2,
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import CodePdf from "../../North Bay Village, FL Unified Land Development Code.pdf";
import { useComplianceRecord } from "../../hooks/useCompliance";
import {
  ComplianceDecision,
  downloadComplianceResult,
  updateComplianceDecision,
} from "../../api/compliance";

interface ComplianceDetailProps {
  complianceId: number;
  projectId: number;
  onBack: () => void;
}

export function ComplianceDetail({ complianceId, projectId, onBack }: ComplianceDetailProps) {
  const { data, isLoading, error } = useComplianceRecord(complianceId);
  const [activeTab, setActiveTab] = useState<string>("detailed");
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [isSavingDecision, setIsSavingDecision] = useState<boolean>(false);
  const [showDecisionMenu, setShowDecisionMenu] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "compliant":
        return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
      case "non-compliant":
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
      default:
        return "text-[#94A3B8] bg-[#94A3B8]/10 border-[#94A3B8]/20";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20";
      case "medium":
        return "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20";
      case "low":
        return "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20";
      default:
        return "text-[#6B7280] bg-[#6B7280]/10 border-[#6B7280]/20";
    }
  };

  const result = data?.compliance_result;
  const sectionsForPages = (result?.relevant_sections || []) as any[];

  const referencedPages = useMemo(() => {
    const rawPages = (sectionsForPages || [])
      .map((s: any) => s?.page)
      .filter((p: any) => typeof p === "number" && !isNaN(p)) as number[];

    const pages = Array.from(new Set(rawPages)) as number[];

    return pages.sort((a, b) => a - b);
  }, [sectionsForPages]);

  const initialPage = referencedPages.length > 0 ? referencedPages[0] : 1;

  useEffect(() => {
    if (currentPage === null && initialPage) {
      setCurrentPage(initialPage);
    }
  }, [currentPage, initialPage]);

  const codePdfUrl = CodePdf as string | undefined;

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-[#6B7280]">Loading compliance details...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#F8FAFC] mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Compliance List
        </button>
        <p className="text-red-400">Failed to load compliance details</p>
      </div>
    );
  }

  const {
    approved,
    score,
    confidence,
    summary,
    violations = [],
    text_based_findings = [],
    image_based_findings = [],
    detailed_analysis,
    recommendations = [],
    relevant_sections = [],
  } = result;

  const currentDecision: ComplianceDecision | undefined =
    (data as any)?.compliance_decision;

  const getDecisionLabelAndColor = (decisionValue: ComplianceDecision | undefined) => {
    switch (decisionValue) {
      case "APPROVED":
        return { label: "Approved", color: "text-[#10B981]" };
      case "REJECTED":
        return { label: "Rejected", color: "text-[#EF4444]" };
      case "CONDITIONAL_APPROVAL":
        return { label: "Conditional Approval", color: "text-[#F59E0B]" };
      case "NEEDS_REVISION":
        return { label: "Needs Revision", color: "text-[#F97316]" };
      case "PENDING":
      default:
        return { label: "Pending Decision", color: "text-[#94A3B8]" };
    }
  };

  const tabs = [
    { id: "detailed", label: "Detailed Analysis", icon: Info },
    { id: "findings", label: "Findings", icon: FileText },
    {
      id: "violations",
      label: "Violations",
      icon: ShieldAlert,
      count: violations.length,
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: CheckCircle2,
      count: recommendations.length,
    },
    { id: "codes", label: "Code References", icon: BookOpen },
    { id: "document", label: "Code Document", icon: BookOpen },
  ];

  const decisionDisplay = getDecisionLabelAndColor(currentDecision);

  const handleDownloadReport = async () => {
    try {
      const blob = await downloadComplianceResult(projectId, complianceId);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `compliance-${projectId}-${complianceId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to download compliance JSON", e);
    }
  };

  const handleDecisionChange = async (decision: ComplianceDecision) => {
    if (isSavingDecision) return;
    try {
      setIsSavingDecision(true);
      await updateComplianceDecision(projectId, complianceId, decision);
      await queryClient.invalidateQueries({
        queryKey: ["complianceRecord", complianceId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["compliances", projectId],
      });
    } catch (e) {
      console.error("Failed to update compliance decision", e);
    } finally {
      setIsSavingDecision(false);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#6B7280] hover:text-[#F8FAFC] mb-4 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Compliance List
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-7xl mx-auto pb-24"
      >
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="flex flex-col items-center justify-center p-6 bg-[#1E293B] border border-[#334155]">
            <h3 className="text-[#94A3B8] text-sm font-medium mb-2">
              Overall Score
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#F8FAFC]">{score}</span>
              <span className="text-sm text-[#6B7280] mb-1">/ 100</span>
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center p-6 bg-[#1E293B] border border-[#334155]">
            <h3 className="text-[#94A3B8] text-sm font-medium mb-2">
              Confidence Level
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#F8FAFC]">
                {confidence}%
              </span>
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center p-6 bg-[#1E293B] border border-[#334155]">
            <h3 className="text-[#94A3B8] text-sm font-medium mb-2">Status</h3>
            <div
              className={`text-xl font-bold ${decisionDisplay.color}`}
            >
              {decisionDisplay.label}
            </div>
          </Card>
        </div>

        {/* Executive Summary Section */}
        <Card className="mb-8 bg-[#1E293B] border border-[#334155] p-6">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-3">
            Executive Summary
          </h3>
          <p className="text-[#94A3B8] leading-relaxed">{summary}</p>
        </Card>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto border-b border-[#334155] mb-6 gap-1 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#0B67FF]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-[#0B67FF]/10" : "bg-[#334155]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B67FF]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "detailed" && (
            <div className="space-y-6 animate-in fade-in duration-300 slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 bg-[#1E293B] border border-[#334155]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#0B67FF]/10 rounded-lg">
                      <FileText className="text-[#0B67FF]" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#F8FAFC]">
                      Text Analysis
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">
                        Summary
                      </span>
                      <p className="text-[#94A3B8] mt-1">
                        {detailed_analysis?.text_analysis_summary}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-[#334155]">
                      <span className="text-sm text-[#94A3B8]">
                        Compliance Categories
                      </span>
                      <span className="text-sm font-medium text-[#F8FAFC]">
                        4 Analyzed
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-[#1E293B] border border-[#334155]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#06B6D4]/10 rounded-lg">
                      <ImageIcon className="text-[#06B6D4]" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#F8FAFC]">
                      Image Analysis
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">
                        Summary
                      </span>
                      <p className="text-[#94A3B8] mt-1">
                        {detailed_analysis?.image_analysis_summary}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-[#334155]">
                      <span className="text-sm text-[#94A3B8]">
                        Diagram Aspects
                      </span>
                      <span className="text-sm font-medium text-[#F8FAFC]">
                        2 Reviewed
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "findings" && (
            <div className="space-y-4 animate-in fade-in duration-300 slide-in-from-bottom-2">
              {text_based_findings.map((item: any, index: number) => (
                <Card
                  key={`text-${index}`}
                  className="p-5 bg-[#1E293B] border border-[#334155]"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#0B67FF] font-medium">
                          {item.category}
                        </span>
                        <span className="text-[#6B7280]">•</span>
                        <span className="text-[#94A3B8] text-sm">
                          Text Analysis
                        </span>
                      </div>
                      <p className="text-[#F8FAFC]">{item.finding}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                      {item.impact && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                            item.impact
                          )}`}
                        >
                          {item.impact} Impact
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {image_based_findings.map((item: any, index: number) => (
                <Card
                  key={`image-${index}`}
                  className="p-5 bg-[#1E293B] border border-[#334155]"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#06B6D4] font-medium">
                          {item.diagram_type}
                        </span>
                        <span className="text-[#6B7280]">•</span>
                        <span className="text-[#94A3B8] text-sm">
                          Image Analysis
                        </span>
                      </div>
                      <p className="text-[#F8FAFC]">{item.finding}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.visual_match
                        )}`}
                      >
                        {item.visual_match}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "violations" && (
            <div className="space-y-4 animate-in fade-in duration-300 slide-in-from-bottom-2">
              {violations.length === 0 && (
                <div className="text-center py-12 text-[#6B7280]">
                  <CheckCircle2
                    size={48}
                    className="mx-auto mb-3 opacity-50 text-[#10B981]"
                  />
                  <p>No violations found. Good job!</p>
                </div>
              )}
              {violations.map((violation: any, index: number) => (
                <Card
                  key={index}
                  className="p-5 bg-[#1E293B] border-l-4 border-l-[#EF4444] border-t border-r border-b border-[#334155]"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[#EF4444] font-medium flex items-center gap-1">
                          <AlertTriangle size={16} />
                          Violation
                        </span>
                        <span className="text-[#6B7280]">•</span>
                        <span className="text-[#94A3B8] text-sm font-mono">
                          Code: {violation.code_section}
                        </span>
                      </div>
                      <p className="text-[#F8FAFC] font-medium">
                        {violation.description}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getSeverityColor(
                        violation.severity
                      )}`}
                    >
                      {violation.severity} Severity
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="space-y-4 animate-in fade-in duration-300 slide-in-from-bottom-2">
              {recommendations.length === 0 && (
                <div className="text-center py-12 text-[#6B7280]">
                  <Info size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No specific recommendations available.</p>
                </div>
              )}
              {recommendations.map((rec: any, index: number) => (
                <Card
                  key={index}
                  className="p-5 bg-[#1E293B] border border-[#334155]"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(
                        rec.priority
                      )}`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs text-[#6B7280]">{rec.timeline}</span>
                  </div>
                  <p className="text-[#F8FAFC]">{rec.recommendation}</p>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "codes" && (
            <div className="space-y-3 animate-in fade-in duration-300 slide-in-from-bottom-2">
              {relevant_sections.map((section: any, index: number) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-[#1E293B] border border-[#334155] hover:border-[#0B67FF]/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-[#0B67FF]" />
                      <span className="text-sm font-medium text-[#F8FAFC]">
                        {section.content_type?.replace("_", " ").toUpperCase() ||
                          "CODE SECTION"}
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7280] px-2 py-1 bg-[#0F172A] rounded">
                      Page {section.page}
                    </span>
                  </div>

                  {section.content && (
                    <p className="text-sm text-[#94A3B8] line-clamp-3 mb-3 font-mono bg-[#0F172A] p-3 rounded border border-[#334155]">
                      {section.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 bg-[#0F172A] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10B981]"
                          style={{
                            width: `${(section.similarity_score || 0) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#10B981]">
                        {Math.round((section.similarity_score || 0) * 100)}% Match
                      </span>
                    </div>
                    {section.type === "image" && (
                      <Button
                        variant="ghost"
                        className="text-[#0B67FF] h-auto py-1 px-2"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        View Image
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "document" && (
            <Card className="bg-[#020617] border border-[#334155] overflow-hidden flex flex-col animate-in fade-in duration-300 slide-in-from-bottom-2">
              {/* Toolbar */}
              <div className="px-4 py-3 border-b border-[#1E293B] bg-gradient-to-r from-[#020617] via-[#020617] to-[#020617]/60 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#E5E7EB]">
                  <BookOpen size={16} className="text-[#0B67FF]" />
                  <div className="flex flex-col">
                    <span className="font-medium">North Bay Village, FL Unified Land Development Code</span>
                    <span className="text-[11px] text-[#6B7280]">
                      View the official code pages referenced in this review.
                    </span>
                  </div>
                  {currentPage && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-[#0B67FF]/15 text-[11px] text-[#E5F0FF] border border-[#0B67FF]/40 whitespace-nowrap">
                      Page {currentPage}
                    </span>
                  )}
                </div>

                {!codePdfUrl && (
                  <span className="text-[11px] text-[#F97316] font-medium">
                    PDF file is missing. Ensure the code document PDF is available.
                  </span>
                )}
              </div>

              {/* Page chips row */}
              <div className="px-4 py-2 border-b border-[#1E293B] bg-[#020617]">
                {referencedPages.length === 0 ? (
                  <p className="text-xs text-[#6B7280]">
                    No specific pages were referenced for this compliance result.
                  </p>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#6B7280] whitespace-nowrap">
                      Referenced pages:
                    </span>
                    <div className="flex-1 overflow-x-auto no-scrollbar">
                      <div className="flex gap-2">
                        {referencedPages.map((page) => {
                          const isActive = currentPage === page;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors whitespace-nowrap ${
                                isActive
                                  ? "bg-[#0B67FF]/20 border-[#0B67FF] text-[#E5F0FF] shadow-sm shadow-[#0B67FF]/40"
                                  : "bg-[#020617] border-[#1E293B] text-[#9CA3AF] hover:border-[#0B67FF]/70 hover:text-[#E5E7EB]"
                              }`}
                            >
                              Page {page}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Open in new tab section */}
              <div className="px-4 py-4 bg-[#020617] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs sm:text-sm text-[#9CA3AF] max-w-xl">
                  {codePdfUrl ? (
                    <p>
                      Use the referenced pages above, then open the official PDF in a
                      new browser tab for a full-screen reading experience.
                    </p>
                  ) : (
                    <p className="text-[#F97316]">
                      Unable to locate the code document PDF. Please ensure the file
                      is present in the project and correctly imported.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <Button
                    className="bg-[#0B67FF] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!codePdfUrl || !currentPage}
                    onClick={() => {
                      if (!codePdfUrl || !currentPage) return;
                      const url = `${codePdfUrl}#page=${currentPage}`;
                      window.open(url, "_blank");
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>
                      {currentPage
                        ? `Open Document at Page ${currentPage}`
                        : "Open Document"}
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Action Bar */}
        <div className="mt-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-3">
            {/* Decision summary row */}
            <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-2">
                <span className="uppercase tracking-wide text-[11px] text-[#6B7280]">
                  Decision
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#020617] border border-[#1E293B] text-[11px]">
                  <span className={decisionDisplay.color.replace("text-", "bg-") + "/40 w-2 h-2 rounded-full"} />
                  <span className="text-[#E5E7EB]">{decisionDisplay.label}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <Button
                className="w-full md:w-auto bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155]"
                onClick={handleDownloadReport}
              >
                <Download size={18} className="mr-2" />
                Download Report
              </Button>

              <div className="relative w-full md:w-auto">
                <Button
                  className="w-full md:w-auto bg-[#020617] hover:bg-[#0B1120] text-[#E5E7EB] border border-[#1E293B] flex items-center justify-center gap-2"
                  disabled={isSavingDecision}
                  onClick={() => setShowDecisionMenu((prev) => !prev)}
                >
                  {isSavingDecision ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  <span className="text-xs md:text-sm font-medium">
                    {isSavingDecision ? "Saving decision..." : "Change decision"}
                  </span>
                </Button>

                {showDecisionMenu && !isSavingDecision && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg border border-[#1E293B] bg-[#020617] shadow-xl z-20">
                    <div className="px-3 py-2 border-b border-[#1E293B]">
                      <p className="text-xs text-[#9CA3AF]">Select a decision</p>
                    </div>
                    <div className="py-1">
                      {[
                        { value: "APPROVED" as ComplianceDecision, label: "Approved", icon: CheckCircle2, color: "text-[#10B981]" },
                        { value: "CONDITIONAL_APPROVAL" as ComplianceDecision, label: "Conditional Approval", icon: AlertTriangle, color: "text-[#FBBF24]" },
                        { value: "NEEDS_REVISION" as ComplianceDecision, label: "Needs Revision", icon: AlertTriangle, color: "text-[#F97316]" },
                        { value: "REJECTED" as ComplianceDecision, label: "Rejected", icon: AlertTriangle, color: "text-[#EF4444]" },
                        { value: "PENDING" as ComplianceDecision, label: "Mark as Pending", icon: RefreshCw, color: "text-[#9CA3AF]" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-[#E5E7EB] hover:bg-[#0B1120] ${
                            option.value === currentDecision ? "bg-[#0B1120]" : ""
                          }`}
                          onClick={async () => {
                            setShowDecisionMenu(false);
                            await handleDecisionChange(option.value);
                          }}
                        >
                          <option.icon size={16} className={option.color} />
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
