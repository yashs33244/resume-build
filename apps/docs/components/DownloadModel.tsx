import React, { useState, useCallback } from "react";
import { Download, X, ArrowLeftCircle } from "lucide-react";
import { useRecoilState } from "recoil";
import { isGeneratingPDFAtom } from "../store/pdfgenerating";
import { resumeTimeAtom } from "../store/expiry";
import { Template1 } from "./Editor/templates/Template1";
import { Template2 } from "./Editor/templates/template2";
import { Template3 } from "./Editor/templates/template3";
import { ResumeProps } from "../types/ResumeProps";
import { useSaveResume } from "../hooks/useSaveResume";

type DownloadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeProps;
  templateId: string;
};

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  templateId,
}) => {
  const [jobDescription, setJobDescription] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] =
    useRecoilState(isGeneratingPDFAtom);
  const [resumeTimes, setResumeTimes] = useRecoilState(resumeTimeAtom);
  const [tailoredResumeData, setTailoredResumeData] =
    useState<ResumeProps | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const { saveResume, isSaving } = useSaveResume();

  const renderTemplate = useCallback(
    (data: ResumeProps) => {
      switch (templateId) {
        case "fresher":
          return <Template1 resumeData={data} id="wrapper" />;
        case "experienced":
          return <Template2 resumeData={data} id="wrapper" />;
        case "designer":
          return <Template3 resumeData={data} id="wrapper" />;
        default:
          return <div>Select a template from the template selection page</div>;
      }
    },
    [templateId],
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const updateResumeTime = useCallback(
    (id: string) => {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      const timeLeft = Math.floor(
        (expirationDate.getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );
      setResumeTimes((prev) => ({ ...prev, [id]: timeLeft }));
    },
    [setResumeTimes],
  );

  const handleDownload = useCallback(
    async (data: ResumeProps) => {
      setIsGeneratingPDF(true);
      try {
        const element = document.getElementById("wrapper");

        if (!element) {
          throw new Error("Resume wrapper not found");
        }

        // Create a deep clone of the element
        const clone = element.cloneNode(true) as HTMLElement;

        // Apply the scale transformation to the clone, not the original element
        clone.style.transform = "scale(1)";

        // Get the HTML content to send, including the styles and the clone's content
        const cssLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/(pages)/select-templates/editor/page.css">`;
        const htmlContent = cssLink + clone.outerHTML;

        // Send the HTML content to the backend
        const response = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ html: htmlContent }),
        });

        if (!response.ok) throw new Error("PDF generation failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "resume.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        updateResumeTime(templateId);
        saveResume(resumeData, templateId);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsGeneratingPDF(false);
      }
    },
    [setIsGeneratingPDF, templateId, updateResumeTime],
  );

  const handleTailor = useCallback(async () => {
    if (!jobDescription) {
      alert("Please enter the job description.");
      return;
    }
    setIsTailoring(true);
    try {
      const response = await fetch("/api/generate/taylor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription, resumeData }),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to tailor resume. Please check your inputs and try again.",
        );
      }

      const tailoredData: ResumeProps = await response.json();

      if (JSON.stringify(tailoredData) === JSON.stringify(resumeData)) {
        throw new Error("Tailored resume is identical to the original.");
      }

      setTailoredResumeData(tailoredData);
      console.log("Tailored resume data:", tailoredData);
      setShowComparison(true);
    } catch (error: any) {
      console.error("Error tailoring resume:", error);
      alert(
        error.message ||
          "An unexpected error occurred while tailoring the resume.",
      );
    } finally {
      setIsTailoring(false);
    }
  }, [jobDescription, resumeData]);

  const handleBackToEdit = useCallback(() => {
    setShowComparison(false);
    setTailoredResumeData(null);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg p-8 max-w-7xl w-full h-5/6 flex flex-col relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {!showComparison ? (
          <div className="flex h-full">
            <div className="flex-1 pr-4 border-r border-gray-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Tailor Resume for a specific job
              </h2>
              <div className="flex flex-col mb-6">
                <textarea
                  placeholder="Paste the job description here to tailor your resume"
                  className="flex-grow border rounded-lg px-4 py-2 text-gray-700 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-2"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                />
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  onClick={handleTailor}
                  disabled={isTailoring}
                >
                  {isTailoring ? "Tailoring..." : "Tailor Resume"}
                </button>
              </div>
            </div>
            <div className="flex-1 pl-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Continue to download
              </h3>
              <div className="space-y-4 py-8">
                <button
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center"
                  onClick={() => handleDownload(resumeData)}
                  disabled={isGeneratingPDF}
                >
                  <Download className="w-5 h-5 mr-3" />
                  <span className="flex-grow text-left">
                    {isGeneratingPDF
                      ? "Generating PDF..."
                      : "Great for sending personally"}
                  </span>
                  <span className="text-sm bg-blue-700 px-2 py-1 rounded">
                    {isGeneratingPDF ? "Please wait" : "Download"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <button
                onClick={handleBackToEdit}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeftCircle className="w-5 h-5 mr-2" />
                Back to Edit
              </button>
            </div>
            <div className="flex flex-1 space-x-4 overflow-hidden">
              <div className="w-1/2 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Original Resume
                </h3>
                <div className="flex-1 overflow-auto border rounded-lg p-4">
                  {renderTemplate(resumeData)}
                </div>
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => handleDownload(resumeData)}
                >
                  Download Original
                </button>
              </div>
              <div className="w-1/2 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Tailored Resume
                </h3>
                <div className="flex-1 overflow-auto border rounded-lg p-4">
                  {tailoredResumeData && renderTemplate(tailoredResumeData)}
                </div>
                <button
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={() =>
                    tailoredResumeData && handleDownload(tailoredResumeData)
                  }
                  disabled={!tailoredResumeData}
                >
                  Download Tailored
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadModal;
