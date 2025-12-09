import { useState } from "react";
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
} from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useComplianceRecord } from "../../hooks/useCompliance";

interface ComplianceDetailProps {
  complianceId: number;
  onBack: () => void;
}

export function ComplianceDetail({ complianceId, onBack }: ComplianceDetailProps) {
  const { data, isLoading, error } = useComplianceRecord(complianceId);
  const [activeTab, setActiveTab] = useState<string>("detailed");

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
  ];

  const decision = approved ? "Approved" : "Conditional Approval";

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
              className={`text-xl font-bold ${
                approved ? "text-[#10B981]" : "text-[#F59E0B]"
              }`}
            >
              {decision}
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
        </div>

        {/* Action Bar */}
        <div className="mt-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-1 md:flex-none items-center gap-3">
              <Button className="flex-1 md:flex-none bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155]">
                <Download size={18} className="mr-2" />
                Download Report
              </Button>
              <Button className="flex-1 md:flex-none bg-[#EF4444] hover:bg-[#DC2626] text-white border-none">
                <RefreshCw size={18} className="mr-2" />
                Request Revisions
              </Button>
              <Button className="flex-1 md:flex-none bg-[#10B981] hover:bg-[#059669] text-white border-none">
                <CheckCircle2 size={18} className="mr-2" />
                Approve Plan
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
