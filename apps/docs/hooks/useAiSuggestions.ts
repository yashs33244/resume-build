import { useState } from "react";
import { ResumeProps } from "../types/ResumeProps";
import { useRecoilState } from "recoil";
import {
    coreSkillState,
    techSkillState,
    suggestionsState,
  } from "../store/skillatoms";

const useAiSuggestion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [coreSkill, setCoreSkill] = useRecoilState(coreSkillState);
  const [techSkill, setTechSkill] = useRecoilState(techSkillState);
  const [suggestions, setSuggestions] = useRecoilState(suggestionsState);
  const [error, setError] = useState(null);
  

  const handleAiSuggestion = async (resumeData:ResumeProps) => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = `Based on the following resume information, suggest 5 relevant skills that would enhance this person's profile:

      Education: ${resumeData.education
        .map((edu) => `${edu.degree} from ${edu.institution}`)
        .join(", ")}
      Experience: ${resumeData.experience
        .map((exp) => `${exp.role} at ${exp.company}`)
        .join(", ")}
      Current Skills: ${resumeData.skills.join(", ")}
      Bio: ${resumeData.personalInfo?.bio ?? ""}

      Please provide 5 skill suggestions, each on a new line.`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const text = await response.text();
      console.log("API Response:", text);

      const newSuggestions = text
        .split("\n")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .map((skill) => skill.replace(/^[*-]\s*/, ""))
        .filter(Boolean);

      setSuggestions((prevSuggestions) => [
        ...new Set([...prevSuggestions, ...newSuggestions]),
      ]);
    } catch (error:any) {
      console.error("Failed to get suggestions", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleAiSuggestion, isLoading, suggestions, error , setSuggestions};
};

export default useAiSuggestion;