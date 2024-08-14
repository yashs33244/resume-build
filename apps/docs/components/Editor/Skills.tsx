"use client";

import React, { useState, useCallback } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ResumeProps } from "../../types/ResumeProps";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";

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
    const newCategoryName = `New Category ${
      Object.keys(resumeData.skills || {}).length + 1
    }`;
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
      <h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-3xl mb-6">
        Skills
      </h2>
      <div className="space-y-4">
        {Object.entries(resumeData.skills || {}).map(([category, skills]) => (
          <Collapsible key={category}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-3 text-left text-lg font-medium transition-colors hover:bg-muted-foreground/10 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75 [&[data-state=open]>svg]:rotate-180">
              <span>{category}</span>
              <ChevronDownIcon className="h-5 w-5 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-4 pb-6">
              <div className="space-y-4">
                <Input
                  value={
                    editingCategories[category] !== undefined
                      ? editingCategories[category]
                      : category
                  }
                  onChange={(e) =>
                    handleCategoryNameChange(category, e.target.value)
                  }
                  onBlur={() => handleCategoryNameBlur(category)}
                  placeholder="Category"
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleDeleteField(
                            "skills",
                            undefined,
                            category,
                            subIndex,
                          )
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
                  onClick={() =>
                    handleDeleteField("skills", undefined, category)
                  }
                  className="mt-2"
                >
                  Delete Category
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <Button variant="default" onClick={addNewCategory} className="mt-4">
        Add Category
      </Button>
    </div>
  );
};

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
