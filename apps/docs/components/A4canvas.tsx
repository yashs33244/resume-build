import React, { useRef, useEffect, useState } from "react";
import Resume from "./resumes/Resume_one";
import { ResumeProps } from "../types/ResumeProps";
import { Button } from "@ui/components/ui/button";
import { useResumeDownload } from "../hooks/useResumeDownload";

const A4_WIDTH = 550; // A4 width in pixels at 72 DPI
const A4_HEIGHT = 700; // A4 height in pixels at 72 DPI

export const A4Canvas: React.FC<{ resumeData: ResumeProps }> = ({
  resumeData,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [isFullPage, setIsFullPage] = useState(false);
  const [zoom, setZoom] = useState(1);
  const handleDownload = useResumeDownload(resumeData);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const contentHeight = container.scrollHeight;
      if (contentHeight > A4_HEIGHT) {
        setScale(A4_HEIGHT / contentHeight);
      } else {
        setScale(1);
      }
    }
  }, [resumeData]);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));
  };

  const toggleFullPage = () => {
    setIsFullPage(!isFullPage);
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white">
            <span className="mr-2">☷</span> Select template
          </Button>
          <div className="flex items-center space-x-2 text-white">
            <Button
              variant="ghost"
              className="text-white px-2"
              onClick={handleZoomOut}
            >
              -
            </Button>
            <span>Aa</span>
            <Button
              variant="ghost"
              className="text-white px-2"
              onClick={handleZoomIn}
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
              console.log("Download button clicked");
              handleDownload();
            }} // Make sure this is correctly attached
          >
            Download PDF
          </Button>
          <Button variant="ghost" className="text-white">
            ...
          </Button>
          <Button variant="ghost" className="text-white">
            ⬡
          </Button>
        </div>
      </div>
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
          isFullPage ? "fixed inset-0 z-50" : ""
        }`}
        style={{
          width: isFullPage ? "100%" : `${A4_WIDTH}px`,
          height: isFullPage ? "100%" : `${A4_HEIGHT}px`,
          margin: isFullPage ? "0" : "0 auto",
        }}
      >
        <div
          id="resume"
          ref={containerRef}
          style={{
            transform: `scale(${scale * zoom})`,
            transformOrigin: "top left",
            width: `${100 / (scale * zoom)}%`,
            height: `${Math.max(100 / (scale * zoom), 100)}%`,
            transition: "transform 0.3s ease",
          }}
        >
          <Resume {...resumeData} />
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center text-white">
        <div className="text-sm">✓ Saved</div>
        <div className="flex items-center space-x-2">
          <span>1 / 1</span>
        </div>
        <Button variant="ghost" className="text-white" onClick={toggleFullPage}>
          ⤢
        </Button>
      </div>
    </div>
  );
};
