import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseDownloadProps {
  isPaid: boolean;
  setIsGeneratingPDF: (value: boolean) => void;
  resumes?: any[];
  setResumes?: (resumes: any[]) => void;
  searchParams?: URLSearchParams;
  tailoredResumeData?: any;
  resumeData?: any;
  setDownloadingId?: (id: string | null) => void;
}

const TEMPLATE_NAME_MAPPING = {
  fresher: "template1",
  experienced: "template2",
  designer: "template3",
};

const TEMPLATE_CSS_MAP = {
  fresher: "https://utfs.io/f/Clj1dqnLZKkyaWv9BvzoiLk2AQdWuZafvXHeBrEhSKFn7Ngz",
  experienced: "https://utfs.io/f/Clj1dqnLZKkyHgL3tfqELCqQuhUwYHrz3lnvt0fTa4y5IgsW",
  designer: "https://utfs.io/f/Clj1dqnLZKky41CMBCeRQv1SI8iXB29JT3FDwqKozgGr4Zhu",
};

export const useDownload = ({
  isPaid,
  setIsGeneratingPDF,
  resumes,
  setResumes,
  setDownloadingId,
  searchParams,
  tailoredResumeData,
  resumeData
}: UseDownloadProps) => {
  const router = useRouter();

  const handleDownload = useCallback(async (
    resumeId: string, 
    templateId?: string, 
    data?: any, 
    prevRoute?: string
  ) => {
    // Payment check for non-tailored resume pages
    if (!isPaid && !data) {
      router.push(`/select-templates/checkout?id=${resumeId}`);
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Enhanced wrapper detection logic
      let realElement: Element | null = null;

      // Comprehensive wrapper finding function
      const findWrapper = () => {
        const selectors = [
          '#wrapper',
          '.resume-wrapper', 
          '.resume-preview', 
          '.wrapper',
          `.resumeParent-${resumeId} .wrapper`
        ];

        for (const selector of selectors) {
          const wrapper = document.querySelector(selector);
          if (wrapper) return wrapper;
        }

        return null;
      };

      realElement = findWrapper();

      if (!realElement) {
        throw new Error("Resume wrapper not found. Please ensure the resume is fully loaded.");
      }

      const element = realElement.cloneNode(true) as HTMLElement;
      element.style.transform = "scale(1)";

      // Determine template name and CSS
      const templateName = 
        TEMPLATE_NAME_MAPPING[
          (templateId || resumeData?.templateId) as keyof typeof TEMPLATE_NAME_MAPPING
        ];
      
      const templateCssUrl = 
        TEMPLATE_CSS_MAP[
          (templateId || resumeData?.templateId) as keyof typeof TEMPLATE_CSS_MAP
        ];

      // Fetch template-specific CSS
      const cssResponse = await fetch(templateCssUrl);
      const cssText = await cssResponse.text();

      // Construct full HTML with inline styles
      const styleTag = `
        <style>
          ${cssText}
          /* Additional global styles */
          body { font-family: 'Inter', sans-serif; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
        </style>
      `;

      const fontLink = `
        <link href='https://fonts.googleapis.com/css?family=Inter' rel='stylesheet'/>
      `;

      // Combine all elements
      const fullHtmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          ${styleTag}
          ${fontLink}
        </head>
        <body>
          ${element.outerHTML}
        </body>
        </html>
      `;

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: fullHtmlContent,
          resumeId: resumeId || searchParams?.get("id"),
          isTailored: data === tailoredResumeData,
        }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      
      // Filename logic
      const filename = data === tailoredResumeData 
        ? "finalcv_resume.pdf" 
        : "resume.pdf";
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // Update resumes state if applicable
      if (resumes && setResumes) {
        const updatedResumes = resumes.map((resume: any) => {
          if (resume?.resumeData?.resumeId === resumeId) {
            return {
              ...resume,
              resumeState: "DOWNLOAD_SUCCESS",
            };
          }
          return resume;
        });
        setResumes(updatedResumes);
      }

      // Navigate to previous route for tailored resume
      if (data === tailoredResumeData) {
        router.push(prevRoute || "/dashboard");
      }
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      // User-friendly error handling
      alert("Failed to generate PDF. Please check if the resume is fully loaded.");
    } finally {
      setIsGeneratingPDF(false);
      if (setDownloadingId) {
        setDownloadingId(null);
      }
    }
  }, [
    isPaid, 
    setIsGeneratingPDF, 
    resumes, 
    setResumes, 
    setDownloadingId,
    searchParams, 
    tailoredResumeData, 
    resumeData
  ]);

  return handleDownload;
};