import React from "react";
import { ProgressPhase } from "../hooks/useResumeUpload";
import "./ResumeUploadProgress.scss";

interface ResumeUploadProgressProps {
  isLoading: boolean;
  progress: number;
  progressPhase: ProgressPhase;
  error?: string;
}

export const ResumeUploadProgress: React.FC<ResumeUploadProgressProps> = ({
  isLoading,
  progress,
  progressPhase,
  error,
}) => {
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

  if (!isLoading && !error) return null;

  return (
    <div className="upload-progress-container">
      {isLoading && (
        <div className="upload-progress">
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-text">
            {getProgressMessage()} {progress}%
          </p>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

// styles/ResumeUploadProgress.scss
