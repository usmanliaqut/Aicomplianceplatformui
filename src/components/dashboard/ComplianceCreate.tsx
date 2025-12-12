import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  X,
  FileText,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Hash,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Info,
  ImageIcon,
  ExternalLink,
  Download,
  RefreshCw,
} from "lucide-react";
import { Card } from "../ui/Card";
import { useCompliance } from "../../hooks/useCompliance";
import { Button } from "../ui/Button";
import codeBookPdf from "../../North Bay Village, FL Unified Land Development Code.pdf";

interface ComplianceCreateProps {
  projectId: string;
  projectName: string;
  onBack: () => void;
}

interface ComplianceResult {
  compliance_id: number;
  project_id: number;
  compliance_result: {
    decision: "approved" | "rejected";
    overview: {
      total_violations: number;
      compliance_score: number;
      critical_issues: number;
    };
    violations: Array<{
      code: string;
      description: string;
      severity: "critical" | "major" | "minor";
      location: string;
      found: string;
      required: string;
      fix: string;
      code_reference: string;
    }>;
    compliant_items: Array<{
      code: string;
      description: string;
      location: string;
    }>;
  };
  revision_date: string;
}

type FlowStep = "upload" | "analyzing" | "results";

export function ComplianceCreate({
  projectId,
  projectName,
  onBack,
}: ComplianceCreateProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("upload");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [useCache, setUseCache] = useState(false);
  const [cacheTtl, setCacheTtl] = useState(3600);

  console.log("projectId", projectId);

  const { runCompliance, result, loading, progress, error, statusText } =
    useCompliance();

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    setCurrentStep("analyzing");

    try {
      // Only support the first file (API expects a single 'file')
      const payload = {
        projectId: Number(projectId),
        file: selectedFiles[0],
        use_cache: useCache,
        cache_ttl: cacheTtl,
      };

      await runCompliance(payload);

      setCurrentStep("results");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F172A] px-8 py-6">
      {/* Header, Step Indicator, Content */}

      <div className="flex items-center gap-4">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-[#0B67FF]/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-[#0B67FF]" />
        </motion.button>
        <div>
          <h2 className="text-[#F8FAFC]">New Compliance Check </h2>
          <p className="text-[#6B7280]">{projectName}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mt-6">
        <StepIndicator
          step={1}
          label="Upload Plans"
          active={currentStep === "upload"}
          completed={currentStep !== "upload"}
        />
        <div className="flex-1 h-[2px] bg-[#0B67FF]/20">
          <motion.div
            className="h-full bg-[#0B67FF]"
            initial={{ width: 0 }}
            animate={{ width: currentStep !== "upload" ? "100%" : "0%" }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <StepIndicator
          step={2}
          label="AI Analysis"
          active={currentStep === "analyzing"}
          completed={currentStep === "results"}
        />
        <div className="flex-1 h-[2px] bg-[#0B67FF]/20">
          <motion.div
            className="h-full bg-[#0B67FF]"
            initial={{ width: 0 }}
            animate={{ width: currentStep === "results" ? "100%" : "0%" }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <StepIndicator
          step={3}
          label="Results"
          active={currentStep === "results"}
          completed={false}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {currentStep === "upload" && (
          <UploadStep
            selectedFiles={selectedFiles}
            useCache={useCache}
            cacheTtl={cacheTtl}
            onFileChange={(e) =>
              setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])
            }
            onRemoveFile={(i) =>
              setSelectedFiles((prev) => prev.filter((_, index) => index !== i))
            }
            onUseCacheChange={setUseCache}
            onCacheTtlChange={setCacheTtl}
            onSubmit={handleSubmit}
          />
        )}

        {currentStep === "analyzing" && (
          <AnalyzingStep progress={progress} statusText={statusText || undefined} />
        )}

        {currentStep === "results" && result && <ResultsStep result={result} />}

        {error && (
          <p className="text-red-500 mt-4 text-center">Error: {error}</p>
        )}
      </div>
    </div>
  );
}

