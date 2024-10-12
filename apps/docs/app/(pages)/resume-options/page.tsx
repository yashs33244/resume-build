"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFileText, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { Alert, AlertTitle } from "@mui/material";

export default function ResumeOptions() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles) => {
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
            onUploadProgress: (progressEvent) => {
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

          const resumeData = await response.json();
          localStorage.setItem("resumeData", JSON.stringify(resumeData));
          router.push("/select-templates/editor");
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

  const handleStartFromScratch = () => {
    localStorage.removeItem("resumeData");
    router.push("/select-templates/editor");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Resume Builder
        </h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Upload Existing Resume
            </h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? "Drop the file here"
                  : "Drag and drop your resume here, or click to select a file"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, PNG, JPG
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Processing resume... {uploadProgress}%
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <FiAlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <p>{error}</p>
            </Alert>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Start from Scratch
            </h2>
            <button
              onClick={handleStartFromScratch}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
              disabled={isLoading}
            >
              <FiFileText className="mr-2" />
              Create New Resume
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
