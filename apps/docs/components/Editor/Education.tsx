"use client";

import React, { useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ResumeProps } from "../../types/ResumeProps";
import { FaTrashAlt } from "react-icons/fa";
import "./styles/education.scss";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";
import EducationYearPickers from "../EducationYearPicker";

interface EducationProps {
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

export const Education: React.FC<EducationProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  return (
    <div className="education-container">
      <div className="education-list">
        {resumeData.education?.map((edu, index): any => (
          <Collapsible
            className={index === 0 ? "collapse-comp first" : "collapse-comp"}
            key={index}
          >
            <CollapsibleTrigger className="collapse-trigger">
              <div className="edu-note">
                <ChevronDownIcon className="h-5 w-5 transition-transform" />
                <div className="college-details">
                  <div className="title">
                    {edu.institution || `Enter Education`}
                  </div>
                  <div className="subtitle">
                    {edu.degree && edu.major
                      ? `${edu.degree} | ${edu.major}`
                      : null}
                  </div>
                </div>
              </div>
              <div
                className="delete-cta"
                onClick={() => handleDeleteField("education", "", index)}
              >
                <FaTrashAlt />
              </div>
              {/* <ChevronDownIcon className="h-5 w-5 transition-transform" /> */}
            </CollapsibleTrigger>
            <CollapsibleContent className="collapse-content">
              <div className="content-container">
                <div className="form-row">
                  <div className="row-form-field">
                    <Label
                      htmlFor={`institution-${index}`}
                      className="field-label"
                    >
                      College Name
                    </Label>
                    <Input
                      id={`institution-${index}`}
                      value={edu.institution}
                      className="form-input"
                      type="text"
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          "institution",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg : Indian School of Business"
                    />
                  </div>
                  <div className="row-form-field">
                    <Label htmlFor={`degree-${index}`} className="field-label">
                      Degree Name
                    </Label>
                    <Input
                      id={`degree-${index}`}
                      value={edu.degree}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          "degree",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg: MBA"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="row-form-field">
                    <Label htmlFor={`major-${index}`} className="field-label">
                      Field of Study
                    </Label>
                    <Input
                      id={`degree-${index}`}
                      value={edu.major}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          "major",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg: Marketing"
                      className="form-input"
                    />
                  </div>
                  <div className="row-form-field">
                    <Label htmlFor={`score-${index}`} className="field-label">
                      CGPA or Percentage
                    </Label>
                    <Input
                      id={`score-${index}`}
                      value={edu.score}
                      onChange={(e) =>
                        handleInputChange(
                          "education",
                          "score",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg: 7.4 / 10"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <EducationYearPickers
                    index={index}
                    edu={edu}
                    handleInputChange={handleInputChange}
                  />
                </div>
                {/* <Button
                  variant="destructive"
                  onClick={() => handleDeleteField("education", index)}
                  className="mt-2"
                >
                  Delete Education
                </Button> */}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <Button
        // variant="default"
        onClick={() => handleAddField("education")}
        className="add-cta"
      >
        + Add Education
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
