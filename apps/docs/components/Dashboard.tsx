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

// Import your template components
import { Template1 } from "./Editor/templates/Template1";
import { Template2 } from "./Editor/templates/template2";
import { Template3 } from "./Editor/templates/template3";
import { useResumeState } from "../hooks/useResumeState";
import { resumeTimeAtom } from "../store/expiry";

const Dashboard = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] =
    useRecoilState(isGeneratingPDFAtom);
  const { resumeState, daysLeft, template, resumeData } = useResumeState();
  const [resumeTimes, setResumeTimes] = useRecoilState(resumeTimeAtom);

  const renderTemplate = () => {
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

  function scaleContent() {
    const containers = document.querySelectorAll(".resumeParent");
    containers.forEach((container) => {
      const content = container.querySelector(".wrapper");
      if (container && content) {
        const widthScale = container.clientWidth / content.clientWidth;
        const heightScale = container.clientHeight / content.clientHeight;
        const scale = Math.min(widthScale, heightScale);
        content.style.transform = `scale(${scale})`;
      }
    });
  }

  const handleDownload = useCallback(
    async (event: React.MouseEvent<HTMLDivElement>) => {
      setIsGeneratingPDF(true);
      try {
        // Find the resume wrapper directly from the rendered template
        const realElement = document.querySelector(".resumeParent .wrapper");
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
      } finally {
        setIsGeneratingPDF(false);
      }
    },
    [setIsGeneratingPDF],
  );

  useEffect(() => {
    window.addEventListener("resize", scaleContent);
    scaleContent();
    return () => {
      window.removeEventListener("resize", scaleContent);
    };
  }, [resumeData]);

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
        <div className="first-resume">
          <div className="timer">
            {resumeState == "DOWNLOAD_SUCCESS" && (
              <div className="text-white"> {daysLeft} days left</div>
            )}
          </div>
          <div className="resume-section">
            <div className="resume-preview resumeParent">
              {renderTemplate()}
            </div>
            <div className="action-toolbar">
              <Link href={`/select-templates/editor?template=${template}`}>
                <div className="edit">
                  <CiEdit className="cta-icon" />
                  <div>Edit</div>
                </div>
              </Link>
              <div className="download" onClick={handleDownload}>
                <MdOutlineFileDownload className="cta-icon" />
                <div>Download</div>
              </div>
              <Link href={`/tailored-resume?id=${resumeData.resumeId}`}>
                <div className="tailor">
                  <ImMagicWand className="cta-icon" />
                  <div>Tailor to a Job</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="second-resume">
          <div className="timer expired">Expired</div>
          <div className="resume-section">
            <div className="resume-preview resumeParent">
              {renderTemplate()}
            </div>
            <div className="action-toolbar">
              <div className="renew">
                <VscDebugRestart className="cta-icon" />
                <div>Renew to Edit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
