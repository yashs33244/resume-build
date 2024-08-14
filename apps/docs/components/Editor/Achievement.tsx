"use client";

import React, { useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import dynamic from "next/dynamic";
import { ResumeProps } from "../../types/ResumeProps";

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

interface AchievementProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
  ) => void;
  handleDeleteField: (section: keyof ResumeProps) => void;
}

export const Achievement: React.FC<AchievementProps> = ({
  resumeData,
  handleInputChange,
  handleDeleteField,
}) => {
  const [editorContent, setEditorContent] = useState(
    resumeData.achievement?.description || "",
  );
  const [isLoading, setIsLoading] = useState(false);

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
          "#achievement-description .ql-editor",
        ) as HTMLElement;
        if (quillEditor) {
          const start = range.startOffset;
          const end = range.endOffset;
          const newContent =
            quillEditor.innerHTML.slice(0, start) +
            data +
            quillEditor.innerHTML.slice(end);
          setEditorContent(newContent);
          handleInputChange("achievement", "description", newContent);
        }
      } else {
        setEditorContent(data);
        handleInputChange("achievement", "description", data);
      }
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const aiPrompts = ["Fix Grammar", "Fix Spelling", "Summarize", "Enhance"];

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-3xl mb-6">
        Achievement
      </h2>
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="achievement-title">Title</Label>
          <Input
            id="achievement-title"
            value={resumeData.achievement?.title || ""}
            onChange={(e) =>
              handleInputChange("achievement", "title", e.target.value)
            }
            placeholder="Title"
          />
        </div>
        <div>
          <Label htmlFor="achievement-description">Description</Label>
          <div className="flex flex-col items-start space-y-2">
            <div className="w-full relative">
              <ClientSideQuill
                id="achievement-description"
                value={editorContent}
                onChange={(value) => {
                  setEditorContent(value);
                  handleInputChange("achievement", "description", value);
                }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
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
        <Button
          variant="destructive"
          onClick={() => handleDeleteField("achievement")}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
