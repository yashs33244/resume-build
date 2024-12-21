"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { ResumeProps } from "../../types/ResumeProps";
import dynamic from "next/dynamic";
import ReactQuill from "react-quill";
import "./styles/personal.scss";
import "react-quill/dist/quill.snow.css";
import { useProfileSession } from "../../hooks/useProfileSession"; // Adjust the import path as needed
import { LinkedInInput } from "../LinkedInInput";

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

  const [editorContent, setEditorContent] = useState(
    resumeData.personalInfo?.bio || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSummaryChange = (value: string) => {
    const summary = value.split("\n").filter((item) => item.trim() !== "");
    handleInputChange("personalInfo", "bio", summary);
  };

  useEffect(() => {
    if (user) {
      // Initialize name if it's empty and user.name exists
      if (!resumeData.personalInfo?.name && user.name) {
        handleInputChange("personalInfo", "name", user.name);
      }
      // Initialize email if it's empty and user.email exists
      if (!resumeData.personalInfo?.email && user.email) {
        handleInputChange("personalInfo", "email", user.email);
      }
    }
  }, [user, resumeData.personalInfo, handleInputChange]);

  return (
    <div className="personal-container">
      <div className="form-container">
        <div className="form-row first">
          <div className="row-form-field">
            <Label className="field-label" htmlFor="name">
              Full Name *
            </Label>
            <Input
              id="name"
              className="form-input"
              value={resumeData.personalInfo?.name || ""}
              type="text"
              onChange={(e) => {
                handleInputChange("personalInfo", "name", e.target.value);
              }}
              placeholder="Prakhar Gupta"
            />
          </div>
          <div className="row-form-field">
            <Label className="field-label" htmlFor="title">
              Job Title *
            </Label>
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
            <Label className="field-label" htmlFor="email">
              Email Address *
            </Label>
            <Input
              id="email"
              className="form-input"
              type="email"
              value={resumeData.personalInfo?.email || ""}
              onChange={(e) => {
                handleInputChange("personalInfo", "email", e.target.value);
              }}
              placeholder="prakhar_gupta@gmail.com"
            />
          </div>
          <div className="row-form-field">
            <Label className="field-label" htmlFor="phone">
              Phone Number *
            </Label>
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
            <Label className="field-label" htmlFor="website">
              Linkedin URL
            </Label>
            // In PersonalInfo component
            <LinkedInInput
              value={resumeData.personalInfo?.linkedin || ""}
              onChange={(value) =>
                handleInputChange("personalInfo", "linkedin", value)
              }
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <Label className="field-label" htmlFor="website">
              Other Links
            </Label>
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
        <div className="single-form-row">
          <div className="form-field">
            <Label htmlFor={`bio`} className="field-label">
              Professional Summary
            </Label>
            <textarea
              id="summary"
              className="form-input"
              // type="text"
              rows={5}
              value={resumeData.personalInfo?.bio || ""}
              onChange={(e) =>
                handleInputChange("personalInfo", "bio", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
