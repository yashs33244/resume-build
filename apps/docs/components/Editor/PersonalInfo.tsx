"use client";

import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { ResumeProps } from "../../types/ResumeProps";
import AiPrompt from "../Aiprompt";
import dynamic from "next/dynamic";

// Import ReactQuill normally
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Create a client-side only wrapper for ReactQuill
const ClientSideQuill = dynamic(() => Promise.resolve(ReactQuill), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface PersonalInfoProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
  ) => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  resumeData,
  handleInputChange,
}) => {
  const handleAiGeneration = async (prompt: string) => {
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
      handleInputChange("personalInfo", "bio", data);
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Personal Info</h2>
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={resumeData.personalInfo?.name || ""}
            onChange={(e) =>
              handleInputChange("personalInfo", "name", e.target.value)
            }
            placeholder="Name"
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={resumeData.personalInfo?.title || ""}
            onChange={(e) =>
              handleInputChange("personalInfo", "title", e.target.value)
            }
            placeholder="Title"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={resumeData.personalInfo?.website || ""}
            onChange={(e) =>
              handleInputChange("personalInfo", "website", e.target.value)
            }
            placeholder="Website"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={resumeData.personalInfo?.email || ""}
            onChange={(e) =>
              handleInputChange("personalInfo", "email", e.target.value)
            }
            placeholder="Email"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={resumeData.personalInfo?.phone || ""}
            onChange={(e) =>
              handleInputChange("personalInfo", "phone", e.target.value)
            }
            placeholder="Phone"
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <div className="flex items-start space-x-2">
            <div className="w-full">
              <ClientSideQuill
                id="bio"
                value={resumeData.personalInfo?.bio || ""}
                onChange={(value) =>
                  handleInputChange("personalInfo", "bio", value)
                }
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
              />
            </div>
            <AiPrompt onGenerate={handleAiGeneration} />
          </div>
        </div>
      </div>
    </div>
  );
};
