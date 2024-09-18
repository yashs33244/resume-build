"use client";
import React, { useState, useEffect } from "react";
import { Edit, Download, Trash2, RefreshCcw, PlusCircle } from "lucide-react";
import { useRecoilValue } from "recoil";
import "./Dashboard.scss";

import { isGeneratingPDFAtom } from "../store/pdfgenerating";
import useResumeDownload from "../hooks/useResumeDownload";
import { initialResumeData } from "../utils/resumeData";
import template1 from "./template1.png";
import template2 from "./template2.png";
import Image from "next/image";
import Link from "next/link";

import { CiEdit } from "react-icons/ci";
import { MdOutlineFileDownload } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { ImMagicWand } from "react-icons/im";
import { VscDebugRestart } from "react-icons/vsc";
import { IoAddCircleOutline } from "react-icons/io5";

const Dashboard = () => {
  const { handleDownload } = useResumeDownload();
  const isGeneratingPDF = useRecoilValue(isGeneratingPDFAtom);
  const [resumeData, setResumeData] = useState(initialResumeData);

  useEffect(() => {
    // Load resume data from localStorage when component mounts
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <div className="dash-title">My Resumes</div>
        <div className="create-cta">
            <IoAddCircleOutline className="create-icon" />
            <div>Create New</div>
        </div>
      </div>
      <div className="resume-container">
        <div className="first-resume">
            <div className="timer">
                20 days left
            </div>
            <div className="resume-section">
                <Image alt="resume" src={template1} />
                <div className="action-toolbar">
                    <div className="edit">
                        <CiEdit className="cta-icon" />
                        <div>Edit</div>
                    </div>
                    <div className="download">
                        <MdOutlineFileDownload className="cta-icon" />
                        <div>Download</div>
                    </div>
                    <div className="delete">
                        <RiDeleteBinLine className="cta-icon" />
                        <div>Delete</div>
                    </div>
                    <div className="tailor">
                        <ImMagicWand className="cta-icon" />
                        <div>Tailor to a Job</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="second-resume">
            <div className="timer expired">
                Expired
            </div>
            <div className="resume-section">
                <Image alt="resume" src={template2} />
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
