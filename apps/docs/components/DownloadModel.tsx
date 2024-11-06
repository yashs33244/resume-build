import React, { useState, useCallback, useEffect } from "react";
import { Download, X, ArrowLeftCircle } from "lucide-react";
import { useRecoilState } from "recoil";
import { isGeneratingPDFAtom } from "../store/pdfgenerating";
import { resumeTimeAtom } from "../store/expiry";
import { Template1 } from "./Editor/templates/Template1";
import { Template2 } from "./Editor/templates/template2";
import { Template3 } from "./Editor/templates/template3";
import { ResumeProps } from "../types/ResumeProps";
import { IoMdDownload } from "react-icons/io";
import { Modal } from "react-responsive-modal";
import "./DownloadModel.scss";
import { useSaveResume } from "../hooks/useSaveResume";

type DownloadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeProps;
  templateId: string;
};

type ResumeState = {
  NOT_STARTED: "NOT_STARTED";
  EDITING: "EDITING";
  COMPLETED: "COMPLETED";
  DOWNLOADING: "DOWNLOADING";
  DOWNLOAD_SUCCESS: "DOWNLOAD_SUCCESS";
  DOWNLOAD_FAILED: "DOWNLOAD_FAILED";
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
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.transform = "scale(1)";

        const cssLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/(pages)/select-templates/editor/page.css">`;
        const globalCSSLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/layout.css?v=1728991725867">`;
        const htmlContent = globalCSSLink + cssLink + clone.outerHTML;

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
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsGeneratingPDF(false);
      }
    },
    [setIsGeneratingPDF, templateId, updateResumeTime, resumeData],
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

  useEffect(() => {
    function scaleContent() {
      const container = document.getElementById("resumeParent");
      const content = document.getElementById("wrapper");
      // @ts-ignore
      const widthScale = container?.offsetWidth / content?.offsetWidth;
      // @ts-ignore
      const heightScale = container?.offsetHeight / content?.offsetHeight;
      const scale = Math.min(widthScale, heightScale);
      if (content) {
        content.style.transform = `scale(${scale})`;
      }
    }

    window.addEventListener("resize", scaleContent);
    scaleContent();
  }, []);

  if (!isOpen) return null;

  return (
    <Modal
      classNames={{ modal: "download-modal" }}
      open={isOpen}
      onClose={onClose}
      center
    >
      {!showComparison ? (
        <div className="modal-content">
          <div className="jd-tailor">
            <div className="left">
              <div>
                <div className="heading">Tailor your CV to a specific JD?</div>
                <textarea
                  id="job-description"
                  className="form-input"
                  // type="text"
                  placeholder="Paste the exact job description here.."
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <button
                  onClick={handleTailor}
                  disabled={isTailoring}
                  className="modify-cta"
                >
                  {isTailoring ? "Processing..." : "Customize"}
                </button>
              </div>
            </div>
          </div>
          <div className="download-container">
            <div className="right">
              <div>
                <div className="heading">Continue to Download</div>
                <div
                  className="download-button"
                  onClick={() => handleDownload(resumeData)}
                >
                  <IoMdDownload />
                  <div>Download Final-CV.pdf</div>
                </div>
              </div>
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
    </Modal>
  );
};

export default DownloadModal;
