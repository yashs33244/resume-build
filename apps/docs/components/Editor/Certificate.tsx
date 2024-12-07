"use client";
import React, { useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";

import "react-quill/dist/quill.snow.css";
import { ResumeProps } from "../../types/ResumeProps";
import "./styles/certificate.scss";
import { FaTrashAlt } from "react-icons/fa";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";

interface CertificateProps {
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

export const Certificate: React.FC<CertificateProps> = ({
  resumeData,
  handleInputChange,
  handleAddField,
  handleDeleteField,
}) => {
  const certificates = resumeData.certificates || [];
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

  return (
    <div className="certificate-container">
      <div className="certificate-list">
        {certificates.map((cert, index) => (
          <Collapsible
            className={index === 0 ? "collapse-comp first" : "collapse-comp"}
            key={index}
          >
            <CollapsibleTrigger className="collapse-trigger">
              <div className="cert-note">
                <ChevronDownIcon className="h-5 w-5 transition-transform" />
                <div className="certificate-details">
                  <div className="title">
                    {cert.name || `Enter Certificate`}
                  </div>
                  <div className="subtitle">
                    {cert.issuer ? cert.issuer : null}
                  </div>
                </div>
              </div>
              <div
                className="delete-cta"
                onClick={() => handleDeleteField("certificates", "", index)}
              >
                <FaTrashAlt />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="collapse-content">
              <div className="content-container">
                <div className="single-form-row">
                  <div className="row-form-field">
                    <Label
                      htmlFor={`certificate-${index}`}
                      className="field-label"
                    >
                      Certificate Name *
                    </Label>
                    <Input
                      id={`certificate-${index}`}
                      value={cert.name || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "certificates",
                          "name",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg: Adanced Data Analytics"
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="single-form-row">
                  <div className="row-form-field">
                    <Label htmlFor={`issuer-${index}`} className="field-label">
                      Issuing Organisation
                    </Label>
                    <Input
                      id={`issuer-${index}`}
                      value={cert.issuer || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "certificates",
                          "issuer",
                          e.target.value,
                          index,
                        )
                      }
                      placeholder="For Eg: Google"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <Button
        variant="default"
        onClick={() => handleAddField("certificates")}
        className="add-cta"
      >
        + Add Certificate
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
