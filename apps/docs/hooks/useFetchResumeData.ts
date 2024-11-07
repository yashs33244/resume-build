import { useEffect, useState } from "react";
import { ResumeProps } from "../types/ResumeProps"; // Adjust import path as needed
import { initialResumeData } from "../utils/resumeData";

export function useFetchResumeData() {
  const [template, setTemplate] = useState<string>("");
  const [rdata, setrdata] = useState<ResumeProps>(initialResumeData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | "">("");

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
        setId(resumeId);


        // Fetch resume resumeData
        const response = await fetch(`/api/resume/getResume?resumeId=${resumeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching resume: ${response.statusText}`);
        }
        


        const resumeData = await response.json();
        console.log("Fetched Resume Data:", resumeData);
        
        // Set resume resumeData
        setrdata(resumeData);

        // Handle template selection
        let templateParam = resumeData.templateId;
        
        if (!templateParam) {
          // If no template in resume resumeData, check localStorage or pdefault to "fresher"
          const storedTemplate = localStorage.getItem("resumeData.templateId");
          templateParam = storedTemplate ;
        }

        // Set template state and save to localStorage
        setTemplate(templateParam);
        localStorage.setItem("selectedTemplate", templateParam);
        window.localStorage.setItem("resumeData", JSON.stringify(resumeData));
        


      } catch (err) {
        console.error("Error fetching resume resumeData:", err);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching resume resumeData');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []); // Empty dependency array means this runs once on mount

  return { rdata, template, setTemplate, loading, error , id};
}