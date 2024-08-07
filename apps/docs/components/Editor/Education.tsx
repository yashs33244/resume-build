"use client";
import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ResumeProps } from "../../types/ResumeProps";

interface EducationProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
    index?: number,
  ) => void;
  handleAddField: (section: keyof ResumeProps) => void;
  handleDeleteField: (section: keyof ResumeProps, index?: number) => void;
}

export const Education: React.FC<EducationProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Education</h2>
      {resumeData.education?.map((edu, index) => (
        <div key={index} className="mt-4">
          <Label htmlFor={`institution-${index}`}>Institution</Label>
          <Input
            id={`institution-${index}`}
            value={edu.institution}
            onChange={(e) =>
              handleInputChange(
                "education",
                "institution",
                e.target.value,
                index,
              )
            }
            placeholder="Institution"
          />
          <Label htmlFor={`years-${index}`}>Years</Label>
          <Input
            id={`years-${index}`}
            value={edu.years}
            onChange={(e) =>
              handleInputChange("education", "years", e.target.value, index)
            }
            placeholder="Years"
          />
          <Label htmlFor={`degree-${index}`}>Degree</Label>
          <Input
            id={`degree-${index}`}
            value={edu.degree}
            onChange={(e) =>
              handleInputChange("education", "degree", e.target.value, index)
            }
            placeholder="Degree"
          />
          <Button
            variant="destructive"
            onClick={() => handleDeleteField("education", index)}
          >
            Delete
          </Button>
        </div>
      ))}
      <Button
        variant="default"
        onClick={() => handleAddField("education")}
        className="mt-4"
      >
        Add Education
      </Button>
    </div>
  );
};
