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
import ExperienceDatePickers from "../ExperienceDatePickers";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";
import loading from "../../public/loading.gif";

const ClientSideQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-white-500 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-4 h-4 rounded-full bg-white-500 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-white-500 animate-bounce [animation-delay:.7s]"></div>
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

  const handleAiGeneration = async (promptValue: string, index: number) => {
    setIsLoading({ ...isLoading, [index]: true });
    try {
      const promptObj = aiPrompts.find((p) => p.value === promptValue);
      if (!promptObj) throw new Error("Invalid prompt value");

      const project = projects[index];
      if (!project) throw new Error("Experience not found");

      const content = project.responsibilities?.join("\n") || "";

      const promptText = promptObj.prompt
        .replace("{content}", content);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.text();
      handleResponsibilitiesChange(data, index);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading({ ...isLoading, [index]: false });
    }
  };

  // const aiPrompts = [
  //   "Make It Professional",
  //   "Fix Grammar",
  //   "Concise",
  //   "Elaborate",
  // ];

  const aiPrompts = [
    {
      label: "Make It Professional",
      value: "make_it_better",
      prompt: `Act as a great resume expert and rewrite the following in the most impactful, sharp, result-oriented and professional manner, such that my resume should stand out. Highlight achievements and strengths. Don't lose out on any significant information and context. Use your expertise in the subject. Ensure it aligns with the input text and is not stretched too much in length. Give me the revamped output. \n\n Input : {content}`,
    },
    {
      label: "Fix Grammar",
      value: "fix_grammar",
      prompt: `Act like a grammar expert and scrutinize the following input. Fix it end-to-end for all grammatical errors but do not change the content or it's delivery. Just fix the grammar and return the output with similar structure. \n\n Input : {content}`,
    },
    {
      label: "Concise",
      value: "shorten",
      prompt: `Act like a great resume expert, rewrite the following and summarize the following input. Make it concise and shorten it, but don't lose out on critical and impactful information. \n\n Input : {content}`,
    },
    {
      label: "Elaborate",
      value: "lengthen",
      prompt: `Act like a great resume expert, rewrite the following and elaborate on the following input. Rewrite it in a compelling manner. Don't stretch it too much though. Use your expertise to keep it relevant. \n\n Input : {content}`,
    },
  ];

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
                  <ExperienceDatePickers
                    type="projects"
                    index={index}
                    exp={proj}
                    handleInputChange={handleInputChange}
                  />
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
                    </div>
                  </div>
                  <div className="ai-container flex flex-wrap items-center gap-2 mt-4">
                    {!isLoading[index] ? (
                      <BsStars style={{ width: "20px", height: "20px" }} />
                    ) : (
                      <img
                        src={loading.src}
                        alt="loading..."
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                    {aiPrompts.map((prompt, promptIndex) => (
                      <button
                        key={promptIndex}
                        onClick={() => handleAiGeneration(prompt.value, index)}
                        className="ai-chip px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                        disabled={isLoading[index]}
                      >
                        {prompt.label}
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
