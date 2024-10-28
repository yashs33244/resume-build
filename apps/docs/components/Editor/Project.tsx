"use client";
import React, { useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { ResumeProps } from "../../types/ResumeProps";
import "./styles/project.scss";
import { BsStars } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomDatePicker from "./CustomDatePicker";

const ClientSideQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
    </div>
  ),
});

interface ProjectProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
    index?: number,
  ) => void;
  handleAddField: (section: keyof ResumeProps) => void;
  handleDeleteField: (
    section: keyof ResumeProps,
    field: string,
    index?: number,
  ) => void;
}

export const Project: React.FC<ProjectProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const projects = resumeData.projects || [];
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

  const handleResponsibilitiesChange = (value: string, index: number) => {
    const responsibilities = value
      .split("\n")
      .filter((item) => item.trim() !== "");
    handleInputChange("projects", "responsibilities", responsibilities, index);
  };

  const handleAiGeneration = async (prompt: string, index: number) => {
    setIsLoading({ ...isLoading, [index]: true });
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.text();
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const quillEditor = document.querySelector(
          `#responsibilities-${index} .ql-editor`,
        ) as HTMLElement;
        if (quillEditor) {
          const start = range.startOffset;
          const end = range.endOffset;
          const newContent =
            quillEditor.innerHTML.slice(0, start) +
            data +
            quillEditor.innerHTML.slice(end);
          handleResponsibilitiesChange(newContent, index);
        }
      } else {
        handleResponsibilitiesChange(data, index);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading({ ...isLoading, [index]: false });
    }
  };

  const aiPrompts = ["Make It Better", "Check Grammar", "Concise", "Elaborate"];

  return (
    <div className="project-container">
      <div className="project-list">
        {projects.map((proj: any, index: any) => (
          <Collapsible
            className={index === 0 ? "collapse-comp first" : "collapse-comp"}
            key={index}
          >
            <CollapsibleTrigger className="collapse-trigger">
              <div className="proj-note">
                <ChevronDownIcon className="h-5 w-5 transition-transform" />
                <div className="project-details">
                  <div className="title">{proj.name || `Enter Project`}</div>
                  <div className="subtitle">{proj.link ? proj.link : null}</div>
                </div>
              </div>
              <div
                className="delete-cta"
                onClick={() => handleDeleteField("projects", "", index)}
              >
                <FaTrashAlt />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="collapse-content">
              <div className="content-container">
                <div className="form-row">
                  <div className="row-form-field">
                    <Label htmlFor={`project-${index}`} className="field-label">
                      Project Name *
                    </Label>
                    <Input
                      id={`project-${index}`}
                      value={proj.name || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "projects",
                          "name",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg: Online Code Editor"
                      className="form-input"
                    />
                  </div>
                  <div className="row-form-field">
                    <Label htmlFor={`link-${index}`} className="field-label">
                      Link To Project
                    </Label>
                    <Input
                      id={`link-${index}`}
                      value={proj.link || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "projects",
                          "link",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg: herokuapp.com/pgpm/code-editor"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="row-form-field">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <CustomDatePicker
                        id={`start-${index}`}
                        value={proj.start || ""}
                        onChange={() => handleInputChange}
                        index={index}
                        className="text-white"
                        field="start"
                        category="projects" // Passing the category as 'projects'
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="row-form-field">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <CustomDatePicker
                        id={`end-${index}`}
                        value={proj.end || ""}
                        onChange={() => handleInputChange}
                        index={index}
                        className="text-white"
                        field="end"
                        category="projects" // Passing the category as 'projects'
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="single-form-row">
                  <div className="form-field">
                    <Label
                      htmlFor={`responsibilities-${index}`}
                      className="field-label"
                    >
                      Details
                    </Label>
                    <div className="text-editor-container">
                      <ClientSideQuill
                        id={`responsibilities-${index}`}
                        value={proj.responsibilities?.join("\n") || ""}
                        onChange={(value) =>
                          handleResponsibilitiesChange(value, index)
                        }
                        className="text-editor"
                        modules={{
                          toolbar: [
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link"],
                          ],
                        }}
                      />
                      {isLoading[index] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                          <div className="flex space-x-2 animate-pulse">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ai-container flex flex-wrap items-center gap-2 mt-4">
                    <BsStars style={{ width: "20px", height: "20px" }} />
                    {aiPrompts.map((prompt, promptIndex) => (
                      <button
                        key={promptIndex}
                        onClick={() => {
                          const selection = window.getSelection()?.toString();
                          const textToUse =
                            selection ||
                            proj.responsibilities?.join("\n") ||
                            "";
                          handleAiGeneration(`${prompt}: ${textToUse}`, index);
                        }}
                        className=" ai-chip px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                        disabled={isLoading[index]}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <Button
        variant="default"
        onClick={() => handleAddField("projects")}
        className="add-cta"
      >
        + Add Project
      </Button>
    </div>
  );
};

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
