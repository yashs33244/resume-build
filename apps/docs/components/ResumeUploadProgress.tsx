import React, { useState, useEffect } from "react";

interface ResumeUploadProgressProps {
  isLoading: boolean;
  progress: number;
  progressPhase: "upload" | "parsing" | "complete";
  error?: string;
  onComplete?: () => void; // Added completion callback
}

export const ResumeUploadProgress: React.FC<ResumeUploadProgressProps> = ({
  isLoading,
  progress: externalProgress,
  progressPhase: externalPhase,
  error,
  onComplete,
}) => {
  const [smoothProgress, setSmoothProgress] = useState(0);
  const [internalPhase, setInternalPhase] = useState(externalPhase);
  const [hasReachedComplete, setHasReachedComplete] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setSmoothProgress(0);
      setHasReachedComplete(false);
      return;
    }

    const progressInterval = setInterval(() => {
      setSmoothProgress((prev) => {
        // Always move forward, but speed varies based on current progress
        let increment;

        if (prev < 30) {
          increment = 0.8; // Fast at start
        } else if (prev < 60) {
          increment = 0.5; // Medium speed
        } else if (prev < 85) {
          increment = 0.3; // Slower
        } else {
          increment = 0.2; // Very slow near the end
        }

        const newProgress = Math.min(prev + increment, 100);

        // Update phases based on progress
        if (newProgress >= 70) {
          setInternalPhase("complete");
        } else if (newProgress >= 30) {
          setInternalPhase("parsing");
        }

        // Call onComplete when reaching 100%
        if (newProgress === 99 && !hasReachedComplete) {
          setHasReachedComplete(true);
          setTimeout(() => {
            onComplete?.();
          }, 200); // Small delay to ensure animation is visible
        }

        return newProgress;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isLoading, hasReachedComplete, onComplete]);

  const getProgressMessage = () => {
    switch (internalPhase) {
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
            <div
              className="progress-bar"
              style={{
                width: `${smoothProgress}%`,
                transition: "width 0.3s ease-out",
              }}
            >
              <div
                className="shimmer"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            </div>
          </div>
          <p className="progress-text">
            {getProgressMessage()} {Math.round(smoothProgress)}%
          </p>
        </div>
      )}
      {error && <div className="error">{error}</div>}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .upload-progress-container {
          width: 100%;
          margin-top: 1rem;
        }

        .upload-progress {
          width: 100%;
        }

        .progress-bar-wrapper {
          width: 100%;
          height: 4px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          height: 100%;
          background-color: #2563eb;
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
        }

        .error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};
