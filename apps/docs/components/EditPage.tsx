"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./EditPage.scss";
import { Education } from "./Editor/Education";
import { Skills } from "./Editor/Skills";
import { Language } from "./Editor/Language";
import Tips from "./Tips";
import { useResumeData } from "../hooks/useResumeData";
import { useActiveSection } from "../hooks/useActiveSection";
import { FaUserTie, FaSuitcase, FaTools } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { AiFillProject } from "react-icons/ai";
import short_logo from "./short_logo.svg";
import { IoMdDownload } from "react-icons/io";
import { CiCircleChevLeft } from "react-icons/ci";
import { PiCaretCircleRightFill, PiCertificateFill } from "react-icons/pi";
import { MdTipsAndUpdates } from "react-icons/md";
import { TbGridDots } from "react-icons/tb";
import DownloadModel from "./DownloadModel";
import { Template1 } from "./Editor/templates/Template1";
import { Template2 } from "./Editor/templates/template2";
import { Template3 } from "./Editor/templates/template3";
import 'react-responsive-modal/styles.css';
import Link from "next/link";
import ChanegTemplate from "./changeTemplate/ChangeTemplate";
import { useRouter } from 'next/navigation'
import { useSaveResume } from "../hooks/useSaveResume";
import useAiSuggestion from "../hooks/useAiSuggestions";
import { ResumeProps } from "../types/ResumeProps";
import { useSession } from "next-auth/react";
import Modal from "react-responsive-modal";
import { isOpacityEffect } from "html2canvas/dist/types/render/effects";

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
    const [currentTemplate, setCurrentTemplate] = useState("template1");
    const [isOverflowing, setIsOverflowing] = useState(undefined);
    const router = useRouter();
    const [template, setTemplate] = useState<string | null>(null);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const { handleAiSuggestion, isLoading, suggestions, error } =useAiSuggestion();
    const { data: session, status: sessionStatus } = useSession();


    const { resumeData, handleInputChange, handleAddField, handleDeleteField } =
        useResumeData();
    const { activeSection, handleSectionChange, sections, setActiveSection } =
        useActiveSection();

    const openModel = () => {
        setIsModelOpen(true);
    };

    const closeModel = () => {
        setIsModelOpen(false);
    };
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

    const handleRedirect = async () => {
        router.push("/dashboard");
    };

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
    });

    useEffect(() => {
        const checkOverflow = () => {
            if(isOverflowing == undefined){
                const templateElement = document.querySelector(".template-container");;
                if (templateElement) {
                    const isOverflown = templateElement.scrollHeight > 842;
                    if(isOverflown)
                        setIsOverflowing(isOverflown);
                }
            }
        };
        checkOverflow();
    }, [resumeData]);

    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [tipsOpen, setTipsOpen] = useState(false);
    const [showDownloadModal, setDownloadModal] = useState(false);

    const handleDownload = async () => {
        setIsGeneratingPDF(true);
        try {
            const element = document.getElementById("wrapper");
            if (!element) throw new Error("Resume wrapper not found");
            element.style.transform = "scale(1)";

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
    const handleSkillsSelect = (resumeData: ResumeProps) => {
        setActiveSection("Skills");
        handleAiSuggestion(resumeData);
    };

    const templateChangeHandler = (e: any) => {
        setCurrentTemplate(e?.target?.value);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-background text-foreground dark:bg-[#1a1b1e] dark:text-white">
            <Modal
                open={isOverflowing} 
                showCloseIcon={false}
                classNames={{ modal: "overflow_modal" }}
            >
                <div className="overflow_modal_div">
                    <p className="overflow_modal_div_p1">Your content is overflowing</p>
                    <p className="overflow_modal_div_p2">You can either reduce the content or change the size</p>
                    <button 
                        className="overflow_modal_div_btn" 
                        onClick={()=>setIsOverflowing(false)}
                    >
                        Ok
                    </button>
                </div>
            </Modal>
            <Tips activeSection={activeSection} open={tipsOpen} setTipsOpen={(val) => setTipsOpen(val)} />
            <div className="editor-container">
                <div className="navigation">
                    <div className="login-container">
                        {
                            session?.user 
                            ? 
                                <div className="login-cta" onClick={handleRedirect}>
                                    <TbGridDots />
                                    <div>PG</div>
                                </div>
                            :
                                <div className="login-cta">
                                    <TbGridDots />
                                    <div>
                                        <Link href="/">PG</Link>
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="nav-container">
                        <div className="logo-placement">
                            <Image alt="short_logo" src={short_logo} width={50} height={50} />
                        </div>
                        <div
                            onClick={() => setActiveSection("Personal Info")}
                            className={`icon-container ${activeSection === "Personal Info" ? "border" : ""}`}
                        >
                            <FaUserTie className={`icon ${activeSection === "Personal Info" ? "selected" : ""}`}/>
                        </div>
                        <div
                            onClick={() => setActiveSection("Education")}
                            className={`icon-container ${activeSection === "Education" ? "border" : ""}`}
                        >
                            <IoSchool className={`icon ${activeSection === "Education" ? "selected" : ""}`}/>
                        </div>
                        <div
                            onClick={() => setActiveSection("Experience")}
                            className={`icon-container ${activeSection === "Experience" ? "border" : ""}`}
                        >
                            <FaSuitcase className={`icon ${activeSection === "Experience" ? "selected" : ""}`}/>
                        </div>
                        <div
                            onClick={() => setActiveSection("Project")}
                            className={`icon-container ${activeSection === "Project" ? "border" : ""}`}
                        >
                            <AiFillProject className={`icon ${activeSection === "Project" ? "selected" : ""}`}/>
                        </div>
                        <div
                            onClick={() => handleSkillsSelect(resumeData)}
                            className={`icon-container ${activeSection === "Skills" ? "border" : ""}`}
                        >
                            <FaTools className={`icon ${activeSection === "Skills" ? "selected" : ""}`}/>
                        </div>
                        <div
                            onClick={() => setActiveSection("Certificate")}
                            className={`icon-container ${activeSection === "Certificate" ? "border" : ""}`}
                        >
                            <PiCertificateFill className={`icon ${activeSection === "Certificate" ? "selected" : ""}`}/>
                        </div>
                    </div>
                </div>
                <div className="editor">
                    <div className="section-header">
                        <div className="section-title">
                            {getSectionTitle(activeSection)}
                            <div className="tips" onClick={() => setTipsOpen(!tipsOpen)}>
                                <MdTipsAndUpdates />
                                <div>Tips</div>
                            </div>
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
                            <ChanegTemplate />
                            <div className="download-container cursor-pointer">
                                {session?.user ? (
                                    <div className="download" onClick={openModel}>
                                        <IoMdDownload />
                                        <div>Download</div>
                                    </div>
                                ) : (
                                    <div className="download">
                                        {" "}
                                        <Link href="/api/auth/signin">Login to download</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="preview-container" id="resumeParent">
                        {renderTemplate()}
                    </div>
                </div>
                <DownloadModel
                    isOpen={isModelOpen}
                    onClose={closeModel}
                    resumeData={resumeData}
                    templateId={template || ""}
                    renderTemplate={renderTemplate}
                />
            </div>
        </div>
    );
}
