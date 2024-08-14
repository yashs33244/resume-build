"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { ResumeProps } from "../../types/ResumeProps";
import AiPrompt from "../Aiprompt";
import dynamic from "next/dynamic";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useProfileSession } from "../../hooks/useProfileSession"; // Adjust the import path as needed

const ClientSideQuill = dynamic(() => Promise.resolve(ReactQuill), {
  ssr: false,
  loading: () => (
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
    </div>
  ),
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
  const { user } = useProfileSession();
  const [name, setName] = useState(resumeData.personalInfo?.name || "");
  const [email, setEmail] = useState(resumeData.personalInfo?.email || "");
  const [editorContent, setEditorContent] = useState(
    resumeData.personalInfo?.bio || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (!resumeData.personalInfo?.name) {
        setName(user.name || "");
        handleInputChange("personalInfo", "name", user.name || "");
      }
      if (!resumeData.personalInfo?.email) {
        setEmail(user.email || "");
        handleInputChange("personalInfo", "email", user.email || "");
      }
    }
  }, [user, resumeData.personalInfo, handleInputChange]);

  const handleAiGeneration = async (prompt: string) => {
    setIsLoading(true);
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
          "#bio .ql-editor",
        ) as HTMLElement;
        if (quillEditor) {
          const start = range.startOffset;
          const end = range.endOffset;
          const newContent =
            quillEditor.innerHTML.slice(0, start) +
            data +
            quillEditor.innerHTML.slice(end);
          setEditorContent(newContent);
          handleInputChange("personalInfo", "bio", newContent);
        }
      } else {
        setEditorContent(data);
        handleInputChange("personalInfo", "bio", data);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const aiPrompts = ["Fix Grammer", "Fix Spelling", "Summarize", "ask AI"];

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-3xl mb-6">
        Personal Info
      </h2>
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleInputChange("personalInfo", "name", e.target.value);
            }}
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleInputChange("personalInfo", "email", e.target.value);
            }}
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
          <div className="flex flex-col items-start space-y-2">
            <div className="w-full relative">
              <ClientSideQuill
                id="bio"
                value={editorContent}
                onChange={(value) => {
                  setEditorContent(value);
                  handleInputChange("personalInfo", "bio", value);
                }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                className="rounded-lg shadow-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                  <div className="flex space-x-2 animate-pulse">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {aiPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const selection = window.getSelection()?.toString();
                    const textToUse = selection || editorContent;
                    handleAiGeneration(`${prompt}: ${textToUse}`);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
