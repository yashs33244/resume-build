"use client";
import React, { useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { ResumeProps } from "../../types/ResumeProps";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";

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

interface ExperienceProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
    index?: number,
  ) => void;
  handleAddField: (section: keyof ResumeProps) => void;
  handleDeleteField: (section: keyof ResumeProps, index?: number) => void;
}

export const Experience: React.FC<ExperienceProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const experiences = resumeData.experience || [];
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

  const handleResponsibilitiesChange = (value: string, index: number) => {
    const responsibilities = value
      .split("\n")
      .filter((item) => item.trim() !== "");
    handleInputChange(
      "experience",
      "responsibilities",
      responsibilities,
      index,
    );
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

  const aiPrompts = ["Fix Grammar", "Fix Spelling", "Summarize", "ask AI"];

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-3xl mb-6">
        Experience
      </h2>
      <div className="space-y-4">
        {experiences.map((exp, index) => (
          <Collapsible key={index}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-3 text-left text-lg font-medium transition-colors hover:bg-muted-foreground/10 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75 [&[data-state=open]>svg]:rotate-180">
              <span>{exp.company || `Experience ${index + 1}`}</span>
              <ChevronDownIcon className="h-5 w-5 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-4 pb-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor={`company-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Company
                  </Label>
                  <Input
                    id={`company-${index}`}
                    value={exp.company || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "experience",
                        "company",
                        e.target.value,
                        index,
                      )
                    }
                    placeholder="Company"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`role-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Role
                  </Label>
                  <Input
                    id={`role-${index}`}
                    value={exp.role || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "experience",
                        "role",
                        e.target.value,
                        index,
                      )
                    }
                    placeholder="Role"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`duration-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Duration
                  </Label>
                  <Input
                    id={`duration-${index}`}
                    value={exp.duration || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "experience",
                        "duration",
                        e.target.value,
                        index,
                      )
                    }
                    placeholder="Duration"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`responsibilities-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Responsibilities
                  </Label>
                  <div className="relative">
                    <ClientSideQuill
                      id={`responsibilities-${index}`}
                      value={exp.responsibilities?.join("\n") || ""}
                      onChange={(value) =>
                        handleResponsibilitiesChange(value, index)
                      }
                      className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "image"],
                          ["clean"],
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
                <div className="flex flex-wrap gap-2 mt-2">
                  {aiPrompts.map((prompt, promptIndex) => (
                    <button
                      key={promptIndex}
                      onClick={() => {
                        const selection = window.getSelection()?.toString();
                        const textToUse =
                          selection || exp.responsibilities?.join("\n") || "";
                        handleAiGeneration(`${prompt}: ${textToUse}`, index);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                      disabled={isLoading[index]}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteField("experience", index)}
                  className="mt-2"
                >
                  Delete Experience
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <Button
        variant="default"
        onClick={() => handleAddField("experience")}
        className="mt-4"
      >
        Add Experience
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
