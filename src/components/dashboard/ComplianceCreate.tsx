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
} from "lucide-react";
import { Card } from "../ui/Card";
import { useCompliance } from "../../hooks/useCompliance";

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

  const { runCompliance, result, loading, progress, error } = useCompliance();

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    setCurrentStep("analyzing");

    // Prepare payload
    const formData = new FormData();
    formData.append("projectId", projectId);
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("useCache", JSON.stringify(useCache));
    formData.append("cacheTtl", cacheTtl.toString());

    await runCompliance(formData);

    if (result) {
      setCurrentStep("results");
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F172A]">
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
          <h2 className="text-[#F8FAFC]">New Compliance Check</h2>
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

        {currentStep === "analyzing" && <AnalyzingStep progress={progress} />}

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
function AnalyzingStep({ progress }: { progress: number }) {
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
function ResultsStep({ result }: { result: ComplianceResult }) {
  const { decision, overview, violations, compliant_items } =
    result.compliance_result;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-[#EF4444] bg-[#EF4444]/10";
      case "major":
        return "text-[#F97316] bg-[#F97316]/10";
      case "minor":
        return "text-[#F59E0B] bg-[#F59E0B]/10";
      default:
        return "text-[#6B7280] bg-[#6B7280]/10";
    }
  };

  const handleDownloadReport = () => {
    alert("Download violation report - This will generate a PDF report");
  };

  const handleDownloadCertificate = () => {
    alert(
      "Download compliance certificate - This will generate a certificate PDF"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Decision Banner */}
      <Card
        className={`p-8 mb-8 border-2 ${
          decision === "approved"
            ? "border-[#10B981] bg-[#10B981]/5"
            : "border-[#EF4444] bg-[#EF4444]/5"
        }`}
      >
        <div className="text-center">
          {decision === "approved" ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <CheckCircle
                  size={80}
                  className="text-[#10B981] mx-auto mb-4"
                />
              </motion.div>
              <h2 className="text-[#10B981] mb-2">APPROVED ✓</h2>
              <p className="text-[#6B7280] mb-6">
                Your architectural plans meet all building code requirements.
                Ready to submit to city.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadCertificate}
                className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition-colors"
              >
                Download Compliance Certificate
              </motion.button>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <X size={80} className="text-[#EF4444] mx-auto mb-4" />
              </motion.div>
              <h2 className="text-[#EF4444] mb-2">REJECTED ✕</h2>
              <p className="text-[#6B7280] mb-6">
                Your plans have {overview.total_violations} violation
                {overview.total_violations !== 1 ? "s" : ""} that must be
                corrected. Review the details below and fix each issue.
              </p>
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadReport}
                  className="px-6 py-3 bg-[#0B67FF] hover:bg-[#0952CC] text-white rounded-lg transition-colors"
                >
                  Download Violation Report
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg transition-colors"
                >
                  Re-Upload Corrected Plans
                </motion.button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="text-[#0B67FF] mb-2">
            <CheckCircle size={32} className="mx-auto" />
          </div>
          <h3 className="mb-2">{overview.compliance_score}%</h3>
          <p className="text-[#6B7280]">Compliance Score</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-[#F97316] mb-2">
            <AlertCircle size={32} className="mx-auto" />
          </div>
          <h3 className="mb-2">{overview.total_violations}</h3>
          <p className="text-[#6B7280]">Total Violations</p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-[#EF4444] mb-2">
            <AlertCircle size={32} className="mx-auto" />
          </div>
          <h3 className="mb-2">{overview.critical_issues}</h3>
          <p className="text-[#6B7280]">Critical Issues</p>
        </Card>
      </div>

      {/* Metadata */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Hash size={20} className="text-[#0B67FF]" />
            <div>
              <p className="text-[#6B7280]">Compliance ID</p>
              <p className="text-[#F8FAFC]">{result.compliance_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-[#0B67FF]" />
            <div>
              <p className="text-[#6B7280]">Analysis Date</p>
              <p className="text-[#F8FAFC]">
                {new Date(result.revision_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Violations */}
      {violations.length > 0 && (
        <Card className="p-6 mb-8">
          <h3 className="mb-6 flex items-center gap-2">
            <AlertCircle className="text-[#F97316]" />
            Code Violations ({violations.length})
          </h3>
          <div className="space-y-4">
            {violations.map((violation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 bg-[#1E293B] rounded-lg border-l-4 border-[#EF4444]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 bg-[#0B67FF]/20 text-[#0B67FF] rounded">
                      {violation.code}
                    </span>
                    <span
                      className={`px-3 py-1 rounded ${getSeverityColor(
                        violation.severity
                      )}`}
                    >
                      {violation.severity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h4 className="mb-3 text-[#F8FAFC]">{violation.description}</h4>

                {/* Found vs Required */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-[#EF4444]/10 rounded border border-[#EF4444]/20">
                    <p className="text-[#EF4444] mb-1">
                      <strong>Found:</strong>
                    </p>
                    <p className="text-[#F8FAFC]">{violation.found}</p>
                  </div>
                  <div className="p-3 bg-[#10B981]/10 rounded border border-[#10B981]/20">
                    <p className="text-[#10B981] mb-1">
                      <strong>Required:</strong>
                    </p>
                    <p className="text-[#F8FAFC]">{violation.required}</p>
                  </div>
                </div>

                <p className="text-[#6B7280] mb-3">
                  <strong>Location:</strong> {violation.location}
                </p>

                {/* Fix Recommendation */}
                <div className="p-4 bg-[#0F172A] rounded-lg border-l-2 border-[#06B6D4]">
                  <p className="text-[#06B6D4] mb-2">
                    <strong>How to Fix:</strong>
                  </p>
                  <p className="text-[#F8FAFC] mb-2">{violation.fix}</p>
                  <p className="text-[#6B7280]">
                    <strong>Code Reference:</strong> Section{" "}
                    {violation.code_reference}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Compliant Items */}
      {compliant_items.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-6 flex items-center gap-2">
            <CheckCircle className="text-[#10B981]" />
            Compliant Items ({compliant_items.length})
          </h3>
          <div className="space-y-3">
            {compliant_items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-[#1E293B] rounded-lg border-l-4 border-[#10B981]"
              >
                <div className="flex items-start gap-3">
                  <span className="px-3 py-1 bg-[#0B67FF]/20 text-[#0B67FF] rounded">
                    {item.code}
                  </span>
                  <div className="flex-1">
                    <p className="text-[#F8FAFC] mb-1">{item.description}</p>
                    <p className="text-[#6B7280]">{item.location}</p>
                  </div>
                  <CheckCircle size={20} className="text-[#10B981] mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </motion.div>
  );
}
