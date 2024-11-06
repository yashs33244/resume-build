"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import template1 from "./template1.png";
import template2 from "./template2.png";
import template3 from "./template3.png";
import logo from "./logo.svg";
import "./TemplatesSelect.scss";
import { useRouter } from "next/navigation";
import {
  actualTemplateSelector,
  useSetTemplateAndUpdateURL,
} from "../store/templatesState";
import { useRecoilValue } from "recoil";
import { useSaveResume } from "../hooks/useSaveResume";

// Mapping between landing page names and actual template names
type LandingPageTemplateType = "classic" | "modern" | "bold";
type ActualTemplateType = "fresher" | "experienced" | "designer";

// Correct Record definition
const reverseTemplateMapping: Record<
  LandingPageTemplateType,
  ActualTemplateType
> = {
  classic: "fresher",
  modern: "experienced",
  bold: "designer",
};

const TemplatesSelect = () => {
  const [activeTemplate, setActiveTemplate] = useState<number>(2); // Use state for active template selection
  const router = useRouter();
  const actualTemplate = useRecoilValue(actualTemplateSelector);
  const setTemplateAndUpdateURL = useSetTemplateAndUpdateURL();
  const { saveResume, isSaving } = useSaveResume();

  // Update URL and Recoil state
  const handleSetTemplate = (template: LandingPageTemplateType) => {
    setTemplateAndUpdateURL(template); // Update Recoil state and localStorage
    const actualTemplate = reverseTemplateMapping[template];
    const resumeData = JSON.parse(localStorage.getItem("resumeData")!);
    saveResume(resumeData, actualTemplate);
  };

  return (
    <div className="template-select-container">
      {/* add a back button */}
      {/* <div className="px-5 py-2">
        <button className="back-button">
          <Link
            href="/"
            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none dark:focus:ring-blue-800"
          >
            ← Back
          </Link>
        </button>
      </div> */}
      <div className="container-title">Select your final CV template</div>
      <div className="templates-wrapper">
        <div className="template" onMouseOver={() => setActiveTemplate(1)}>
          <div
            className={`template-name ${
              activeTemplate === 1 ? "selected" : ""
            }`}
          >
            Fresher
          </div>
          <Image
            src={template1}
            alt="template1"
            className={activeTemplate === 1 ? "active" : ""}
          />
          <div
            className={`select-cta ${activeTemplate === 1 ? "open" : ""}`}
            onClick={() => handleSetTemplate("classic")}
          >
            Select Template
          </div>
          <div className="template-desc">
            Ideal for young professionals with 0 to 3 years experience
          </div>
        </div>

        <div className="template" onMouseOver={() => setActiveTemplate(2)}>
          <div
            className={`template-name ${
              activeTemplate === 2 ? "selected" : ""
            }`}
          >
            Experienced
          </div>
          <Image
            src={template2}
            alt="template2"
            className={activeTemplate === 2 ? "active" : ""}
          />
          <div
            className={`select-cta ${activeTemplate === 2 ? "open" : ""}`}
            onClick={() => handleSetTemplate("modern")}
          >
            Select Template
          </div>
          <div className="template-desc">
            Perfect if you have 3+ work experiences to write about
          </div>
        </div>

        <div className="template" onMouseOver={() => setActiveTemplate(3)}>
          <div
            className={`template-name ${
              activeTemplate === 3 ? "selected" : ""
            }`}
          >
            Designer
          </div>
          <Image
            src={template3}
            alt="template3"
            className={activeTemplate === 3 ? "active" : ""}
          />
          <div
            className={`select-cta ${activeTemplate === 3 ? "open" : ""}`}
            onClick={() => handleSetTemplate("bold")}
          >
            Select Template
          </div>
          <div className="template-desc">
            Stand out in manual screening by hiring managers or recruiters
          </div>
        </div>
      </div>
      <div className="logo-wrapper">
        <Image src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default TemplatesSelect;
