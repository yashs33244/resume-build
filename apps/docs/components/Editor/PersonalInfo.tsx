"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { ResumeProps } from "../../types/ResumeProps";
import { useProfileSession } from "../../hooks/useProfileSession";
import { LinkedInInput } from "../LinkedInInput";
import { useToast } from "@ui/hooks/use-toast";
import { personalInfoSchema, PersonalInfoSchema } from "../../types/validation";
import "./styles/personal.scss";

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
  const { toast } = useToast();
  const [warnings, setWarnings] = useState<
    Partial<Record<keyof PersonalInfoSchema, string>>
  >({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const conciseWarnings: Partial<Record<keyof PersonalInfoSchema, string>> = {
    name: "Enter your full name.",
    title: "Provide your job title.",
    email: "Enter a valid email address.",
    phone: "Enter a valid phone number.",
    linkedin: "Enter your LinkedIn profile URL.",
    website: "Provide a valid link (e.g., GitHub, portfolio).",
    bio: "Provide a brief professional summary.",
  };

  const validateField = (field: keyof PersonalInfoSchema, value: string) => {
    try {
      personalInfoSchema.shape[field].parse(value);
      setWarnings((prev) => {
        const newWarnings = { ...prev };
        delete newWarnings[field];
        return newWarnings;
      });
      return true;
    } catch {
      setWarnings((prev) => ({
        ...prev,
        [field]: conciseWarnings[field] || "",
      }));

      // Only show toast for warnings when user is actively typing
      if (!isInitialLoad) {
        toast({
          variant: "default",
          title: "Validation Warning",
          description: conciseWarnings[field],
        });
      }
      return false;
    }
  };

  const handleChange = (field: keyof PersonalInfoSchema, value: string) => {
    setIsInitialLoad(false);
    validateField(field, value);
    handleInputChange("personalInfo", field, value);
  };

  useEffect(() => {
    if (user && isInitialLoad) {
      // Only set default values if the fields are empty
      if (!resumeData.personalInfo?.name) {
        handleInputChange("personalInfo", "name", user.name || "");
      }
      if (!resumeData.personalInfo?.email) {
        handleInputChange("personalInfo", "email", user.email || "");
      }
      setIsInitialLoad(false);
    }
  }, [user]);

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
              className={`form-input ${warnings.name ? "border-yellow-500" : ""}`}
              value={resumeData.personalInfo?.name || ""}
              type="text"
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Prakhar Gupta"
            />
            {warnings.name && (
              <span className="text-sm text-yellow-500">{warnings.name}</span>
            )}
          </div>
          <div className="row-form-field">
            <Label className="field-label" htmlFor="title">
              Job Title *
            </Label>
            <Input
              id="title"
              className={`form-input ${warnings.title ? "border-yellow-500" : ""}`}
              type="text"
              value={resumeData.personalInfo?.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Senior Product Manager"
            />
            {warnings.title && (
              <span className="text-sm text-yellow-500">{warnings.title}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="row-form-field">
            <Label className="field-label" htmlFor="email">
              Email Address *
            </Label>
            <Input
              id="email"
              className={`form-input ${warnings.email ? "border-yellow-500" : ""}`}
              type="email"
              value={resumeData.personalInfo?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="prakhar_gupta@gmail.com"
            />
            {warnings.email && (
              <span className="text-sm text-yellow-500">{warnings.email}</span>
            )}
          </div>
          <div className="row-form-field">
            <Label className="field-label" htmlFor="phone">
              Phone Number *
            </Label>
            <Input
              id="phone"
              className={`form-input ${warnings.phone ? "border-yellow-500" : ""}`}
              type="tel"
              value={resumeData.personalInfo?.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 8630845133"
            />
            {warnings.phone && (
              <span className="text-sm text-yellow-500">{warnings.phone}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <LinkedInInput
              value={resumeData.personalInfo?.linkedin || ""}
              onChange={(value) => handleChange("linkedin", value)}
            />
            {warnings.linkedin && (
              <span className="text-sm text-yellow-500">
                {warnings.linkedin}
              </span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <Label className="field-label" htmlFor="website">
              Other Links
            </Label>
            <Input
              id="website"
              className={`form-input ${warnings.website ? "border-yellow-500" : ""}`}
              type="url"
              value={resumeData.personalInfo?.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="Dribble / Github / Portfolio"
            />
            {warnings.website && (
              <span className="text-sm text-yellow-500">
                {warnings.website}
              </span>
            )}
          </div>
        </div>

        <div className="single-form-row">
          <div className="form-field">
            <Label htmlFor="bio" className="field-label">
              Professional Summary
            </Label>
            <textarea
              id="bio"
              className={`form-input ${warnings.bio ? "border-yellow-500" : ""}`}
              rows={5}
              value={resumeData.personalInfo?.bio || ""}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
            {warnings.bio && (
              <span className="text-sm text-yellow-500">{warnings.bio}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
