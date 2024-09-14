"use client";
import React, { useState, useEffect } from "react";
import { Edit, Download, Trash2, RefreshCcw, PlusCircle } from "lucide-react";
import { useRecoilValue } from "recoil";

import { isGeneratingPDFAtom } from "../store/pdfgenerating";
import useResumeDownload from "../hooks/useResumeDownload";
import { initialResumeData } from "../utils/resumeData";
import Link from "next/link";

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
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          <Link href="/select-templates">Create New</Link>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="text-sm text-gray-400 mb-2">20 days left</div>
          <div className="flex">
            <div className="w-1/4 pr-4">
              <img
                src="resume1.png"
                alt="Resume Preview"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="w-1/4 flex flex-col justify-center">
              <button className="flex items-center text-white hover:bg-gray-700 py-2 px-4 rounded mb-2">
                <Edit className="mr-2 h-4 w-4" />{" "}
                <Link href="/select-templates/editor">Edit</Link>
              </button>
              <button
                className="flex items-center text-white hover:bg-gray-700 py-2 px-4 rounded mb-2"
                onClick={() => handleDownload("resume-id")}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  "Generating..."
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download
                  </>
                )}
              </button>
              <button className="flex items-center text-white hover:bg-gray-700 py-2 px-4 rounded mb-2">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </button>
              <button className="flex items-center text-white hover:bg-gray-700 py-2 px-4 rounded">
                <RefreshCcw className="mr-2 h-4 w-4" /> Tailor to a Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
