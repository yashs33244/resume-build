"use client";
import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ResumeProps } from "../../types/ResumeProps";

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
  const experiences = resumeData.experience || []; // Default to empty array

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

  const handleAIEdit = (text: string) => {
    // Dummy AI Edit function
    return text + " (Edited by AI)";
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Experience</h2>
      {experiences.map((exp, index) => (
        <div key={index} className="mt-4 p-4 border rounded-lg shadow-sm">
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
              handleInputChange("experience", "company", e.target.value, index)
            }
            placeholder="Company"
            className="mb-4 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
              handleInputChange("experience", "role", e.target.value, index)
            }
            placeholder="Role"
            className="mb-4 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
              handleInputChange("experience", "duration", e.target.value, index)
            }
            placeholder="Duration"
            className="mb-4 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Label
            htmlFor={`responsibilities-${index}`}
            className="block mb-2 font-medium text-gray-700"
          >
            Responsibilities
          </Label>
          <div className="relative mb-4">
            <ReactQuill
              id={`responsibilities-${index}`}
              value={exp.responsibilities?.join("\n") || ""}
              onChange={(value) => handleResponsibilitiesChange(value, index)}
              className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ size: [] }],
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image", "video"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "font",
                "size",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "list",
                "bullet",
                "link",
                "image",
                "video",
              ]}
            />
            <Button
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => {
                const newText = handleAIEdit(
                  exp.responsibilities?.join("\n") || "",
                );
                handleResponsibilitiesChange(newText, index);
              }}
            >
              AI Edit
            </Button>
          </div>
          <Button
            variant="destructive"
            onClick={() => handleDeleteField("experience", index)}
            className="mt-2"
          >
            Delete Experience
          </Button>
        </div>
      ))}
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
