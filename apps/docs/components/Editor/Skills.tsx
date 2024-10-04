import React, { useState, useEffect } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";
import { ResumeProps } from "../../types/ResumeProps";
import "./styles/skills.scss";
import { useRecoilState } from "recoil";
import {
  coreSkillState,
  techSkillState,
  suggestionsState,
} from "../../store/skillatoms";
import useAiSuggestion from "../../hooks/useAiSuggestions";

interface SkillsProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
    index?: number,
  ) => void;
  handleAddField: (section: keyof ResumeProps) => void;
  handleDeleteField: (
    section: keyof ResumeProps,
    field: string,
    index?: number,
  ) => void;
}

export const Skills: React.FC<SkillsProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const [coreSkill, setCoreSkill] = useRecoilState(coreSkillState);
  const [techSkill, setTechSkill] = useRecoilState(techSkillState);

  const { handleAiSuggestion, suggestions, isLoading, setSuggestions } =
    useAiSuggestion();

  useEffect(() => {
    const savedSuggestions = localStorage.getItem("skillSuggestions");
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("skillSuggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  const addCoreSkill = (skill: string) => {
    if (skill.trim()) {
      handleAddField("coreSkills");
      handleInputChange(
        "skills",
        "coreSkill",
        skill,
        resumeData.coreSkills?.length,
      );
      setCoreSkill("");
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((s) => s !== skill),
      );
    }
  };

  const addTechSkill = (skill: string) => {
    if (skill.trim()) {
      handleAddField("techSkills");
      handleInputChange(
        "skills",
        "techSkill",
        skill,
        resumeData.techSkills?.length,
      );
      setTechSkill("");
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((s) => s !== skill),
      );
    }
  };

  // const handleAiSuggestion = async () => {
  //   setIsLoading(true);
  //   try {
  //     const prompt = `Based on the following resume information, suggest 5 relevant skills that would enhance this person's profile:

  //     Education: ${resumeData.education
  //       .map((edu) => `${edu.degree} from ${edu.institution}`)
  //       .join(", ")}
  //     Experience: ${resumeData.experience
  //       .map((exp) => `${exp.role} at ${exp.company}`)
  //       .join(", ")}
  //     Current Skills: ${resumeData.skills.join(", ")}
  //     Bio: ${resumeData.personalInfo?.bio ?? ""}

  //     Please provide 5 skill suggestions, each on a new line.`;

  //     const response = await fetch("/api/generate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ prompt }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to generate content");
  //     }

  //     // Fetch response as text
  //     const text = await response.text();
  //     console.log("API Response:", text);

  //     // Process the text response
  //     const newSuggestions = text
  //       .split("\n")
  //       .map((skill) => skill.trim())
  //       .filter(Boolean)
  //       .map((skill) => skill.replace(/^[*-]\s*/, "")) // Remove leading *, - or any other unwanted characters
  //       .filter(Boolean); // Remove empty strings

  //     setSuggestions((prevSuggestions) => [
  //       ...new Set([...prevSuggestions, ...newSuggestions]),
  //     ]);
  //   } catch (error) {
  //     console.error("Failed to get suggestions", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const renderCoreSkillTags = () => {
    return (
      <div className="flex flex-wrap gap-2 list-container">
        {resumeData.coreSkills?.map((skill, index) => (
          <div
            key={index}
            className="list-item inline-flex items-center bg-gray-100 rounded-full px-5 py-2 text-sm font-semibold text-gray-700"
          >
            {skill}
            <button
              onClick={() => handleDeleteField("skills", "coreSkill", index)}
              className="ml-2 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderTechSkillTags = () => {
    return (
      <div className="flex flex-wrap gap-2 list-container">
        {resumeData.techSkills?.map((skill, index) => (
          <div
            key={index}
            className="list-item inline-flex items-center bg-gray-100 rounded-full px-5 py-2 text-sm font-semibold text-gray-700"
          >
            {skill}
            <button
              onClick={() => handleDeleteField("skills", "techSkill", index)}
              className="ml-2 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderAISuggestedSkills = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
        {suggestions.map((skill, index) => (
          <button
            key={index}
            className="text-white text-sm font-medium p-2 py-1 rounded-full border border-blue-600 hover:bg-slate-700 transition-colors transition-shadow"
            onClick={() => addCoreSkill(skill)}
          >
            {skill}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="skills-container">
      <div className="core-skills">
        <Label htmlFor={`skill`} className="field-label">
          Core Skills
        </Label>
        <div className="core-skill-selector">
          <Input
            value={coreSkill}
            onChange={(e) => setCoreSkill(e.target.value)}
            placeholder="Type core skills like - Product strategy, OOPs etc"
            className="form-input"
            onKeyPress={(e) => e.key === "Enter" && addCoreSkill(coreSkill)}
          />
        </div>
        <div className="mb-4">{renderCoreSkillTags()}</div>
        <div className="text-xl font-semibold mb-2 recommend">
          Recommended for your role
        </div>

        {renderAISuggestedSkills()}
      </div>
      <div className="tech-skills">
        <Label htmlFor={`tool`} className="field-label">
          Tools and Technologies
        </Label>
        <div className="tech-skill-selector">
          <Input
            value={techSkill}
            onChange={(e) => setTechSkill(e.target.value)}
            placeholder="Type tools like - MS Excel, Figma, Firebase etc"
            className="form-input"
            onKeyPress={(e) => e.key === "Enter" && addTechSkill(techSkill)}
          />
        </div>
        <div className="mb-4">{renderTechSkillTags()}</div>
        <div className="text-xl font-semibold mb-2 recommend">
          Recommended for your role
        </div>

        {renderAISuggestedSkills()}
      </div>
      {/* <Button
        onClick={handleAiSuggestion}
        disabled={isLoading}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
      >
        {isLoading ? "Loading..." : "Get More Suggestions"}
      </Button> */}
    </div>
  );
};
