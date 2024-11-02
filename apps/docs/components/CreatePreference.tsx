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
import { useResumeUpload } from "../hooks/useResumeUpload";
import { ResumeUploadProgress } from "./ResumeUploadProgress";
import { Loader } from "lucide-react";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const { saveResume, isSaving } = useSaveResume();
  const searchParams = useSearchParams();

  const handleUploadSuccess = async (resumeData: ResumeProps) => {
    setIsProcessing(true);
    try {
      if (template && fromLanding === "true") {
        const actualTemplate =
          reverseTemplateMapping[template as LandingPageTemplateType];
        const resumeId = await saveResume(resumeData, actualTemplate);
        router.push(`/select-templates/editor?id=${resumeId}`);
      } else {
        router.push("/select-templates");
      }
    } catch (error) {
      console.error("Failed to save resume:", error);
      router.push("/select-templates");
    } finally {
      setIsProcessing(false);
    }
  };

  const { error, isLoading, progress, progressPhase, handleFileUpload } =
    useResumeUpload({
      onUploadSuccess: handleUploadSuccess,
    });

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
    async (acceptedFiles: File[]) => {
      if (isLoading || isProcessing) return; // Prevent multiple uploads
      const file = acceptedFiles[0];
      if (file) {
        await handleFileUpload(file);
      }
    },
    [handleFileUpload, isLoading, isProcessing],
  );

  const LoadingUI = () => {
    const getProgressMessage = () => {
      switch (progressPhase) {
        case "upload":
          return "Uploading resume...";
        case "parsing":
          return "Processing resume content...";
        case "complete":
          return "Finalizing...";
        default:
          return "Processing...";
      }
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
    disabled: isLoading || isProcessing,
  });

  const handleStartFromScratch = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
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
      templateId: "",
    };
    localStorage.setItem("resumeData", JSON.stringify(emptyResumeData));
    await handleUploadSuccess(emptyResumeData);
  };

  return (
    <div className="preference-container">
      <div className="content-container">
        <div
          className={`left ${isLoading || isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} disabled={isLoading || isProcessing} />
          {isLoading || isProcessing ? (
            <Loader className="w-8 h-8 animate-spin mb-4" />
          ) : (
            <Image alt="upload" src={file_upload} width={150} height={150} />
          )}
          {/* <Image alt="upload" src={file_upload} width={150} height={150} /> */}
          <div className="action">Upload Existing Resume</div>
          <div className="info">Autofill details using your current resume</div>
          <ResumeUploadProgress
            isLoading={isLoading}
            progress={progress}
            progressPhase={progressPhase}
            error={error}
          />
        </div>
        <div
          className={`right ${isLoading || isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={
            isLoading || isProcessing ? undefined : handleStartFromScratch
          }
        >
          {isProcessing ? (
            <Loader className="w-8 h-8 animate-spin mb-4" />
          ) : (
            <Image alt="add" src={file_add} width={150} height={150} />
          )}
          <div className="action">Create From Scratch</div>
          <div className="info">Craft your perfect resume from start</div>
        </div>
      </div>
    </div>
  );
}
