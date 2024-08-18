import React, { useState, useEffect } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ResumeProps } from "../../types/ResumeProps";

interface SkillsProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
    index?: number,
  ) => void;
  handleAddField: (section: keyof ResumeProps) => void;
  handleDeleteField: (section: keyof ResumeProps, index: number) => void;
}

export const Skills: React.FC<SkillsProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const [newSkill, setNewSkill] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedSuggestions = localStorage.getItem("skillSuggestions");
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("skillSuggestions", JSON.stringify(suggestions));
  }, [suggestions]);

  const addSkill = (skill: string) => {
    if (skill.trim()) {
      handleAddField("skills");
      handleInputChange("skills", "skill", skill, resumeData.skills.length);
      setNewSkill("");
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((s) => s !== skill),
      );
    }
  };

  const handleAiSuggestion = async () => {
    setIsLoading(true);
    try {
      const prompt = `Based on the following resume information, suggest 5 relevant skills that would enhance this person's profile:
  
      Education: ${resumeData.education
        .map((edu) => `${edu.degree} from ${edu.institution}`)
        .join(", ")}
      Experience: ${resumeData.experience
        .map((exp) => `${exp.role} at ${exp.company}`)
        .join(", ")}
      Current Skills: ${resumeData.skills.join(", ")}
      Bio: ${resumeData.personalInfo.bio}
  
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

      // Fetch response as text
      const text = await response.text();
      console.log("API Response:", text);

      // Process the text response
      const newSuggestions = text
        .split("\n")
        .map((skill) => skill.trim())
        .filter(Boolean)
        .map((skill) => skill.replace(/^[*-]\s*/, "")) // Remove leading *, - or any other unwanted characters
        .filter(Boolean); // Remove empty strings

      setSuggestions((prevSuggestions) => [
        ...new Set([...prevSuggestions, ...newSuggestions]),
      ]);
    } catch (error) {
      console.error("Failed to get suggestions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSkillTags = () => {
    return (
      <div className="flex flex-wrap gap-2">
        {resumeData.skills.map((skill, index) => (
          <div
            key={index}
            className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
          >
            {skill}
            <button
              onClick={() => handleDeleteField("skills", index)}
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
            className="text-gray-800 text-sm font-medium p-2 py-1 rounded-full border border-blue-600 hover:bg-blue-100 transition-colors transition-shadow"
            onClick={() => addSkill(skill)}
          >
            {skill}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Skills</h2>
      <div className="mb-4">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === "Enter" && addSkill(newSkill)}
        />
      </div>
      <div className="mb-4">{renderSkillTags()}</div>
      <h3 className="text-xl font-semibold mb-2">AI Suggested Skills</h3>

      {renderAISuggestedSkills()}
      <Button
        onClick={handleAiSuggestion}
        disabled={isLoading}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
      >
        {isLoading ? "Loading..." : "Get More Suggestions"}
      </Button>
    </div>
  );
};
