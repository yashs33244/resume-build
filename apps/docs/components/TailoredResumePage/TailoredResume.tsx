"use client";
import React, { useState, useCallback, useEffect, Suspense } from "react";
import { IoMdDownload } from "react-icons/io";
import { useRecoilState } from "recoil";
import { isGeneratingPDFAtom } from "../../store/pdfgenerating";
import { resumeTimeAtom } from "../../store/expiry";
import { Template1 } from "../Editor/templates/Template1";
import { Template2 } from "../Editor/templates/template2";
import { Template3 } from "../Editor/templates/template3";
import { ResumeProps } from "../../types/ResumeProps";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import styles from "./style.module.scss";
import { Loader } from "lucide-react";
import { useFetchResumeData } from "../../hooks/useFetchResumeData";
import { useSession } from "next-auth/react";
import { initialResumeData } from "../../utils/resumeData";

const TEMPLATE_NAME_MAPPING = {
  fresher: "template1",
  experienced: "template2",
  designer: "template3",
};

const TailoredResumePage: React.FC = () => {
  const searchParams = useSearchParams();
  const { rdata, loading } = useFetchResumeData();

  const resumeId = searchParams.get("id");
  const router = useRouter();
  const resumeData = rdata;

  if (!resumeId) {
    router.push("/");
  }
  const { data: session } = useSession();

  const [jobDescription, setJobDescription] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] =
    useRecoilState(isGeneratingPDFAtom);
  const [isTailored, setIsTailored] = useState(false);
  const [resumeTimes, setResumeTimes] = useRecoilState(resumeTimeAtom);
  const [tailoredResumeData, setTailoredResumeData] =
    useState<ResumeProps>(initialResumeData);
  const [showComparison, setShowComparison] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState<
    "original" | "tailored" | null
  >(null);

  function scaleContent() {
    const containers = document.querySelectorAll(".resumeParent");
    containers.forEach((container) => {
      const content = container.querySelector(".wrapper");
      if (container && content) {
        const widthScale = container.clientWidth / content.clientWidth;
        const heightScale = container.clientHeight / content.clientHeight;
        const scale = Math.min(widthScale, heightScale);
        // @ts-ignore
        content.style.transform = `scale(${scale})`;
      }
    });
  }

  useEffect(() => {
    window.addEventListener("resize", scaleContent);
    scaleContent();
    return () => {
      window.removeEventListener("resize", scaleContent);
    };
  }, []);

  useEffect(() => {
    scaleContent();
  }, [tailoredResumeData, resumeData]);

  const renderTemplate = useCallback(
    (data: ResumeProps) => {
      switch (data?.templateId) {
        case "fresher":
          return (
            <Template1 resumeData={data} className="wrapper" id="wrapper" />
          );
        case "experienced":
          return (
            <Template2 resumeData={data} className="wrapper" id="wrapper" />
          );
        case "designer":
          return (
            <Template3 resumeData={data} className="wrapper" id="wrapper" />
          );
        default:
          return <div>Select a template from the template selection page</div>;
      }
    },
    [resumeData, tailoredResumeData],
  );

  const handleDownload = useCallback(
    async (data: ResumeProps, type: "original" | "tailored") => {
      setDownloadingResume(type);
      setIsGeneratingPDF(true);
      try {
        // Get the specific wrapper for the resume being downloaded
        const wrappers = document.querySelectorAll("#wrapper");
        let targetWrapper: Element | null = null;

        // If we're downloading tailored resume and it exists, use the second wrapper
        if (type === "tailored" && wrappers.length > 1) {
          targetWrapper = wrappers[1] ?? null;
        } else {
          // Otherwise use the first wrapper (original resume)
          targetWrapper = wrappers[0] ?? null;
        }

        if (!targetWrapper) throw new Error("Target wrapper not found");

        // Cast element to HTMLElement after cloning
        const element = targetWrapper.cloneNode(true) as HTMLElement;

        element.style.transform = "scale(1)";
        const resumeId = searchParams.get("id");
        const templateName =
          TEMPLATE_NAME_MAPPING[
            data.templateId as keyof typeof TEMPLATE_NAME_MAPPING
          ];
        const cssLink = `<link rel="stylesheet" href="https://finalcv.com/${templateName}.css">`;
        const layoutcss = `<link rel="stylesheet" href="https://finalcv.com/layout.css">`;
        const fontLink = `<link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'/>`;
        const htmlContent = cssLink + layoutcss + fontLink + element.outerHTML;

        const response = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html: htmlContent,
            resumeId: resumeId,
            isTailored: type === "tailored",
          }),
        });

        if (!response.ok) throw new Error("PDF generation failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        // Add differentiation in filename for tailored resume
        const filename =
          type === "tailored"
            ? `${session?.user?.name?.split(" ")[0] ?? "user"}_tailored_finalCV.pdf`
            : `${session?.user?.name?.split(" ")[0] ?? "user"}_finalCV.pdf`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setDownloadingResume(null);
        setIsGeneratingPDF(false);
      }
    },
    [setIsGeneratingPDF, resumeData, tailoredResumeData, searchParams],
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
        body: JSON.stringify({
          jobDescription,
          resumeData: {
            ...resumeData,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to tailor resume. Please check your inputs and try again.",
        );
      }

      const tailoredData: ResumeProps = await response.json();

      // Ensure other critical sections are not undefined
      tailoredData.experience = tailoredData.experience || [];
      tailoredData.skills = tailoredData.skills || [];
      tailoredData.coreSkills = tailoredData.coreSkills || [];

      if (JSON.stringify(tailoredData) === JSON.stringify(resumeData)) {
        throw new Error("Tailored resume is identical to the original.");
      }

      // Ensure templateId is preserved
      tailoredData.templateId = resumeData?.templateId || "fresher";

      setTailoredResumeData(tailoredData);
      setShowComparison(true);
    } catch (error: any) {
      alert(
        error.message ||
          "An unexpected error occurred while tailoring the resume.",
      );
    } finally {
      setIsTailoring(false);
    }
  }, [jobDescription, resumeData, setTailoredResumeData]);

  const handleBackToEdit = useCallback((newdata: ResumeProps) => {
    setShowComparison(false);
    setTailoredResumeData(newdata);
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <div className={styles.head}>
        {showComparison ? (
          <div className={styles.tailor_p2_head}>
            <div className={styles.tailor_p2_head_section}>
              <div className={styles.tailor_p2_head_section_heading}>
                <p className={styles.tailor_p2_head_section_heading_data}>
                  Original
                </p>
                <button
                  className={
                    styles.tailor_p2_head_section_heading_button_secondary
                  }
                  onClick={() =>
                    resumeData && handleDownload(resumeData, "original")
                  }
                  disabled={downloadingResume === "original"}
                >
                  <IoMdDownload />
                  {downloadingResume === "original" ? "Cooking..." : "Download"}
                </button>
              </div>
              <div
                className={`${styles.tailor_p2_head_section_preview} resumeParent`}
                id="resumeParent"
              >
                {resumeData && renderTemplate(resumeData)}
              </div>
            </div>
            <div className={styles.tailor_p2_head_section}>
              <div className={styles.tailor_p2_head_section_heading}>
                <p className={styles.tailor_p2_head_section_heading_data}>
                  Tailored CV
                </p>
                <button
                  className={styles.tailor_p2_head_section_heading_button}
                  onClick={() =>
                    tailoredResumeData &&
                    handleDownload(tailoredResumeData, "tailored")
                  }
                  disabled={downloadingResume === "tailored"}
                >
                  <IoMdDownload />
                  {downloadingResume === "tailored" ? "Cooking..." : "Download"}
                </button>
              </div>
              <div
                className={`${styles.tailor_p2_head_section_preview} resumeParent`}
                id="resumeParent"
              >
                {tailoredResumeData && renderTemplate(tailoredResumeData)}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={
              loading ? styles.tailor_p1_head_loader : styles.tailor_p1_head
            }
          >
            {loading || resumeData == null ? (
              <>
                <Loader />
              </>
            ) : (
              <>
                <div className={styles.tailor_p1_head_heading}>
                  <p className={styles.tailor_p1_head_heading_data}>
                    Tailor Your CV
                  </p>
                </div>
                <div className={styles.tailor_p1_head_section}>
                  <div
                    className={`${styles.tailor_p1_head_section_preview} resumeParent`}
                    id="resumeParent"
                  >
                    {renderTemplate(resumeData)}
                  </div>
                  <div className={styles.tailor_p1_head_section_user_action}>
                    <p
                      className={
                        styles.tailor_p1_head_section_user_action_heading
                      }
                    >
                      Enter the job description below from a job post
                    </p>
                    <div
                      className={
                        styles.tailor_p1_head_section_user_action_input
                      }
                    >
                      <textarea
                        placeholder="Paste your job description here.."
                        className={
                          styles.tailor_p1_head_section_user_action_input_textarea
                        }
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        rows={10}
                      />
                    </div>
                    <button
                      className={
                        styles.tailor_p1_head_section_user_action_button
                      }
                      onClick={handleTailor}
                      disabled={isTailoring}
                    >
                      {isTailoring ? "Processing..." : "Tailor My CV"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default TailoredResumePage;
