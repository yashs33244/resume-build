"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import Resume from "../components/Resume";
import { ResumeProps } from "../types/ResumeProps";
import { initialResumeData } from "../utils/resumeData";
import { PersonalInfo } from "../components/Editor/PersonalInfo";
import { Education } from "../components/Editor/Education";
import { Experience } from "../components/Editor/Experience";
import { Skills } from "../components/Editor/Skills";
import { Achievement } from "../components/Editor/Achievement";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const sections = [
  "Personal Info",
  "Education",
  "Experience",
  "Skills",
  "Achievement",
];

export default function Editor() {
  const [resumeData, setResumeData] = useState<ResumeProps>(initialResumeData);
  const [activeSection, setActiveSection] = useState(sections[0]);

  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  const handleInputChange = (
    section: keyof ResumeProps,
    field: string,
    value: any,
    index?: number,
    subIndex?: number,
    category?: string,
  ) => {
    setResumeData((prevData) => {
      const newData = { ...prevData } as ResumeProps;

      if (section === "personalInfo") {
        newData.personalInfo = {
          ...newData.personalInfo,
          [field]: value,
        };
      } else if (section === "experience" || section === "education") {
        if (newData[section]) {
          newData[section] = [...(newData[section] as any[])];
          if (index !== undefined && newData[section][index]) {
            newData[section][index] = {
              ...newData[section][index],
              [field]: value,
            };
          }
        }
      } else if (section === "skills") {
        newData.skills = { ...newData.skills };
        if (field === "updateCategory") {
          const { oldName, newName } = value;
          if (oldName !== newName && newData.skills[oldName]) {
            newData.skills[newName] = newData.skills[oldName];
            delete newData.skills[oldName];
          }
        } else if (field === "skill" && category && subIndex !== undefined) {
          if (Array.isArray(newData.skills[category])) {
            newData.skills[category] = [...newData.skills[category]];
            newData.skills[category][subIndex] = value;
          }
        } else if (field === "skill" && category && subIndex !== undefined) {
          if (Array.isArray(newData.skills[category])) {
            newData.skills[category] = [...newData.skills[category]];
            newData.skills[category][subIndex] = value;
          }
        } else if (field === "newSkill" && category) {
          if (Array.isArray(newData.skills[category])) {
            const lastSkill =
              newData.skills[category][newData.skills[category].length - 1];
            if (lastSkill === undefined || lastSkill.trim() !== "") {
              newData.skills[category] = [...newData.skills[category], ""];
            }
          } else {
            newData.skills[category] = [""];
          }
        } else if (
          field === "deleteSkill" &&
          category &&
          subIndex !== undefined
        ) {
          if (Array.isArray(newData.skills[category])) {
            newData.skills[category] = newData.skills[category].filter(
              (_, i) => i !== subIndex,
            );
          }
        }
      } else if (section === "achievement") {
        newData.achievement = {
          ...newData.achievement,
          [field]: value,
        } as { title: string; description: string };
      } else {
        // Handle personal info fields (name, title, website, email, phone)
        (newData as any)[field] = value;
      }

      return newData;
    });
  };
  const handleAddField = (section: keyof ResumeProps, category?: string) => {
    setResumeData((prevData) => {
      const newData = { ...prevData };
      if (section === "education") {
        newData.education = [
          ...(prevData.education || []),
          { institution: "", years: "", degree: "" },
        ];
      } else if (section === "experience") {
        newData.experience = [
          ...(prevData.experience || []),
          { company: "", role: "", duration: "", responsibilities: [] },
        ];
      } else if (section === "skills") {
        if (category) {
          // Add a new skill to the specified category
          newData.skills = {
            ...prevData.skills,
            [category]: [...(prevData.skills[category] || []), ""],
          };
        } else {
          // Add a new category
          const newCategoryName = `New Category ${Object.keys(prevData.skills || {}).length + 1}`;
          newData.skills = {
            ...(prevData.skills || {}),
            [newCategoryName]: [],
          };
        }
      }
      return newData;
    });
  };

  const handleDeleteField = (
    section: keyof ResumeProps,
    index?: number,
    category?: string,
    skillIndex?: number,
  ) => {
    setResumeData((prevData) => {
      const newData = { ...prevData };
      if (section === "education" || section === "experience") {
        newData[section] = prevData[section]!.filter((_, i) => i !== index);
      } else if (section === "skills") {
        if (category && skillIndex !== undefined) {
          // Delete a skill from a category
          newData.skills = {
            ...newData.skills,
            [category]: newData.skills[category].filter(
              (_, i) => i !== skillIndex,
            ),
          };
        } else if (category) {
          // Delete an entire category
          const { [category]: _, ...rest } = newData.skills;
          newData.skills = rest;
        }
      } else if (section === "achievement") {
        newData.achievement = undefined;
      }
      return newData;
    });
  };
  const handleDownload = async () => {
    const element = document.querySelector("#resume")!;

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
            <h1 className="text-3xl font-bold">Edit Resume</h1>
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
            <Resume {...resumeData} />
            <Button onClick={handleDownload} className="mt-4">
              Download as PDF
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
