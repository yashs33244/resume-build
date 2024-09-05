"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState } from "react";
import "./EditPage.scss";
import { Education } from "./Editor/Education";
import { Skills } from "./Editor/Skills";
import { Language } from "./Editor/Language";
import Image from "next/image";
import Tips from "./Tips";
import logo from "./logo.svg";
import { useResumeData } from "../hooks/useResumeData";
import { useActiveSection } from "../hooks/useActiveSection";
import { FaUserTie, FaSuitcase, FaTools } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { AiFillProject } from "react-icons/ai";
import { IoMdDownload } from "react-icons/io";
import { CiCircleChevLeft } from "react-icons/ci";
import { PiCaretCircleRightFill, PiCertificateFill } from "react-icons/pi";
import { FaLanguage } from "react-icons/fa6";
//@ts-ignore
import html2pdf from 'html2pdf.js';
import { Template1 } from "./Editor/templates/Template1";
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
    const [currentTemplate, setCurrentTemplate] = useState('template1')
    const { resumeData, handleInputChange, handleAddField, handleDeleteField } = useResumeData();
    const { activeSection, handleSectionChange, sections, setActiveSection } = useActiveSection();

    useEffect(() => {
        function scaleContent() {
            const container = document.getElementById('resumeParent');
            const content = document.getElementById('wrapper');
            //@ts-ignore
            const widthScale = container?.offsetWidth / content?.offsetWidth;
            //@ts-ignore
            const heightScale = container?.offsetHeight / content?.offsetHeight;
            const scale = Math.min(widthScale, heightScale);
            if (content) {
                content.style.transform = `scale(${scale})`;
            }
        }

        window.addEventListener('resize', scaleContent);
        scaleContent();
    })

    const handleDownload = async () => {
        const element = document.getElementById('wrapper')?.cloneNode(true);
        //@ts-ignore
        element.style.transform = `scale(1)`;
        const opt = {
            margin: 0,
            filename: 'resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 4, useCORS: true, width: 595, height: 842 },
            jsPDF: { unit: 'px', format: [595, 842], orientation: 'portrait' },
            enableLinks: true
        };
        html2pdf().set(opt).from(element).toPdf().output('blob').then(function (pdfBlob: any) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(function (error: any) {
            console.error('Error generating PDF:', error);
        });
    };

    const getSectionTitle = () => {
        switch (activeSection) {
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

    const templateChangeHandler = (e: any) => {
        setCurrentTemplate(e?.target?.value)
    }

    const getTemplate = () => {
        switch (currentTemplate) {
            case 'template1':
                return (<Template1 resumeData={resumeData} id="wrapper" />)
            case 'template2':
                return (<Template2 resumeData={resumeData} id="wrapper" />)
            case 'template3':
                return (<Template3 resumeData={resumeData} id="wrapper" />)
            default:
                return (<Template1 resumeData={resumeData} id="wrapper" />)
        }
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-background text-foreground dark:bg-[#1a1b1e] dark:text-white">
            <Tips activeSection={activeSection} />
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
                        <div className="section-title">{getSectionTitle()}</div>
                        <div className="move-container">
                            <CiCircleChevLeft style={{ marginRight: '50px', width: '40px', height: '40px', cursor: 'pointer' }} />
                            <PiCaretCircleRightFill style={{ width: '40px', height: '40px', cursor: 'pointer' }} />
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
                                <div>
                                    <select className="change-template" onChange={templateChangeHandler}>
                                        <option value='template1' selected>Template 1</option>
                                        <option value='template2'>Template 2</option>
                                        <option value='template3'>Template 3</option>
                                    </select>
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
                                <div className="download" onClick={handleDownload}>
                                    <IoMdDownload />
                                    <div>Download</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="preview-container" id='resumeParent'>
                        {getTemplate()}
                    </div>
                </div>
            </div>
        </div>
    );
}
