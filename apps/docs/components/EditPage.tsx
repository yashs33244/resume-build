"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import { Button } from "@ui/components/ui/button";
import Resume from "./Resume";
import { ResumeProps } from "../types/ResumeProps";
import { initialResumeData } from "../utils/resumeData";
import { Education } from "./Editor/Education";
import { Skills } from "./Editor/Skills";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const sections = [
  "Personal Info",
  "Education",
  "Experience",
  "Skills",
  "Achievement",
];

export default function EditPage() {
  const [resumeData, setResumeData] = useState<ResumeProps>(initialResumeData);
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    const savedData = isClient
      ? window.localStorage.getItem("resumeData")
      : null;
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const val = isClient
      ? window.localStorage.setItem("resumeData", JSON.stringify(resumeData))
      : null;
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
      } else if (section === "education") {
        if (newData.education && Array.isArray(newData.education)) {
          newData.education = newData.education.map((item, i) =>
            i === index ? { ...item, [field]: value } : item,
          );
        }
      } else if (section === "experience") {
        if (newData.experience && Array.isArray(newData.experience)) {
          newData.experience = newData.experience.map((item, i) =>
            i === index ? { ...item, [field]: value } : item,
          );
        }
      } else if (section === "skills") {
        const updatedSkills = { ...newData.skills };

        if (field === "updateCategory") {
          const { oldName, newName } = value as {
            oldName: string;
            newName: string;
          };
          if (oldName !== newName && updatedSkills[oldName]) {
            updatedSkills[newName] = updatedSkills[oldName]?.slice() || [];
            delete updatedSkills[oldName];
          }
        } else if (field === "skill" && category && subIndex !== undefined) {
          if (!updatedSkills[category]) {
            updatedSkills[category] = [];
          }
          const categorySkills = updatedSkills[category];
          if (
            categorySkills &&
            subIndex >= 0 &&
            subIndex < categorySkills.length
          ) {
            const updatedCategorySkills = [...categorySkills];
            updatedCategorySkills[subIndex] = value;
            updatedSkills[category] = updatedCategorySkills;
          }
        } else if (field === "newSkill" && category) {
          if (!updatedSkills[category]) {
            updatedSkills[category] = [];
          }
          const categorySkills = updatedSkills[category];
          if (categorySkills) {
            const lastSkill = categorySkills[categorySkills.length - 1];
            if (lastSkill === undefined || lastSkill.trim() !== "") {
              updatedSkills[category] = [...categorySkills, ""];
            }
          }
        } else if (
          field === "deleteSkill" &&
          category &&
          subIndex !== undefined
        ) {
          const categorySkills = updatedSkills[category];
          if (categorySkills) {
            updatedSkills[category] = categorySkills.filter(
              (_, i) => i !== subIndex,
            );
          }
        }

        newData.skills = updatedSkills;
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
        (newData[section] as any[]) = (prevData[section] as any[]).filter(
          (_, i) => i !== index,
        );
      } else if (section === "skills") {
        if (category && skillIndex !== undefined) {
          // Delete a skill from a category
          newData.skills = {
            ...newData.skills,
            [category]:
              newData.skills[category]?.filter((_, i) => i !== skillIndex) ||
              [],
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

      // pdf.save("resume.pdf");
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
