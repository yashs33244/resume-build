"use client";
import dynamic from "next/dynamic";
import React from "react";
import { Button } from "@ui/components/ui/button";
import Resume from "./resumes/Resume_one";
import { A4Canvas } from "./A4canvas";

import { Education } from "./Editor/Education";
import { Skills } from "./Editor/Skills";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CanvasResume from "./resumes/CanvasResume";
import ModernResume, { Resume2 } from "./resumes/Resume_two";
import Resume3 from "./resumes/Resume_three";
import { useResumeData } from "../hooks/useResumeData";
import { useActiveSection } from "../hooks/useActiveSection";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@ui/components/ui/collapsible";

const PersonalInfo = dynamic(
  () => import("./Editor/PersonalInfo").then((mod) => mod.PersonalInfo),
  { ssr: false },
);
const Experience = dynamic(
  () => import("./Editor/Experience").then((mod) => mod.Experience),
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

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground dark:bg-[#1a1b1e] dark:text-white">
      <nav className="flex justify-center p-2 bg-gray-900 rounded-full mx-auto my-4 max-w-2xl">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              activeSection === section
                ? "bg-white text-black"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {section}
          </button>
        ))}
      </nav>
      <main className="flex flex-1 p-4 md:p-10">
        <div className="flex flex-col w-full gap-4 md:flex-row">
          <div className="w-full md:w-1/2">          
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
            {activeSection === "Achievement" && (
              <Achievement
                resumeData={resumeData}
                handleInputChange={handleInputChange}
                handleDeleteField={handleDeleteField}
              />
            )}
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-full mx-auto">
              <A4Canvas resumeData={resumeData} />
            </div>
            {/* <Resume {...resumeData} /> */}
            {/* <Resume2 {...resumeData} /> */}
            {/* <Resume3 {...resumeData} /> */}
            {/* <ModernResume {...resumeData} /> */}
            <Button onClick={handleDownload} className="mt-4">
              Download as PDF
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
