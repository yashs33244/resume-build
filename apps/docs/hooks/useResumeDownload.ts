import { useRecoilState } from "recoil";
import { isGeneratingPDFAtom } from "../store/pdfgenerating";
import { resumeTimeAtom } from "../store/expiry";

const useResumeDownload = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useRecoilState(isGeneratingPDFAtom);
  const [resumeTimes, setResumeTimes] = useRecoilState(resumeTimeAtom);

  const updateResumeTime = (id) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const timeLeft = Math.floor((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
    setResumeTimes((prev) => ({ ...prev, [id]: timeLeft }));
  };

  const handleDownload = async (id) => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById("wrapper");
      if (!element) throw new Error("Resume wrapper not found");
      element.style.transform = "scale(1)";

      // Add the CSS link directly in the HTML content
      const cssLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/(pages)/select-templates/editor/page.css">`;
      const htmlContent = cssLink + element.outerHTML;

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      updateResumeTime(id);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return { handleDownload, isGeneratingPDF };
};

export default useResumeDownload;