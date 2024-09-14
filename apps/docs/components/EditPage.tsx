"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./EditPage.scss";
import generatePDF, { Resolution, Margin, Options } from "react-to-pdf";
import { Education } from "./Editor/Education";
import { Template1 } from "./Editor/templates/Template1";
import { Skills } from "./Editor/Skills";
import Tips from "./Tips";
import { Language } from "./Editor/Language";
import logo from "./logo.svg";
import { useResumeData } from "../hooks/useResumeData";
import { useActiveSection } from "../hooks/useActiveSection";
import { FaUserTie } from "react-icons/fa";
import { MdWidgets } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa";
import { AiFillProject } from "react-icons/ai";
import { IoMdDownload } from "react-icons/io";
import { FaTools } from "react-icons/fa";
import { CiCircleChevLeft } from "react-icons/ci";
import { PiCaretCircleRightFill } from "react-icons/pi";
import { PiCertificateFill } from "react-icons/pi";
import { FaLanguage } from "react-icons/fa6";
//@ts-ignore
import html2pdf from "html2pdf.js";
// import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Template2 } from "./Editor/templates/template2";
import { Template3 } from "./Editor/templates/template3";

const PersonalInfo = dynamic(
  () => import("./Editor/PersonalInfo").then((mod) => mod.PersonalInfo),
  { ssr: false },
);
const Experience = dynamic(
  () => import("./Editor/Experience").then((mod) => mod.Experience),
  { ssr: false },
);
const Certificate = dynamic(
  () => import("./Editor/Certificate").then((mod) => mod.Certificate),
  { ssr: false },
);
const Project = dynamic(
  () => import("./Editor/Project").then((mod) => mod.Project),
  { ssr: false },
);
const Achievement = dynamic(
  () => import("./Editor/Achievement").then((mod) => mod.Achievement),
  { ssr: false },
);

