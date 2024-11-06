import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProfileSession } from "./useProfileSession";
import { ResumeProps } from "../types/ResumeProps";

export function useSaveResume() {
  const router = useRouter();
  const { user, status } = useProfileSession();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveResume = async (resumeData: ResumeProps, template: string) => {
    console.log(resumeData);
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/resume/saveResume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          template,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error saving resume: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Resume saved successfully");
      
      // Redirect to editor with the resume ID
      if (data.resumeId) {
        router.push(`/select-templates/editor?id=${data.resumeId}`);
      } else {
        throw new Error('Resume ID not received from server');
      }

      return data.resumeId;
    } catch (error) {
      console.error("Error saving resume:", error);
      setError(error instanceof Error ? error.message : 'An error occurred while saving the resume');
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveResume, isSaving, error };
}