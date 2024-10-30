import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRecoilValue } from "recoil";
import { useSession } from "next-auth/react";
import {
  actualTemplateSelector,
  useSetTemplateAndUpdateURL,
} from "../store/templatesState";
import { useSaveResume } from "../hooks/useSaveResume";
import { useFetchResumeData } from "../hooks/useFetchResumeData";
import { ResumeProps } from "../types/ResumeProps";

type LandingPageTemplateType = "classic" | "modern" | "bold";
type ActualTemplateType = "fresher" | "experienced" | "designer";

const reverseTemplateMapping: Record<
  LandingPageTemplateType,
  ActualTemplateType
> = {
  classic: "fresher",
  modern: "experienced",
  bold: "designer",
};

export const useTemplateSelection = () => {
  const [activeTemplate, setActiveTemplate] = useState<number>(2);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );
  
  const router = useRouter();
  const actualTemplate = useRecoilValue(actualTemplateSelector);
  const setTemplateAndUpdateURL = useSetTemplateAndUpdateURL();
  const { data: session } = useSession();
  const { saveResume } = useSaveResume();
  const { rdata, template, setTemplate, loading, error, id } =
    useFetchResumeData();

    let resumeId: string | null = null;
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      resumeId = searchParams.get("id");  
      console.log("Resume ID from URL:", resumeId);
    }

  // Function to save a resume draft
  const saveDraft = useCallback(
    async (data: ResumeProps) => {
      if (!resumeId) {
        console.error("No resume ID available");
        setSaveStatus("error");
        return;
      }

      try {
        setSaveStatus("saving");
        const response = await fetch("/api/resume/saveResume/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId,
            content: {
              ...data,
              state: "EDITING",
              userId: session?.user?.id || "default-user-id",
            },
          }),
        });

        if (!response.ok) {
          throw new Error((await response.json()).error || "Failed to save draft");
        }

        setSaveStatus("saved");
      } catch (error) {
        console.error("Error saving draft:", error);
        setSaveStatus("error");
      }
    },
    [ session?.user?.id]
  );

  // Function to handle template selection
  const handleSetTemplate = async (template: LandingPageTemplateType) => {
    setTemplateAndUpdateURL(template);
    const actualTemplate = reverseTemplateMapping[template];
    
    if (resumeId) {
      rdata.templateId = actualTemplate;
      await saveDraft(rdata);
      router.push(`/select-templates/editor?id=${resumeId}`);
    } else if (!resumeId) {
      rdata.templateId = actualTemplate;
      saveResume(rdata, actualTemplate);
    }
  };

  return {
    activeTemplate,
    setActiveTemplate,
    saveStatus,
    handleSetTemplate,
    loading,
    error,
    template,
  };
};
