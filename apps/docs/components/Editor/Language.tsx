import React, { useState, useEffect } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";
import { ResumeProps } from "../../types/ResumeProps";
import "./styles/language.scss";

interface LanguageProps {
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

export const Language: React.FC<LanguageProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const [language, setLanguage] = useState("");
  const [techSkill, setTechSkill] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLanguage = (language: string) => {
    if (language.trim()) {
      handleAddField("languages");
      handleInputChange(
        "languages",
        "language",
        language,
        resumeData.languages?.length ?? 0,
      );
      setLanguage("");
      setSuggestions((prevSuggestions) =>
        prevSuggestions.filter((s) => s !== language),
      );
    }
  };

  const renderLanguageTags = () => {
    return (
      <div className="flex flex-wrap gap-2 list-container">
        {resumeData.languages?.map((language, index) => (
          <div
            key={index}
            className="list-item inline-flex items-center bg-gray-100 rounded-full px-5 py-2 text-sm font-semibold text-gray-700"
          >
            {language.name}
            <button
              onClick={() => handleDeleteField("languages", "language", index)}
              className="ml-2 focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="language-container">
      <div className="languages">
        <Label htmlFor={`skill`} className="field-label">
          Languages
        </Label>
        <div className="language-selector">
          <Input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Type languages you are proficient with"
            className="form-input"
            onKeyPress={(e) => e.key === "Enter" && addLanguage(language)}
          />
        </div>
        <div className="mb-4">{renderLanguageTags()}</div>
      </div>
    </div>
  );
};
