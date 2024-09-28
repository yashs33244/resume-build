import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProfileSession } from "./useProfileSession";
import { ResumeProps } from "../types/ResumeProps";

export function useSaveResume() {
  const router = useRouter();
  const { user, status } = useProfileSession();
  const [isSaving, setIsSaving] = useState(false);

  const saveResume = async (resumeData: ResumeProps, template: string) => {
 

    setIsSaving(true);

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

      console.log("Resume saved successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving resume:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return { saveResume, isSaving };
}
