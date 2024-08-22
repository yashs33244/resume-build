"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { ResumeProps } from "../../types/ResumeProps";
import AiPrompt from "../Aiprompt";
import dynamic from "next/dynamic";
import ReactQuill from "react-quill";
import "./styles/personal.scss";
import { MdTipsAndUpdates } from "react-icons/md";
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
      if (!resumeData.personalInfo?.name?.name) {
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
    <div className="personal-container">
      <div className="form-container">
        <div className="form-row first">
          <div className="row-form-field">
            <Label className="field-label" htmlFor="name">Full Name</Label>
            <Input
              id="name"
              className="form-input"
              value={name}
              type="text"
              onChange={(e) => {
                setName(e.target.value);
                handleInputChange("personalInfo", "name", e.target.value);
              }}
              placeholder="Prakhar Gupta"
            />
          </div>
          <div className="row-form-field">
            <Label className="field-label" htmlFor="title">Current / Wanted Job Title</Label>
            <Input
            className="form-input"
              id="title"
              type="text"
              value={resumeData.personalInfo?.title || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "title", e.target.value)
              }
              placeholder="Senior Product Manager"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="row-form-field">
            <Label className="field-label" htmlFor="email">Email Address</Label>
            <Input
              id="email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange("personalInfo", "email", e.target.value);
              }}
              placeholder="prakhar_gupta@gmail.com"
            />
          </div>
          <div className="row-form-field">
            <Label className="field-label" htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              className="form-input"
              type="phone"
              value={resumeData.personalInfo?.phone || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "phone", e.target.value)
              }
              placeholder="+91 8630845133"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <Label className="field-label" htmlFor="website">Linkedin URL</Label>
            <Input
              id="website"
              className="form-input"
              type="text"
              value={resumeData.personalInfo?.website || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "website", e.target.value)
              }
              placeholder="For Eg : linkedin/com/in/pgpm"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <Label className="field-label" htmlFor="website">Other Links</Label>
            <Input
              id="website"
              className="form-input"
              type="text"
              value={resumeData.personalInfo?.website || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "website", e.target.value)
              }
              placeholder="Dribble / Github / Portfolio"
            />
          </div>
        </div>       
      </div>
    </div>
  );
};
