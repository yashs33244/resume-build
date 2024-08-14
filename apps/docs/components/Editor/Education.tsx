"use client";

import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { ResumeProps } from "../../types/ResumeProps";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";

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
      <h2 className="text-3xl font-bold tracking-tighter sm:text-3xl md:text-3xl mb-6">
        Education
      </h2>
      <div className="space-y-4">
        {resumeData.education?.map((edu, index) => (
          <Collapsible key={index}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-3 text-left text-lg font-medium transition-colors hover:bg-muted-foreground/10 focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75 [&[data-state=open]>svg]:rotate-180">
              <span>{edu.institution || `Education ${index + 1}`}</span>
              <ChevronDownIcon className="h-5 w-5 transition-transform" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pt-4 pb-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor={`institution-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Institution
                  </Label>
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
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`years-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Years
                  </Label>
                  <Input
                    id={`years-${index}`}
                    value={edu.years}
                    onChange={(e) =>
                      handleInputChange(
                        "education",
                        "years",
                        e.target.value,
                        index,
                      )
                    }
                    placeholder="Years"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label
                    htmlFor={`degree-${index}`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Degree
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
                    placeholder="Degree"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteField("education", index)}
                  className="mt-2"
                >
                  Delete Education
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
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
