"use client";
import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import ReactQuill from "react-quill";
import { ResumeProps } from "../../types/ResumeProps";

interface AchievementProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
  ) => void;
  handleDeleteField: (section: keyof ResumeProps) => void;
}

export const Achievement: React.FC<AchievementProps> = ({
  resumeData,
  handleInputChange,
  handleDeleteField,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Achievement</h2>
      <Label htmlFor="achievement-title">Title</Label>
      <Input
        id="achievement-title"
        value={resumeData.achievement?.title || ""}
        onChange={(e) =>
          handleInputChange("achievement", "title", e.target.value)
        }
        placeholder="Title"
      />
      <Label htmlFor="achievement-description">Description</Label>
      <ReactQuill
        id="achievement-description"
        value={resumeData.achievement?.description || ""}
        onChange={(value) =>
          handleInputChange("achievement", "description", value)
        }
      />
      <Button
        variant="destructive"
        onClick={() => handleDeleteField("achievement")}
      >
        Delete
      </Button>
    </div>
  );
};
