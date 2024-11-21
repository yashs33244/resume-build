"use client";
import React, { useCallback, useEffect, useState } from "react";
import { constSelector, useRecoilState } from "recoil";
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
import { ResumeProps } from "../types/ResumeProps";

export async function getServerSideProps() {
  return {
    props: {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },
  };
}

const template_css_map = {
  fresher: "https://utfs.io/f/Clj1dqnLZKkyaWv9BvzoiLk2AQdWuZafvXHeBrEhSKFn7Ngz",
  experienced:
    "https://utfs.io/f/Clj1dqnLZKkyHgL3tfqELCqQuhUwYHrz3lnvt0fTa4y5IgsW",
  designer:
    "https://utfs.io/f/Clj1dqnLZKky41CMBCeRQv1SI8iXB29JT3FDwqKozgGr4Zhu",
};
const TEMPLATE_NAME_MAPPING = {
  fresher: "template1",
  experienced: "template2",
  designer: "template3",
};

const Dashboard = (props: any) => {
  const [isGeneratingPDF, setIsGeneratingPDF] =
    useRecoilState(isGeneratingPDFAtom);
  const { resumes, isLoading, error, setResumes } = useResumeState();
  const router = useRouter();
  const { isPaid } = useUserStatus();
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
    async (resumeId: string, templateId: string) => {
      if (!isPaid) {
        router.push("/select-templates/checkout");
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
        //@ts-ignore
        const templateName =
          TEMPLATE_NAME_MAPPING[
            templateId as keyof typeof TEMPLATE_NAME_MAPPING
          ];
        const cssLink = `<link rel="stylesheet" href="${process.env.NEXT_PUBLIC_BASE_URL}/${templateName}.css">`;

        const fontLink = `<link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'/>`;
        const htmlContent = cssLink + fontLink + element.outerHTML;

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
          if (resume?.resumeData?.resumeId === resumeId) {
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
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          minHeight: "calc(100vh - 100px)",
          maxHeight: "calc(100vh - 100px)",
        }}
      >
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
      {false && (
        <div className="expired-state">
          <MdLock />
          <div className="renew-cta">
            <MdAutorenew />
            <div>Renew</div>
          </div>
        </div>
      )}
      <div className="top-section">
        <div className="dash-title">My Resumes</div>
        <div className="create-cta">
          <IoAddCircleOutline className="create-icon" />
          <div onClick={handleCreateNew}>Create New</div>
        </div>
      </div>
      <div className="resume-container">
        {resumes.map((resume: ResumeProps, index) => (
          <div
            key={resume.resumeId}
            className={`resume-item ${index === 0 ? "first-resume" : "second-resume"}`}
          >
            <div className="timer">
              <TimeAgo timestamp={resume.updatedAt} />
            </div>
            <div className="resume-section">
              <div
                className={`resume-preview resumeParent resumeParent-${resume.resumeId} border-2 ${
                  resume.state === "DOWNLOAD_SUCCESS"
                    ? "border-green-500"
                    : "border-gray-500"
                }`}
              >
                {renderTemplate(resume.templateId, resume)}
              </div>
              <div className="action-toolbar">
                {resume.state === "DOWNLOAD_SUCCESS" ||
                resume.state === "DOWNLOAD_FAILED" ||
                resume.state === "DOWNLOADING" ||
                resume.state === "NOT_STARTED" ||
                resume.state === "EDITING" ? (
                  <>
                    <Link
                      href={`/select-templates/editor?id=${resume.resumeId}`}
                    >
                      <div className="edit" onClick={handleEdit}>
                        <CiEdit className="cta-icon" />
                        <div>Edit</div>
                      </div>
                    </Link>
                    <div
                      className={`download ${downloadingId === resume.resumeId ? "opacity-50" : "cursor-pointer"}`}
                      onClick={() =>
                        downloadingId !== resume.resumeId &&
                        handleDownload(resume.resumeId, resume.templateId)
                      }
                    >
                      {downloadingId === resume.resumeId ? (
                        <Loader className="w-6 h-6 animate-spin" />
                      ) : (
                        <MdOutlineFileDownload className="cta-icon" />
                      )}
                      <div>
                        {downloadingId === resume.resumeId
                          ? "Downloading..."
                          : "Download"}
                      </div>
                    </div>

                    <div
                      className={`tailor ${!isPaid ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() =>
                        isPaid &&
                        router.push(`/tailored-resume?id=${resume.resumeId}`)
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
