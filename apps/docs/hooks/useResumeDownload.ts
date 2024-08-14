import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeProps } from '../types/ResumeProps';

export const useResumeDownload = (resumeData: ResumeProps) => {
  const handleDownload = async () => {
    const element = document.querySelector("#resume");
    if (!element) {
      console.error("Resume element not found");
      return;
    }

    try {
      console.log("Starting PDF generation");
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 4,
        logging: false,
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

      const canvasWidth = canvas.width * ratio;
      const canvasHeight = canvas.height * ratio;

      const marginX = (pageWidth - canvasWidth) / 2;
      const marginY = (pageHeight - canvasHeight) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        marginX,
        marginY,
        canvasWidth,
        canvasHeight,
        undefined,
        "FAST"
      );

      pdf.save("resume.pdf");

      // Save resume data to the database
      const response = await fetch("/api/saveResume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: resumeData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save resume");
      }

    } catch (error) {
      console.error("Error in handleDownload:", error);
    }
  };

  return handleDownload;
};