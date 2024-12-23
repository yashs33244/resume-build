import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { ResumeProps } from "../../types/ResumeProps";
import "./styles/skills.scss";

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

interface SkillCache {
  [role: string]: string[];
}

export const Skills: React.FC<SkillsProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const [coreSkill, setCoreSkill] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [skillCache, setSkillCache] = useState<SkillCache>({});
  const [usedSuggestions, setUsedSuggestions] = useState<Set<string>>(
    new Set(),
  );

  const fetchSuggestions = useCallback(
    async (role: string) => {
      setIsLoading(true);
      try {
        const prompt = `Based on the following resume information, suggest 10 relevant strings which is a healthy mix of skills, tools and technologies for a ${role} position:


        Experience: ${resumeData.experience}
        projects: ${resumeData.projects}
        certifications: ${resumeData.certificates}  
        Bio: ${resumeData.personalInfo?.bio ?? ""}

        Also leverage above resume data to give the required 10 suggestions. No output string not be a long sentence. Suggest like they need to be mapped with a resume.`;

        const response = await fetch("/api/generate/skills", {
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
        const newSuggestions = text
          .split("\n")
          .map((skill) => skill.trim())
          .filter(Boolean)
          .map((skill) => skill.replace(/^[*-]\s*/, ""))
          .filter(Boolean);

        // Filter out any skills that are already in usedSuggestions
        const filteredSuggestions = newSuggestions.filter(
          (skill) => !usedSuggestions.has(skill),
        );

        setSuggestions(filteredSuggestions);

        // Save to local cache and localStorage
        const updatedCache = {
          ...skillCache,
          [role]: filteredSuggestions,
        };
        setSkillCache(updatedCache);
        localStorage.setItem("skillCache", JSON.stringify(updatedCache));
      } catch (error) {
        console.error("Failed to get suggestions", error);
      } finally {
        setIsLoading(false);
      }
    },
    [resumeData, skillCache, usedSuggestions],
  );

  useEffect(() => {
    const currentRole = resumeData.personalInfo?.title || "";
    // console.log("currentRole", currentRole);

    // Retrieve cache from localStorage
    const savedCache = localStorage.getItem("skillCache");
    const parsedCache: SkillCache = savedCache ? JSON.parse(savedCache) : {};

    if (currentRole) {
      if (parsedCache[currentRole] && parsedCache[currentRole].length > 0) {
        // Use cached skills if available
        setSuggestions(parsedCache[currentRole]);
      } else {
        // Fetch new suggestions if no cache for current role
        fetchSuggestions(currentRole);
      }
    }
  }, [resumeData.personalInfo?.title, fetchSuggestions]);

  const addCoreSkill = (skill: string) => {
    if (skill.trim() && !usedSuggestions.has(skill)) {
      handleAddField("coreSkills");
      handleInputChange(
        "skills",
        "coreSkill",
        skill,
        resumeData.coreSkills?.length,
      );
      setCoreSkill("");

      // Add the skill to usedSuggestions
      setUsedSuggestions((prev) => new Set(prev).add(skill));

      // Remove added skill from suggestions and update localStorage
      const updatedSuggestions = suggestions.filter((s) => s !== skill);
      setSuggestions(updatedSuggestions);

      const currentRole = resumeData.personalInfo?.title || "";
      const savedCache = localStorage.getItem("skillCache");
      const parsedCache: SkillCache = savedCache ? JSON.parse(savedCache) : {};

      if (parsedCache[currentRole]) {
        parsedCache[currentRole] = updatedSuggestions;
        localStorage.setItem("skillCache", JSON.stringify(parsedCache));
      }
    }
  };

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
              onClick={() => {
                handleDeleteField("skills", "coreSkill", index);
                // Remove the skill from usedSuggestions when deleted
                setUsedSuggestions((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(skill);
                  return newSet;
                });
              }}
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
      <div className="ai-skill-container">
        {suggestions.map((skill, index) => (
          <button
            key={index}
            className="ai-skill-item"
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
          Skills
        </Label>
        <div className="core-skill-selector">
          <Input
            value={coreSkill}
            onChange={(e) => setCoreSkill(e.target.value)}
            placeholder="Type core skills like - Product strategy, Java, UX Design etc"
            className="form-input"
            onKeyPress={(e) => e.key === "Enter" && addCoreSkill(coreSkill)}
          />
        </div>
        <div className="mb-4">{renderCoreSkillTags()}</div>
        <div className="text-xl font-semibold mb-2 recommend">
          Recommended for your role
        </div>

        {resumeData?.personalInfo?.title ? (
          renderAISuggestedSkills()
        ) : (
          <div className="reco-fallback">
            Enter job title to get required skills for your resume..
          </div>
        )}
      </div>
      {isLoading && <div>Loading suggestions...</div>}
    </div>
  );
};
