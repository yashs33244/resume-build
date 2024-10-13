"use client";
import React, { useEffect } from "react";
import { Edit, Download, Trash2, RefreshCcw, PlusCircle } from "lucide-react";
import { useRecoilValue } from "recoil";
import "./Dashboard.scss";

import { isGeneratingPDFAtom } from "../store/pdfgenerating";
import useResumeDownload from "../hooks/useResumeDownload";
import { useResumeData } from "../hooks/useResumeData";
import template2 from "./template2.png";
import Image from "next/image";
import Link from "next/link";

import { CiEdit } from "react-icons/ci";
import { MdOutlineFileDownload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { ImMagicWand } from "react-icons/im";
import { VscDebugRestart } from "react-icons/vsc";
import { IoAddCircleOutline } from "react-icons/io5";

// Import your template components
import { Template1 } from "./Editor/templates/Template1";
import { Template2 } from "./Editor/templates/template2";
import { Template3 } from "./Editor/templates/template3";
import { useResumeState } from "../hooks/useResumeState";

const Dashboard = () => {
    const { handleDownload } = useResumeDownload();
    const isGeneratingPDF = useRecoilValue(isGeneratingPDFAtom);
    const { resumeData, selectedTemplate } = useResumeData();
    const { resumeState, daysLeft, createDate } = useResumeState();

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case "fresher":
                return <Template1 resumeData={resumeData} className="wrapper"/>;
            case "experienced":
                return <Template2 resumeData={resumeData} className="wrapper"/>;
            case "designer":
                return <Template3 resumeData={resumeData} className="wrapper"/>;
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
                            <Link
                                href={`/select-templates/editor?template=${selectedTemplate}`}
                            >
                                <div className="edit">
                                    <CiEdit className="cta-icon" />
                                    <div>Edit</div>
                                </div>
                            </Link>
                            <div className="download">
                                <MdOutlineFileDownload className="cta-icon" />
                                <div>Download</div>
                            </div>
                            <div className="delete">
                                <RiDeleteBinLine className="cta-icon" />
                                <div>Delete</div>
                            </div>
                            <Link
                                href={`/tailored-resume`}
                            >
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
