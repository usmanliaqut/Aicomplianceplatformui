import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc as string;

interface CodePdfViewerProps {
  fileUrl: string;
  pageNumber: number;
}

export function CodePdfViewer({ fileUrl, pageNumber }: CodePdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  const safePageNumber = (() => {
    if (!pageNumber) return 1;
    if (!numPages) return pageNumber;
    return Math.min(pageNumber, numPages);
  })();

  return (
    <div className="w-full h-[75vh] lg:h-[82vh] bg-[#020617] rounded-lg border border-[#1F2937] shadow-[0_10px_40px_rgba(15,23,42,0.8)] overflow-auto flex items-start justify-center">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
        loading={<div className="p-4 text-[#9CA3AF] text-sm">Loading code document...</div>}
        error={<div className="p-4 text-red-400 text-sm">Failed to load PDF.</div>}
        className="flex justify-center w-full py-4"
      >
        <Page
          pageNumber={safePageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={900}
        />
      </Document>
    </div>
  );
}
