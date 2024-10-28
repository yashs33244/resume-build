"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import file_upload from "./File_Upload.png";
import file_add from "./File_Add.png";

import "./CreatePreference.scss";
import { ResumeProps, ResumeState } from "../types/ResumeProps";
import { useSaveResume } from "../hooks/useSaveResume";

type LandingPageTemplateType = "classic" | "modern" | "bold";
type ActualTemplateType = "fresher" | "experienced" | "designer";

// Correct Record definition
const reverseTemplateMapping: Record<
  LandingPageTemplateType,
  ActualTemplateType
> = {
  classic: "fresher",
  modern: "experienced",
  bold: "designer",
};

export default function CreatePreference() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { saveResume, isSaving } = useSaveResume();
  const searchParams = useSearchParams();

  const processSkills = (skills: string[]) => {
    // Remove duplicates and empty strings
    return Array.from(new Set(skills.filter((skill) => skill.trim())));
  };

  const template = searchParams.get("template");
  const fromLanding = searchParams.get("fromLanding");

  useEffect(() => {
    // Store the template in localStorage when component mounts
    if (template && fromLanding === "true") {
      localStorage.setItem("preSelectedTemplate", template);
      localStorage.setItem("fromLandingPage", "true");
    }
  }, [template, fromLanding]);

  const handleUploadSuccess = async (resumeData: ResumeProps) => {
    if (template && fromLanding === "true") {
      // Convert landing page template name to actual template ID
      const actualTemplate =
        reverseTemplateMapping[template as LandingPageTemplateType];

      try {
        // Save the resume with the selected template
        const resumeId = await saveResume(resumeData, actualTemplate);
        // Redirect directly to editor with the new resume ID
        router.push(`/select-templates/editor?id=${resumeId}`);
      } catch (error) {
        console.error("Failed to save resume:", error);
        router.push("/select-templates");
      }
    } else {
      // Normal flow - go to template selection
      router.push("/select-templates");
    }
  };

  const formatBulletPoints = (points: string[]) => {
    return points.map((point) => {
      // Ensure each point starts with an action verb
      const trimmedPoint = point.trim();
      // Remove articles from the beginning
      const withoutArticles = trimmedPoint.replace(/^(the|a|an)\s+/i, "");
      // Capitalize first letter
      return withoutArticles.charAt(0).toUpperCase() + withoutArticles.slice(1);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: any) => {
      const file = acceptedFiles[0];
      if (file) {
        setIsLoading(true);
        setError("");
        setUploadProgress(0);

        try {
          const formData = new FormData();
          formData.append("resume", file);

          const response = await fetch("/api/resume/parseResume", {
            method: "POST",
            body: formData,
            //@ts-ignore
            onUploadProgress: (progressEvent: any) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setUploadProgress(percentCompleted);
            },
          });

          if (!response.ok) {
            throw new Error(
              `Failed to process the resume. Server responded with status ${response.status}`,
            );
          }

          const parsedData = await response.json();

          // Transform parsed data with improved formatting
          const resumeData: ResumeProps = {
            userId: parsedData.userId || "user-id",
            personalInfo: {
              name: parsedData.personalInfo?.name || "",
              title: parsedData.personalInfo?.title || "",
              email: parsedData.personalInfo?.email || "",
              phone: parsedData.personalInfo?.phone || "",
              location: parsedData.personalInfo?.location || "",
              linkedin: parsedData.personalInfo?.linkedin || "",
              website: parsedData.personalInfo?.website || "",
              bio: parsedData.personalInfo?.bio || "",
            },
            education:
              parsedData.education?.map((edu: any) => ({
                institution: edu.institution || "",
                major: edu.major || "",
                start: edu.start || "",
                end: edu.end || "",
                degree: edu.degree || "",
                score: edu.score || null,
              })) || [],
            experience:
              parsedData.experience?.map((exp: any) => ({
                company: exp.company || "",
                role: exp.role || "",
                start: exp.start || "",
                end: exp.end || "",
                responsibilities: formatBulletPoints(
                  exp.responsibilities || [],
                ),
                current: exp.current || false,
              })) || [],
            // Process and categorize skills
            skills: processSkills(parsedData.skills || []),
            coreSkills: processSkills(parsedData.coreSkills || []),
            languages: processSkills(parsedData.languages || []),
            projects:
              parsedData.projects?.map((proj: any) => ({
                name: proj.name || "",
                link: proj.link || "",
                start: proj.start || "",
                end: proj.end || "",
                responsibilities: formatBulletPoints(
                  proj.responsibilities || [],
                ),
              })) || [],
            certificates:
              parsedData.certificates?.map((cert: any) => ({
                name: cert.name || "",
                issuer: cert.issuer || "",
                issuedOn: cert.issuedOn || "",
              })) || [],
            state: ResumeState.EDITING,
            templateId: parsedData.templateId || "default-template",
          };

          localStorage.setItem("resumeData", JSON.stringify(resumeData));
          await handleUploadSuccess(resumeData);
        } catch (error) {
          console.error("Error in file upload:", error);
          setError(
            error instanceof Error
              ? error.message
              : "Failed to process the resume.",
          );
        } finally {
          setIsLoading(false);
        }
      }
    },
    [router],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
  });

  const handleStartFromScratch = async () => {
    const emptyResumeData: ResumeProps = {
      userId: "user-id",
      personalInfo: {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
      },
      education: [],
      experience: [],
      skills: [],
      coreSkills: [],

      languages: [],
      projects: [],
      certificates: [],
      state: ResumeState.EDITING,
      templateId: "fresher",
    };
    localStorage.setItem("resumeData", JSON.stringify(emptyResumeData));
    await handleUploadSuccess(emptyResumeData);
  };

  return (
    <div className="preference-container">
      <div className="content-container">
        <div className="left" {...getRootProps()}>
          <input {...getInputProps()} />
          <Image alt="upload" src={file_upload} width={150} height={150} />
          <div className="action">Upload Existing Resume</div>
          <div className="info">Autofill details using your current resume</div>
          {isLoading && (
            <div className="upload-progress">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p>Processing resume... {uploadProgress}%</p>
            </div>
          )}
          {error && <div className="error">{error}</div>}
        </div>
        <div className="right" onClick={handleStartFromScratch}>
          <Image alt="add" src={file_add} width={150} height={150} />
          <div className="action">Create From Scratch</div>
          <div className="info">Craft your perfect resume from start</div>
        </div>
      </div>
    </div>
  );
}
