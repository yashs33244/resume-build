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
import { useResumeData } from "./useResumeData";

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
  const [selectedTemplate, setSelectedTemplate] = useState<LandingPageTemplateType | null>(null);
  const [templateSelected, setTemplateSelected] = useState<boolean>(false); // Track if any template has been selected
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const actualTemplate = useRecoilValue(actualTemplateSelector);
  const setTemplateAndUpdateURL = useSetTemplateAndUpdateURL();
  const { data: session } = useSession();
  const { saveResume } = useSaveResume();
  const {
    resumeData,
    handleInputChange: baseHandleInputChange,
    handleAddField,
    handleDeleteField,
  } = useResumeData((newData: ResumeProps) => {
    setSaveStatus("saving");
  });

  const template = resumeData.templateId;
  const rdata = resumeData;

  let resumeId: string | null = null;
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    resumeId = searchParams.get("id");
  }

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
    [session?.user?.id]
  );

  const handleSetTemplate = async (template: LandingPageTemplateType) => {
    if (templateSelected) return; // Prevent selecting another template

    setTemplateAndUpdateURL(template);
    setSelectedTemplate(template);
    setTemplateSelected(true); // Lock selection to disable further actions
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
    selectedTemplate,
    templateSelected, // Return templateSelected to use in the component
    loading,
    error,
    template,
  };
};
