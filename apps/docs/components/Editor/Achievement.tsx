"use client";
import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ResumeProps } from "../../types/ResumeProps";
import { FaTrashAlt } from "react-icons/fa";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";
import "./styles/achievments.scss";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ClientSideQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-row gap-2">
      <div className="w-4 h-4 rounded-full bg-white-500 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-4 h-4 rounded-full bg-white-500 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-white-500 animate-bounce [animation-delay:.7s]"></div>
    </div>
  ),
});

interface AchievementsProps {
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

export const Achievement: React.FC<AchievementsProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const achievements = resumeData.achievements || [];
  const handleAchievementChange = (value: string, index: number) => {
    handleInputChange("achievements", "description", value, index);
  };

  return (
    <div className="achievements-container">
      <div className="achievements-list">
        {achievements.map((achievement, index) => (
          <Collapsible
            className={index === 0 ? "collapse-comp first" : "collapse-comp"}
            key={index}
          >
            <CollapsibleTrigger className="collapse-trigger">
              <div className="achievement-note">
                <ChevronDownIcon className="h-5 w-5 transition-transform" />
                <div className="achievement-details">
                  <div className="title">
                    {achievement.title || `Enter Achievement`}
                  </div>
                </div>
              </div>
              <div
                className="delete-cta"
                onClick={() => handleDeleteField("achievements", "", index)}
              >
                <FaTrashAlt />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="collapse-content">
              <div className="content-container">
                <div className="single-form-row">
                  <div className="row-form-field">
                    <Label
                      htmlFor={`achievement-title-${index}`}
                      className="field-label"
                    >
                      Achievement Title *
                    </Label>
                    <Input
                      id={`achievement-title-${index}`}
                      value={achievement.title || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "achievements",
                          "title",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg: Best Team Player Award"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="single-form-row">
                  <div className="row-form-field">
                    <Label
                      htmlFor={`achievement-description-${index}`}
                      className="field-label"
                    >
                      Description
                    </Label>
                    {/* <Input
                      id={`achievement-description-${index}`}
                      value={achievement.description || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "achievements",
                          "description",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="Provide details about the achievement"
                      className="form-input"
                    /> */}

                    <div className="text-editor-container">
                      <ClientSideQuill
                        id={`responsibilities-${index}`}
                        value={achievement.description || ""}
                        onChange={(value) =>
                          handleAchievementChange(value, index)
                        }
                        className="text-editor"
                        modules={{
                          toolbar: [
                            ["bold", "italic", "underline", "strike"],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["link"],
                          ],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <Button
        variant="default"
        onClick={() => handleAddField("achievements")}
        className="add-cta"
      >
        + Add Achievement
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
