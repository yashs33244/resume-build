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

type LandingPageTemplateType = "classic" | "modern" | "bold";
type ActualTemplateType = "fresher" | "experienced" | "designer";

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
  const [selectedOption, setSelectedOption] = useState<
    "upload" | "scratch" | null
  >(null);
  const { saveResume, isSaving } = useSaveResume();
  const searchParams = useSearchParams();

  const handleUploadSuccess = async (resumeData: ResumeProps) => {
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
    }
  };

  const { error, isLoading, progress, progressPhase, handleFileUpload } =
    useResumeUpload({
      onUploadSuccess: handleUploadSuccess,
    });

  const template = searchParams.get("template");
  const fromLanding = searchParams.get("fromLanding");

  useEffect(() => {
    if (template && fromLanding === "true") {
      localStorage.setItem("preSelectedTemplate", template);
      localStorage.setItem("fromLandingPage", "true");
    }
  }, [template, fromLanding]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (isLoading || isProcessing || selectedOption) return;
      const file = acceptedFiles[0];
      if (file) {
        setSelectedOption("upload");
        await handleFileUpload(file);
      }
    },
    [handleFileUpload, isLoading, isProcessing, selectedOption],
  );

  const handleStartFromScratch = async () => {
    if (isProcessing || selectedOption) return;

    setSelectedOption("scratch");
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
      resumeId: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("resumeData", JSON.stringify(emptyResumeData));

    // Show progress for "Create from Scratch" option
    const fakeProgress = { current: 0 };
    const progressInterval = setInterval(() => {
      fakeProgress.current += 2;
      if (fakeProgress.current >= 100) {
        clearInterval(progressInterval);
        handleUploadSuccess(emptyResumeData);
      }
    }, 50);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    multiple: false,
    disabled: isLoading || isProcessing || selectedOption !== null,
  });

  return (
    <div className="preference-container">
      <div className="content-container">
        <div
          className={`left ${selectedOption && selectedOption !== "upload" ? "disabled" : ""}`}
          {...(selectedOption === null ? getRootProps() : {})}
        >
          <input {...getInputProps()} disabled={selectedOption !== null} />
          <Image
            alt="upload"
            src={file_upload}
            width={150}
            height={150}
            className={
              selectedOption && selectedOption !== "upload" ? "opacity-50" : ""
            }
          />
          <div
            className={`action ${selectedOption && selectedOption !== "upload" ? "opacity-50" : ""}`}
          >
            Upload Existing Resume
          </div>
          <div
            className={`info ${selectedOption && selectedOption !== "upload" ? "opacity-50" : ""}`}
          >
            Autofill details using your current resume
          </div>
          {(isLoading || selectedOption === "upload") && (
            <ResumeUploadProgress
              isLoading={true}
              progress={progress}
              progressPhase={progressPhase}
              error={error}
            />
          )}
        </div>
        <div
          className={`right ${selectedOption && selectedOption !== "scratch" ? "disabled" : ""}`}
          onClick={selectedOption === null ? handleStartFromScratch : undefined}
        >
          <Image
            alt="add"
            src={file_add}
            width={150}
            height={150}
            className={
              selectedOption && selectedOption !== "scratch" ? "opacity-50" : ""
            }
          />
          <div
            className={`action ${selectedOption && selectedOption !== "scratch" ? "opacity-50" : ""}`}
          >
            Create From Scratch
          </div>
          <div
            className={`info ${selectedOption && selectedOption !== "scratch" ? "opacity-50" : ""}`}
          >
            Craft your perfect resume from start
          </div>
          {selectedOption === "scratch" && (
            <ResumeUploadProgress
              isLoading={true}
              progress={0}
              progressPhase="parsing"
              error={undefined}
            />
          )}
        </div>
      </div>
      {/* <div className="loader-container">
        <div className="left">
            <ResumeUploadProgress
                isLoading={isLoading}
                progress={progress}
                progressPhase={progressPhase}
                error={error}
            />
        </div>
        <div className="right">{' '}</div>
      </div>       */}
      <style jsx>{`
        .disabled {
          pointer-events: none;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