// Step Indicator Component
function StepIndicator({
  step,
  label,
  active,
  completed,
}: {
  step: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          active
            ? "bg-[#0B67FF] text-white"
            : completed
            ? "bg-[#10B981] text-white"
            : "bg-[#1E293B] text-[#6B7280] border border-[#0B67FF]/20"
        }`}
        whileHover={{ scale: 1.05 }}
      >
        {completed ? <CheckCircle size={20} /> : step}
      </motion.div>
      <span
        className={`${
          active
            ? "text-[#0B67FF]"
            : completed
            ? "text-[#10B981]"
            : "text-[#6B7280]"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// Upload Step Component
function UploadStep({
  selectedFiles,
  useCache,
  cacheTtl,
  onFileChange,
  onRemoveFile,
  onUseCacheChange,
  onCacheTtlChange,
  onSubmit,
}: {
  selectedFiles: File[];
  useCache: boolean;
  cacheTtl: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  onUseCacheChange: (value: boolean) => void;
  onCacheTtlChange: (value: number) => void;
  onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <Card className="p-8">
        <h3 className="mb-6">Upload Architectural Plans</h3>

        {/* File Upload Area */}
        <div className="mb-6">
          <label className="block mb-3 text-[#F8FAFC]">Building Plans *</label>
          <label className="border-2 border-dashed border-[#0B67FF]/30 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#0B67FF]/50 transition-colors bg-[#0B67FF]/5">
            <Upload size={48} className="text-[#0B67FF] mb-4" />
            <p className="text-[#F8FAFC] mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-[#6B7280]">
              Supports PDF, DWG, DXF files up to 50MB
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.dwg,.dxf"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mb-6 space-y-2">
            <label className="block text-[#F8FAFC] mb-2">
              Selected Files ({selectedFiles.length})
            </label>
            {selectedFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-[#1E293B] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-[#0B67FF]" />
                  <div>
                    <p className="text-[#F8FAFC]">{file.name}</p>
                    <p className="text-[#6B7280]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="p-1 hover:bg-[#0B67FF]/10 rounded transition-colors"
                >
                  <X size={18} className="text-[#6B7280]" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Cache Options */}
        <div className="mb-6 p-4 bg-[#1E293B] rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              id="useCache"
              checked={useCache}
              onChange={(e) => onUseCacheChange(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="useCache" className="text-[#F8FAFC] cursor-pointer">
              Enable result caching (faster re-analysis)
            </label>
          </div>

          {useCache && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <label className="block mb-2 text-[#F8FAFC]">
                Cache Duration (seconds)
              </label>
              <input
                type="number"
                value={cacheTtl}
                onChange={(e) => onCacheTtlChange(parseInt(e.target.value))}
                className="w-full p-3 bg-[#0F172A] border border-[#0B67FF]/20 rounded-lg text-[#F8FAFC] focus:outline-none focus:border-[#0B67FF]"
                min="60"
                max="86400"
              />
            </motion.div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={onSubmit}
          disabled={selectedFiles.length === 0}
          whileHover={{ scale: selectedFiles.length > 0 ? 1.02 : 1 }}
          whileTap={{ scale: selectedFiles.length > 0 ? 0.98 : 1 }}
          className={`w-full py-3 rounded-lg transition-all ${
            selectedFiles.length > 0
              ? "bg-[#0B67FF] hover:bg-[#0952CC] text-white"
              : "bg-[#1E293B] text-[#6B7280] cursor-not-allowed"
          }`}
        >
          Start AI Compliance Check
        </motion.button>
      </Card>
    </motion.div>
  );
}

// Analyzing Step Component
function AnalyzingStep({
  progress,
  statusText,
}: {
  progress: number;
  statusText?: string;
}) {
  const statusMessages = [
    "Uploading architectural plans...",
    "Processing CAD files...",
    "Extracting building dimensions...",
    "Analyzing compliance requirements...",
    "Cross-referencing building codes...",
    "Checking structural integrity...",
    "Validating safety standards...",
    "Generating compliance report...",
    "Finalizing results...",
  ];

  const currentMessage =
    statusText ||
    statusMessages[
      Math.min(Math.floor(progress / 11.1), statusMessages.length - 1)
    ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto mt-20"
    >
      <Card className="p-12 text-center">
        {/* Animated Loader */}
        <motion.div
          className="inline-block mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={64} className="text-[#0B67FF]" />
        </motion.div>

        <h3 className="mb-4">AI Analysis in Progress</h3>
        <p className="text-[#6B7280] mb-8">{currentMessage}</p>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#1E293B] rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0B67FF] to-[#06B6D4]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-[#0B67FF]">{Math.round(progress)}% Complete</p>

        <div className="mt-8 p-4 bg-[#1E293B] rounded-lg">
          <p className="text-[#6B7280]">
            This usually takes 60-90 seconds. Our AI is analyzing your plans
            against building codes and regulations.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

// Results Step Component
// Results Step Component

function ResultsStep({ result }: { result: any }) {
  const { compliance_result, compliance_id, revision_date, project_id } =
    result || {};

  // Support two shapes:
  // 1) { compliance_result: { approved, score, ... } }
  // 2) { approved, score, ... } directly (as sent by the WebSocket)
  const effectiveResult = compliance_result || result;

  if (!effectiveResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-2xl mx-auto mt-20"
      >
        <Card className="p-8 text-center bg-[#1E293B] border border-[#334155]">
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">
            Compliance results are not available
          </h3>
          <p className="text-[#94A3B8]">
            The server response did not include detailed compliance data yet.
            Please try running the check again or check the backend response
            format.
          </p>
        </Card>
      </motion.div>
    );
  }

  const {
    approved,
    score,
    confidence,
    summary,
    violations,
    text_based_findings,
    image_based_findings,
    detailed_analysis,
    recommendations,
    relevant_sections,
  } = effectiveResult;

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

  // Use the tab id so 'Detailed Analysis' is active by default
  const [activeTab, setActiveTab] = useState("detailed");

  // For Code References tab: track which section is selected
  const [selectedSection, setSelectedSection] = useState<any | null>(
    relevant_sections && relevant_sections.length > 0
      ? relevant_sections[0]
      : null
  );

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto pb-24 "
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
          <div className="space-y-6 animate-in fade-in duration-300 slide-in-from-bottom-2">
            {/* Text-based findings */}
            {text_based_findings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
                  <FileText size={16} className="text-[#0B67FF]" />
                  Text Findings
                </h4>
                {text_based_findings.map((item: any, index: number) => {
                  const statusLabel = item.status || "Unknown";
                  const impactLabel = item.impact || "Medium";

                  return (
                    <Card
                      key={`text-${index}`}
                      className="p-5 bg-[#020617] border border-[#1E293B]"
                    >
                      <div className="flex gap-4">
                        {/* Colored rail */}
                        <div
                          className={`w-1 rounded-full mt-1 ${getSeverityColor(
                            impactLabel
                          )}`}
                        />

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#F8FAFC]">
                                {item.category}
                              </span>
                              <span className="text-xs text-[#6B7280]">
                                Text analysis
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  statusLabel
                                )}`}
                              >
                                {statusLabel}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                                  impactLabel
                                )}`}
                              >
                                {impactLabel} impact
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-[#E5E7EB] leading-relaxed">
                            {item.finding}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Image-based findings */}
            {image_based_findings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
                  <ImageIcon size={16} className="text-[#06B6D4]" />
                  Image Findings
                </h4>
                {image_based_findings.map((item: any, index: number) => {
                  const visual = item.visual_match || "Unknown";

                  return (
                    <Card
                      key={`image-${index}`}
                      className="p-5 bg-[#020617] border border-[#1E293B]"
                    >
                      <div className="flex gap-4">
                        {/* Colored rail based on visual match */}
                        <div
                          className={`w-1 rounded-full mt-1 ${getStatusColor(
                            visual
                          )}`}
                        />

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#F8FAFC]">
                                {item.diagram_type}
                              </span>
                              <span className="text-xs text-[#6B7280]">
                                Image analysis
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  visual
                                )}`}
                              >
                                {visual}
                              </span>
                              {item.status && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium text-[#94A3B8] bg-[#1E293B] border border-[#334155]">
                                  {item.status}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-[#E5E7EB] leading-relaxed">
                            {item.finding}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
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
                        <AlertCircle size={16} />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300 slide-in-from-bottom-2">
            {/* Left: list of references */}
            <div className="space-y-3">
              {relevant_sections.map((section: any, index: number) => {
                const isSelected = selectedSection === section;
                const similarity = Math.round(
                  (section.similarity_score || 0) * 100
                );

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedSection(section)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors bg-[#0F172A] hover:border-[#0B67FF]/60 focus:outline-none focus:ring-2 focus:ring-[#0B67FF]/60 ${
                      isSelected ? "border-[#0B67FF]" : "border-[#334155]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen size={16} className="text-[#0B67FF]" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                          {section.content_type?.replace("_", " ").toUpperCase() ||
                            "REGULATION TEXT"}
                        </span>
                      </div>
                      <span className="text-xs text-[#9CA3AF] px-2 py-1 bg-[#020617] rounded">
                        Page {section.page}
                      </span>
                    </div>

                    {section.content && (
                      <p className="text-sm text-[#E5E7EB] mb-3 line-clamp-4">
                        {section.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 bg-[#020617] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#10B981]"
                            style={{ width: `${similarity}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-[#10B981]">
                          {similarity}% Match
                        </span>
                      </div>
                      {isSelected && (
                        <span className="text-xs text-[#0B67FF] font-medium">
                          Viewing in book
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: embedded code book viewer */}
            <div className="rounded-lg border border-[#334155] bg-[#020617] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-[#1E293B] flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#F8FAFC]">
                    Code Book Viewer
                  </span>
                  {selectedSection && (
                    <span className="text-xs text-[#9CA3AF]">
                      Showing page {selectedSection.page}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#6B7280]">Source: Local PDF</span>
              </div>

              <div className="flex-1 min-h-[360px] bg-black/20">
                {selectedSection ? (
                  <iframe
                    title="Code Book"
                    src={`${codeBookPdf}#page=${selectedSection.page}`}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#6B7280] text-sm">
                    Select a reference on the left to view it in the code book.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}

      <div className=" mt-8">
        <div className="  max-w-7xl mx-auto flex items-center justify-between gap-4">
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
  );
}
