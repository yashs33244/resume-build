import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import ReactQuill from "react-quill";
import { ResumeProps } from "../../types/ResumeProps";

interface PersonalInfoProps {
  resumeData: ResumeProps;
  handleInputChange: (
    section: keyof ResumeProps,
    field: string,
    value: any,
  ) => void;
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  resumeData,
  handleInputChange,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold">Personal Info</h2>
      <div className="mt-4">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={resumeData.personalInfo?.name || ""}
          onChange={(e) =>
            handleInputChange("personalInfo", "name", e.target.value)
          }
          placeholder="Name"
        />
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={resumeData.personalInfo?.title || ""}
          onChange={(e) =>
            handleInputChange("personalInfo", "title", e.target.value)
          }
          placeholder="Title"
        />
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={resumeData.personalInfo?.website || ""}
          onChange={(e) =>
            handleInputChange("personalInfo", "website", e.target.value)
          }
          placeholder="Website"
        />
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={resumeData.personalInfo?.email || ""}
          onChange={(e) =>
            handleInputChange("personalInfo", "email", e.target.value)
          }
          placeholder="Email"
        />
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={resumeData.personalInfo?.phone || ""}
          onChange={(e) =>
            handleInputChange("personalInfo", "phone", e.target.value)
          }
          placeholder="Phone"
        />
        <Label htmlFor="bio">Bio</Label>
        <ReactQuill
          id="bio"
          value={resumeData.personalInfo?.bio || ""}
          onChange={(value) => handleInputChange("personalInfo", "bio", value)}
        />
      </div>
    </div>
  );
};