export default function EditPage() {
  const router = useRouter();
  const [template, setTemplate] = useState<string | null>(null);

  useEffect(() => {
    // Check if the window is available (runs only on client-side)
    if (typeof window !== "undefined") {
      // Try to get the template from the URL first
      const searchParams = new URLSearchParams(window.location.search);
      let templateParam = searchParams.get("template");

      // If no template was selected via URL, try localStorage
      if (!templateParam) {
        const storedTemplate = localStorage.getItem("selectedTemplate");
        templateParam = storedTemplate || "fresher"; // Default to "fresher" if nothing in localStorage
      }

      // Set the template state
      setTemplate(templateParam);

      // Save the selected template to localStorage for future use
      localStorage.setItem("selectedTemplate", templateParam);
    }
  }, []);

  const renderTemplate = () => {
    switch (template) {
      case "fresher":
        return <Template1 resumeData={resumeData} id="wrapper" />;
      case "experienced":
        return <Template2 resumeData={resumeData} id="wrapper" />;
      case "designer":
        return <Template3 resumeData={resumeData} id="wrapper" />;
      default:
        return <div>Select a template from the template selection page</div>;
    }
  };

  const handleRedirect = () => {
    router.push("/dashboard");
  };

  const { resumeData, handleInputChange, handleAddField, handleDeleteField } =
    useResumeData();
  const { activeSection, handleSectionChange, sections, setActiveSection } =
    useActiveSection();

  //   const { toPDF, targetRef } = usePDF({filename: 'finalCV.pdf'});

  const navElements = [
    "Personal Info",
    "Education",
    "Experience",
    "Project",
    "Skills",
    "Certificate",
    "Language",
  ];

  const handleLeftNav = () => {
    const currentIndex = navElements.indexOf(
      activeSection ? activeSection : "",
    );
    if (currentIndex === 0) {
      return;
    }

    const newIndex = currentIndex - 1;
    setActiveSection(navElements[newIndex]);
  };

  const handleRightNav = () => {
    const currentIndex = navElements.indexOf(
      activeSection ? activeSection : "",
    );
    if (currentIndex === navElements.length - 1) {
      return;
    }
    const newIndex = currentIndex + 1;
    setActiveSection(navElements[newIndex]);
  };

  useEffect(() => {
    function scaleContent() {
      const container = document.getElementById("resumeParent");
      const content = document.getElementById("wrapper");
      const widthScale = container?.offsetWidth / content?.offsetWidth;
      const heightScale = container?.offsetHeight / content?.offsetHeight;
      const scale = Math.min(widthScale, heightScale);
      if (content) {
        content.style.transform = `scale(${scale})`;
      }
    }

    window.addEventListener("resize", scaleContent);
    scaleContent();
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById("wrapper");
      if (!element) throw new Error("Resume wrapper not found");

      // Add the CSS link directly in the HTML content
      const cssLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/(pages)/select-templates/editor/page.css">`;
      const htmlContent = cssLink + element.outerHTML;

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
  };

  const getSectionTitle = (props: any) => {
    switch (activeSection) {
      case "Personal Info":
        return "Add Personal Details";
        break;
      case "Education":
        return "Add Education";
        break;
      case "Experience":
        return "Add Work Experience";
        break;
      case "Project":
        return "Add Projects";
        break;
      case "Skills":
        return "Add Skills";
        break;
      case "Certificate":
        return "Add Certificates";
        break;
      case "Language":
        return "Add Languages";
        break;
      default:
        return;
        break;
    }
  };

  const options: Options = {
    filename: "advanced-example.pdf",
    // default is `save`
    method: "save",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.HIGH,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.NONE,
      // default is 'A4'
      format: "A4",
      // default is 'portrait'
      orientation: "portrait",
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: "image/jpeg",
      qualityRatio: 1,
    },
    // customize any value passed to the jsPDF instance and html2canvas
    // function
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true,
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true,
      },
    },
  };

  const openPDF = () => {
    generatePDF(() => document.getElementById("resumeParent"), options);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground dark:bg-[#1a1b1e] dark:text-white">
      <Tips activeSection={activeSection} />
      {/* <div className="help-container">
            <FaLightbulb style={{width: '26px', height: '26px'}} />
        </div> */}
      {/* <div className="branding-container">
        <div className="logo">
            <Image alt="logo" src={logo} width={100} height={100} />
        </div>
      </div> */}
      <div className="editor-container">
        <div className="navigation">
          <div className="login-container" onClick={handleRedirect}>
            <div className="login-cta">Home</div>
          </div>
          <div className="nav-container">
            <div
              onClick={() => setActiveSection("Personal Info")}
              className={`icon-container ${activeSection === "Personal Info" ? "border" : ""}`}
            >
              <FaUserTie
                className={`icon ${activeSection === "Personal Info" ? "selected" : ""}`}
              />
            </div>
            <div
              onClick={() => setActiveSection("Education")}
              className={`icon-container ${activeSection === "Education" ? "border" : ""}`}
            >
              <IoSchool
                className={`icon ${activeSection === "Education" ? "selected" : ""}`}
              />
            </div>
            <div
              onClick={() => setActiveSection("Experience")}
              className={`icon-container ${activeSection === "Experience" ? "border" : ""}`}
            >
              <FaSuitcase
                className={`icon ${activeSection === "Experience" ? "selected" : ""}`}
              />
            </div>
            <div
              onClick={() => setActiveSection("Project")}
              className={`icon-container ${activeSection === "Project" ? "border" : ""}`}
            >
              <AiFillProject
                className={`icon ${activeSection === "Project" ? "selected" : ""}`}
              />
            </div>
            <div
              onClick={() => setActiveSection("Skills")}
              className={`icon-container ${activeSection === "Skills" ? "border" : ""}`}
            >
              <FaTools
                className={`icon ${activeSection === "Skills" ? "selected" : ""}`}
              />
            </div>
            <div
              onClick={() => setActiveSection("Certificate")}
              className={`icon-container ${activeSection === "Certificate" ? "border" : ""}`}
            >
              <PiCertificateFill
                className={`icon ${activeSection === "Certificate" ? "selected" : ""}`}
              />
            </div>
            <div
              onClick={() => setActiveSection("Language")}
              className={`icon-container ${activeSection === "Language" ? "border" : ""}`}
            >
              <FaLanguage
                className={`icon ${activeSection === "Language" ? "selected" : ""}`}
              />
            </div>
          </div>
          <div className="branding-container">
            <Image alt="logo" src={logo} />
          </div>
        </div>
        <div className="editor">
          <div className="section-header">
            <div className="section-title">
              {getSectionTitle(activeSection)}
            </div>
            <div className="move-container">
              <CiCircleChevLeft
                style={{
                  marginRight: "50px",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                }}
                onClick={handleLeftNav}
              />
              <PiCaretCircleRightFill
                style={{ width: "40px", height: "40px", cursor: "pointer" }}
                onClick={handleRightNav}
              />
            </div>
          </div>
          <div className="material-container">
            {activeSection === "Personal Info" && (
              <PersonalInfo
                resumeData={resumeData}
                handleInputChange={handleInputChange}
              />
            )}
            {activeSection === "Education" && (
              <Education
                resumeData={resumeData}
                handleInputChange={handleInputChange}
                handleAddField={handleAddField}
                handleDeleteField={handleDeleteField}
              />
            )}
            {activeSection === "Experience" && (
              <Experience
                resumeData={resumeData}
                handleInputChange={handleInputChange}
                handleAddField={handleAddField}
                handleDeleteField={handleDeleteField}
              />
            )}
            {activeSection === "Skills" && (
              <Skills
                resumeData={resumeData}
                handleInputChange={handleInputChange}
                handleAddField={handleAddField}
                handleDeleteField={handleDeleteField}
              />
            )}
            {activeSection === "Project" && (
              <Project
                resumeData={resumeData}
                handleInputChange={handleInputChange}
                handleAddField={handleAddField}
                handleDeleteField={handleDeleteField}
              />
            )}
            {activeSection === "Certificate" && (
              <Certificate
                resumeData={resumeData}
                handleInputChange={handleInputChange}
                handleAddField={handleAddField}
                handleDeleteField={handleDeleteField}
              />
            )}
            {activeSection === "Language" && (
              <Language
                resumeData={resumeData}
                handleInputChange={handleInputChange}
                handleAddField={handleAddField}
                handleDeleteField={handleDeleteField}
              />
            )}
          </div>
        </div>
        <div className="preview">
          <div className="tools">
            <div className="tools-container">
              <div className="widgets">
                <div className="change-template">
                  <MdWidgets />
                  <div>
                    <Link href="/select-templates">Change Template</Link>
                  </div>
                </div>
                <div className="input-check">
                  <input type="checkbox" /> S
                </div>
                <div className="input-check">
                  <input type="checkbox" checked /> M
                </div>
                <div className="input-check">
                  <input type="checkbox" /> L
                </div>
              </div>
              <div className="download-container cursor-pointer">
                <div className="download" onClick={handleDownload}>
                  {isGeneratingPDF ? (
                    <span>Generating PDF...</span>
                  ) : (
                    <>
                      <IoMdDownload />
                      <div>Download</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="preview-container" id="resumeParent">
            {/* <Template1 resumeData={resumeData} id="wrapper" />
            <Template2 resumeData={resumeData} id="wrapper" /> */}
            {/* <Template3 resumeData={resumeData} id="wrapper" /> */}
            {/* <Image alt="template" src={template}  /> */}

            {renderTemplate()}
          </div>
          {/* <div className="preview-container">                
                <Image alt="template" src={template}  />
            </div>             */}
        </div>
      </div>
    </div>
  );
}
