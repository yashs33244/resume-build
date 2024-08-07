"use client";
import React, { useState, useCallback } from "react";
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
    subIndex?: number,
    category?: string,
  ) => void;
  handleAddField: (section: keyof ResumeProps, category?: string) => void;
  handleDeleteField: (
    section: keyof ResumeProps,
    index?: number,
    category?: string,
    skillIndex?: number,
  ) => void;
}

export const Skills: React.FC<SkillsProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const [editingCategories, setEditingCategories] = useState<{
    [key: string]: string;
  }>({});

  const addNewCategory = () => {
    const newCategoryName = `New Category ${Object.keys(resumeData.skills || {}).length + 1}`;
    handleAddField("skills", newCategoryName);
    setEditingCategories((prev) => ({
      ...prev,
      [newCategoryName]: newCategoryName,
    }));
  };

  const addNewSkill = (category: string) => {
    handleAddField("skills", category);
  };

  const handleCategoryNameChange = useCallback(
    (oldName: string, newName: string) => {
      setEditingCategories((prev) => ({ ...prev, [oldName]: newName }));
    },
    [],
  );

  const handleCategoryNameBlur = useCallback(
    (oldName: string) => {
      const newName = editingCategories[oldName];
      if (newName && newName !== oldName) {
        handleInputChange("skills", "updateCategory", { oldName, newName });
      }
      setEditingCategories((prev) => {
        const { [oldName]: _, ...rest } = prev;
        return rest;
      });
    },
    [editingCategories, handleInputChange],
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Skills</h2>
      {Object.entries(resumeData.skills || {}).map(([category, skills]) => (
        <div key={category} className="mt-4">
          <Input
            value={
              editingCategories[category] !== undefined
                ? editingCategories[category]
                : category
            }
            onChange={(e) => handleCategoryNameChange(category, e.target.value)}
            onBlur={() => handleCategoryNameBlur(category)}
            placeholder="Category"
          />
          {Array.isArray(skills) &&
            skills.map((skill, subIndex) => (
              <div key={subIndex} className="flex items-center mt-2">
                <Input
                  value={skill}
                  onChange={(e) =>
                    handleInputChange(
                      "skills",
                      "skill",
                      e.target.value,
                      undefined,
                      subIndex,
                      category,
                    )
                  }
                  placeholder="Skill"
                />
                <Button
                  variant="destructive"
                  onClick={() =>
                    handleDeleteField("skills", undefined, category, subIndex)
                  }
                  className="ml-2"
                >
                  Delete Skill
                </Button>
              </div>
            ))}
          <Button
            variant="default"
            onClick={() => addNewSkill(category)}
            className="mt-2"
          >
            Add Skill
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteField("skills", undefined, category)}
            className="ml-2"
          >
            Delete Category
          </Button>
        </div>
      ))}
      <Button variant="default" onClick={addNewCategory} className="mt-4">
        Add Category
      </Button>
    </div>
  );
};
