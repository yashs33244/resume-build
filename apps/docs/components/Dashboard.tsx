"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import "./Dashboard.scss";
import { isGeneratingPDFAtom } from "../store/pdfgenerating";
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
import TimeAgo from "./TimeAgo";
import { resumeTimeAtom } from "../store/expiry";
import { MdAutorenew } from "react-icons/md";
import { useRouter } from "next/navigation";
import { MdLock } from "react-icons/md";
import { Loader } from "lucide-react";
import { useUserStatus } from "../hooks/useUserStatus";

const Dashboard = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] =
    useRecoilState(isGeneratingPDFAtom);
  const { resumes, isLoading, error, setResumes } = useResumeState();
  const [resumeTimes, setResumeTimes] = useRecoilState(resumeTimeAtom);
  const router = useRouter();
  const { user, isPaid, refetchUser } = useUserStatus();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Redirect first-time users with no resumes
  useEffect(() => {
    if (!isLoading && (!resumes || resumes.length === 0)) {
      router.push("/create-preference");
    }
  }, [isLoading, resumes, router]);

  const renderTemplate = (template: string, resumeData: object) => {
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

  function debounce(func: any, wait: any) {
    let timeout: any;
    return function (...args: any) {
      // @ts-ignore
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

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
      if (!isPaid) {
        alert("Please upgrade to premium to download resumes");
        return;
      }

      setDownloadingId(resumeId);
      setIsGeneratingPDF(true);

      try {
        const realElement = document.querySelector(
          `.resumeParent-${resumeId} .wrapper`,
        );
        if (!realElement) throw new Error("Resume wrapper not found");

        const element = realElement.cloneNode(true) as HTMLElement;
        element.style.transform = "scale(1)";

        const cssLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/(pages)/dashboard/page.css">`;
        const globalCSSLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/layout.css?v=1728991725867">`;
        const fontLink = `<link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'/>`;
        const htmlContent =
          cssLink + globalCSSLink + fontLink + element.outerHTML;

        const response = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            html: htmlContent,
            resumeId: resumeId, // Add resumeId to the request
          }),
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

        // Update local state after successful download
        const updatedResumes = resumes.map((resume: any) => {
          if (resume.resumeData.resumeId === resumeId) {
            return {
              ...resume,
              resumeState: "DOWNLOAD_SUCCESS",
            };
          }
          return resume;
        });
        // You'll need to add a setResumes function to your state management
        setResumes(updatedResumes);
      } catch (error: any) {
        console.error("Error generating PDF:", error);
        alert(error.message || "Failed to generate PDF. Please try again.");
      } finally {
        setIsGeneratingPDF(false);
        setDownloadingId(null);
      }
    },
    [setIsGeneratingPDF, isPaid, resumes],
  );

  const handleCreateNew = () => {
    localStorage.removeItem("resumeData");
    router.push("/create-preference");
  };

  const handleEdit = () => {
    localStorage.removeItem("resumeData");
  };

  useEffect(() => {
    const handleResize = debounce(scaleContent, 200);
    window.addEventListener("resize", handleResize);
    scaleContent();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [resumes]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Don't render dashboard if no resumes
  if (!resumes || resumes.length === 0) {
    return null;
  }

  // Render dashboard only if there are resumes
  return (
    <div className="dashboard-container">
      {false && <div className="expired-state">
          <MdLock />
          <div className="renew-cta">
            <MdAutorenew />
            <div>Renew</div>
          </div>
      </div>}
      <div className="top-section">
        <div className="dash-title">My Resumes</div>
        <div className="create-cta">
          <IoAddCircleOutline className="create-icon" />
          <div onClick={handleCreateNew}>Create New</div>
        </div>
      </div>
      <div className="resume-container">
        {resumes.map((resume: any, index) => (
          <div
            key={resume.resumeData.resumeId}
            className={`resume-item ${
              index === 0 ? "first-resume" : "second-resume"
            }`}
          >
            <div className="timer">
              <TimeAgo timestamp={resume?.updateDate} />
              {/* {resume.resumeState === "DOWNLOAD_SUCCESS" && (
                <div className="text-white"> {resume.daysLeft} days left</div>
              )}
              {resume.resumeState !== "DOWNLOAD_SUCCESS" && (
                <div className="text-white expired">Expired</div>
              )} */}
            </div>
            <div className="resume-section">
              <div
                className={`resume-preview resumeParent resumeParent-${resume.resumeData.resumeId} border-2 ${
                  resume.resumeState === "DOWNLOAD_SUCCESS"
                    ? "border-green-500"
                    : "border-gray-500"
                }`}
              >
                {renderTemplate(resume.template, resume.resumeData)}
              </div>
              <div className="action-toolbar">
                {resume.resumeState === "DOWNLOAD_SUCCESS" ||
                resume.resumeState === "EDITING" ? (
                  <>
                    <Link
                      href={`/select-templates/editor?id=${resume.resumeData.resumeId}`}
                    >
                      <div className="edit" onClick={handleEdit}>
                        <CiEdit className="cta-icon" />
                        <div>Edit</div>
                      </div>
                    </Link>
                    <div
                      className={`download ${!isPaid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() =>
                        isPaid && handleDownload(resume.resumeData.resumeId)
                      }
                    >
                      {downloadingId === resume.resumeData.resumeId ? (
                        <Loader className="w-6 h-6 animate-spin" />
                      ) : (
                        <MdOutlineFileDownload className="cta-icon" />
                      )}
                      <div>
                        {downloadingId === resume.resumeData.resumeId
                          ? "Downloading..."
                          : "Download"}
                      </div>
                    </div>
                    <div
                      className={`tailor ${!isPaid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() =>
                        isPaid &&
                        router.push(
                          `/tailored-resume?id=${resume.resumeData.resumeId}`,
                        )
                      }
                    >
                      <ImMagicWand className="cta-icon" />
                      <div>Tailor to a Job</div>
                    </div>
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
