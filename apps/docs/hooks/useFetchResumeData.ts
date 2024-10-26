import { useEffect, useState } from "react";
import { ResumeProps } from "../types/ResumeProps"; // Adjust import path as needed

export function useFetchResumeData() {
  const [template, setTemplate] = useState<string>("fresher");
  const [resumeData, setResumeData] = useState<ResumeProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        // Check if window is available (client-side only)
        if (typeof window === "undefined") return;

        setLoading(true);
        const searchParams = new URLSearchParams(window.location.search);
        const resumeId = searchParams.get("id");

        if (!resumeId) {
          setError("Resume ID is required");
          return;
        }

        // Fetch resume data
        const response = await fetch(`/api/resume/getResume?resumeId=${resumeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching resume: ${response.statusText}`);
        }

        const data = await response.json();

        // Set resume data
        setResumeData(data);

        // Handle template selection
        let templateParam = data.templateId;
        
        if (!templateParam) {
          // If no template in resume data, check localStorage or default to "fresher"
          const storedTemplate = localStorage.getItem("resumeData.templateId");
          templateParam = storedTemplate || "fresher";
        }

        // Set template state and save to localStorage
        setTemplate(templateParam);
        localStorage.setItem("selectedTemplate", templateParam);

      } catch (err) {
        console.error("Error fetching resume data:", err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching resume data');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []); // Empty dependency array means this runs once on mount

  return { resumeData, template, setTemplate, loading, error };
}