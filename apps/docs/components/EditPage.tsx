"use client";
import dynamic from "next/dynamic";
import React from "react";
import Image from "next/image";
import { Button } from "@ui/components/ui/button";
import Resume from "./resumes/Resume_one";
import { A4Canvas } from "./A4canvas";
import "./EditPage.scss";
import { Education } from "./Editor/Education";
import { Template1 } from "./Editor/templates/Template1";
import { Skills } from "./Editor/Skills";
import { Language } from "./Editor/Language";
import jsPDF from "jspdf";
import logo_short from "./logo_short.svg";
import logo from "./logo.svg";
import html2canvas from "html2canvas";
import CanvasResume from "./resumes/CanvasResume";
import ModernResume, { Resume2 } from "./resumes/Resume_two";
import template from "./template.png";
import Resume3 from "./resumes/Resume_three";
import { useResumeData } from "../hooks/useResumeData";
import { useActiveSection } from "../hooks/useActiveSection";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@ui/components/ui/collapsible";

import { FaUserTie } from "react-icons/fa";
import { MdWidgets } from "react-icons/md";
import { IoSchool } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa";
import { AiFillProject } from "react-icons/ai";
import { FaFileDownload } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import { FaTools } from "react-icons/fa";
import { CiCircleChevLeft } from "react-icons/ci";
import { PiCaretCircleRightFill } from "react-icons/pi";
import { PiCertificateFill } from "react-icons/pi";
import { FaLanguage } from "react-icons/fa6";
import { FcIdea } from "react-icons/fc";
import { MdTipsAndUpdates } from "react-icons/md";

import { FaChevronCircleRight } from "react-icons/fa";
import { FaChevronCircleLeft } from "react-icons/fa";

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
  const { resumeData, handleInputChange, handleAddField, handleDeleteField } =
    useResumeData();
  const { activeSection, handleSectionChange, sections, setActiveSection } =
    useActiveSection();

  const handleDownload = async () => {
    const element = document.querySelector("#resume")!;
    //@ts-ignore
    html2canvas(element, {
      scale: 4,
      logging: false,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

      const canvasWidth = canvas.width * ratio;
      const canvasHeight = canvas.height * ratio;

      const marginX = (pageWidth - canvasWidth) / 2;
      const marginY = (pageHeight - canvasHeight) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        marginX,
        marginY,
        canvasWidth,
        canvasHeight,
        undefined,
        "FAST",
      );

      pdf.save("resume.pdf");
    });
    const response = await fetch("/api/saveResume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Make sure to include the userId in your resumeData
        resumeData: resumeData,
      }),
    });

    if (!response.ok) {
      console.error("Failed to save resume");
    }
    // Save resume data to the database
  };

  const getSectionTitle = () => {
    switch(activeSection) {
        case "Personal Info": 
            return 'Add Personal Details';
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
        default: return;
            break;
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground dark:bg-[#1a1b1e] dark:text-white">
      {/* <div className="branding-container">
        <div className="logo">
            <Image alt="logo" src={logo} width={100} height={100} />
        </div>
      </div> */}
      <div className="editor-container">
        <div className="navigation">
            <div className="login-container">
                <div className="login-cta">Login</div>
            </div>
            <div className="nav-container">
                <div onClick={() => setActiveSection('Personal Info')} className={`icon-container ${activeSection === 'Personal Info' ? 'border' : ''}`}><FaUserTie className={`icon ${activeSection === 'Personal Info' ? 'selected' : ''}`} /></div>
                <div onClick={() => setActiveSection('Education')} className={`icon-container ${activeSection === 'Education' ? 'border' : ''}`}><IoSchool className={`icon ${activeSection === 'Education' ? 'selected' : ''}`} /></div>
                <div onClick={() => setActiveSection('Experience')} className={`icon-container ${activeSection === 'Experience' ? 'border' : ''}`}><FaSuitcase className={`icon ${activeSection === 'Experience' ? 'selected' : ''}`} /></div>
                <div onClick={() => setActiveSection('Project')} className={`icon-container ${activeSection === 'Project' ? 'border' : ''}`}><AiFillProject className={`icon ${activeSection === 'Project' ? 'selected' : ''}`} /></div>
                <div onClick={() => setActiveSection('Skills')} className={`icon-container ${activeSection === 'Skills' ? 'border' : ''}`}><FaTools className={`icon ${activeSection === 'Skills' ? 'selected' : ''}`} /></div>
                <div onClick={() => setActiveSection('Certificate')} className={`icon-container ${activeSection === 'Certificate' ? 'border' : ''}`}><PiCertificateFill className={`icon ${activeSection === 'Certificate' ? 'selected' : ''}`} /></div>
                <div onClick={() => setActiveSection('Language')} className={`icon-container ${activeSection === 'Language' ? 'border' : ''}`}><FaLanguage className={`icon ${activeSection === 'Language' ? 'selected' : ''}`} /></div>
            </div>
            <div className="branding-container">
                <Image alt="logo" src={logo} />
            </div>
        </div>
        <div className="editor">
            <div className="section-header">
                <div className="section-title">{getSectionTitle(activeSection)}</div>
                <div className="move-container">
                    <CiCircleChevLeft style={{marginRight: '50px', width: '40px', height: '40px', cursor: 'pointer'}} />
                    <PiCaretCircleRightFill style={{width: '40px', height: '40px', cursor: 'pointer'}} />
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
            {/* <div className="movement">
                <div className="prev-container">
                    <FaChevronCircleLeft />
                    <div>Prev</div>
                </div>
                <div className="next-container">                        
                    <div>Next</div>
                    <FaChevronCircleRight />
                </div>
            </div>    */}
        </div>
        <div className="preview">
            <div className="tools">
                <div className="tools-container">
                    <div className="widgets">
                        <div className="change-template">
                            <MdWidgets />
                            <div>Change Template</div>
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
                    <div className="download-container">
                        <div className="download">
                            <IoMdDownload />
                            <div>Download</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="preview-container">
                <Template1 />
                {/* <Image alt="template" src={template}  /> */}
            </div>
            {/* <div className="preview-container">                
                <Image alt="template" src={template}  />
            </div>             */}
        </div>
      </div>
    </div>
  );
}
