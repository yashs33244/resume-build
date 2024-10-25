"use client";
import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import "./Dashboard.scss";
import { isGeneratingPDFAtom } from "../store/pdfgenerating";
import Image from "next/image";
import Link from "next/link";
import { CiEdit } from "react-icons/ci";
import { MdOutlineFileDownload } from "react-icons/md";
import { ImMagicWand } from "react-icons/im";
import { VscDebugRestart } from "react-icons/vsc";
import { IoAddCircleOutline } from "react-icons/io5";
import { Template1 } from "./Editor/templates/Template1";
import { Template2 } from "./Editor/templates/template2";
import { Template3 } from "./Editor/templates/template3";
import { useResumeState } from "../hooks/useResumeState";
import { resumeTimeAtom } from "../store/expiry";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const Dashboard = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] =
    useRecoilState(isGeneratingPDFAtom);
  const { resumes, isLoading, error } = useResumeState();
  const [resumeTimes, setResumeTimes] = useRecoilState(resumeTimeAtom);
  const router = useRouter();

  const renderTemplate = (template, resumeData) => {
    switch (template) {
      case "fresher":
        return <Template1 resumeData={resumeData} className="wrapper" />;
      case "experienced":
        return <Template2 resumeData={resumeData} className="wrapper" />;
      case "designer":
        return <Template3 resumeData={resumeData} className="wrapper" />;
      default:
        return <div>Select a template from the template selection page</div>;
    }
  };

  useEffect(() => {
    console.log(resumes);
  }, [resumes]);

  // Debounce function to optimize scaling on window resize
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Optimized scaling of content
  function scaleContent() {
    const containers = document.querySelectorAll(".resumeParent");
    containers.forEach((container) => {
      const content = container.querySelector(".wrapper");
      if (container && content) {
        const widthScale =
          container.clientWidth / (content as HTMLElement).clientWidth;
        const heightScale =
          container.clientHeight / (content as HTMLElement).clientHeight;
        const scale = Math.min(widthScale, heightScale);
        (content as HTMLElement).style.transform = `scale(${scale})`;
      }
    });
  }

  const handleDownload = useCallback(
    async (resumeId: string) => {
      setIsGeneratingPDF(true);
      try {
        const realElement = document.querySelector(
          `.resumeParent-${resumeId} .wrapper`,
        );
        if (!realElement) throw new Error("Resume wrapper not found");

        const element = realElement.cloneNode(true) as HTMLElement;
        element.style.transform = "scale(1)"; // Reset scaling for PDF

        const cssLink = `<link rel="stylesheet" href="/_next/static/css/app/(pages)/dashboard/page.css">`;
        const globalCSSLink = `<link rel="stylesheet" href="/_next/static/css/app/layout.css">`;
        const fontLink = `<link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'/>`;
        const htmlContent =
          cssLink + globalCSSLink + fontLink + element.outerHTML;

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
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setIsGeneratingPDF(false);
      }
    },
    [setIsGeneratingPDF],
  );

  // Use debounced scaling to improve performance
  useEffect(() => {
    const handleResize = debounce(scaleContent, 200);
    window.addEventListener("resize", handleResize);
    scaleContent();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [resumes]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <div className="dash-title">My Resumes</div>
        <div className="create-cta">
          <IoAddCircleOutline className="create-icon" />
          <div>
            <Link href={"/select-templates"}>Create New</Link>
          </div>
        </div>
      </div>
      <div className="resume-container">
        {resumes.map((resume, index) => (
          <div
            key={resume.resumeData.resumeId}
            className={`resume-item ${
              index === 0 ? "first-resume" : "second-resume"
            }`}
          >
            <div className="timer">
              {resume.resumeState === "DOWNLOAD_SUCCESS" && (
                <div className="text-white"> {resume.daysLeft} days left</div>
              )}
              {resume.resumeState !== "DOWNLOAD_SUCCESS" && (
                <div className="text-white expired">Expired</div>
              )}
            </div>
            <div className="resume-section">
              <div
                className={`resume-preview resumeParent resumeParent-${resume.resumeData.resumeId}`}
              >
                {renderTemplate(resume.template, resume.resumeData)}
              </div>
              <div className="action-toolbar">
                {resume.resumeState === "DOWNLOAD_SUCCESS" ||
                resume.resumeState === "EDITING" ? (
                  <>
                    <Link
                      href={`/select-templates/editor?template=${resume.resumeData.templateId}`}
                    >
                      <div className="edit">
                        <CiEdit className="cta-icon" />
                        <div>Edit</div>
                      </div>
                    </Link>
                    <div
                      className="download"
                      onClick={() => handleDownload(resume.resumeData.resumeId)}
                    >
                      <MdOutlineFileDownload className="cta-icon" />
                      <div>Download</div>
                    </div>
                    <Link
                      href={`/tailored-resume?id=${resume.resumeData.resumeId}`}
                    >
                      <div className="tailor">
                        <ImMagicWand className="cta-icon" />
                        <div>Tailor to a Job</div>
                      </div>
                    </Link>
                  </>
                ) : (
                  <div className="renew">
                    <VscDebugRestart className="cta-icon" />
                    <div>Renew to Edit</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
