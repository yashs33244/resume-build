"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import template1 from "./template1.png";
import template2 from "./template2.png";
import template3 from "./template3.png";
import logo from "./logo.svg";
import "./TemplatesSelect.scss";
import { Loader } from "lucide-react";
import { useTemplateSelection } from "../hooks/useTemplateSelection";
import { LandingLoader } from "./LandingLoader";

const TemplatesSelect = () => {
  const {
    activeTemplate,
    setActiveTemplate,
    saveStatus,
    resumeLoading,
    handleSetTemplate,
    selectedTemplate,
    templateSelected, // New variable to check if a template has been selected
    loading,
    error,
  } = useTemplateSelection();

  if (resumeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <div className="template-select-container">
        <div className="container-title">Select your template</div>
        <div className="templates-wrapper">
          <div className="template" onMouseOver={() => setActiveTemplate(1)}>
            <div
              className={`template-name ${activeTemplate === 1 ? "selected" : ""}`}
            >
              Professional
            </div>
            <Image
              src={template1}
              alt="template1"
              className={activeTemplate === 1 ? "active" : ""}
            />
            <button
              className={`select-cta ${activeTemplate === 1 ? "open" : ""}`}
              onClick={() => handleSetTemplate("classic")}
              disabled={templateSelected} // Disable button if any template is already selected
            >
              {selectedTemplate === "classic"
                ? "Template Selected"
                : "Select Template"}
            </button>
            <div className="template-desc">
              Goold old fashioned classic template
            </div>
          </div>

          <div className="template" onMouseOver={() => setActiveTemplate(2)}>
            <div
              className={`template-name ${activeTemplate === 2 ? "selected" : ""}`}
            >
              Minimal
            </div>
            <Image
              src={template2}
              alt="template2"
              className={activeTemplate === 2 ? "active" : ""}
            />
            <button
              className={`select-cta ${activeTemplate === 2 ? "open" : ""}`}
              onClick={() => handleSetTemplate("modern")}
              disabled={templateSelected} // Disable button if any template is already selected
            >
              {selectedTemplate === "modern"
                ? "Template Selected"
                : "Select Template"}
            </button>
            <div className="template-desc">
              Clean spacious layout with excellent readability
            </div>
          </div>

          <div className="template" onMouseOver={() => setActiveTemplate(3)}>
            <div
              className={`template-name ${activeTemplate === 3 ? "selected" : ""}`}
            >
              Modern
            </div>
            <Image
              src={template3}
              alt="template3"
              className={activeTemplate === 3 ? "active" : ""}
            />
            <button
              className={`select-cta ${activeTemplate === 3 ? "open" : ""}`}
              onClick={() => handleSetTemplate("bold")}
              disabled={templateSelected} // Disable button if any template is already selected
            >
              {selectedTemplate === "bold"
                ? "Template Selected"
                : "Select Template"}
            </button>
            <div className="template-desc">
              Efficient template for detailed content
            </div>
          </div>
        </div>
        {/* <div className="logo-wrapper">
          <Image src={logo} alt="logo" />
        </div> */}
      </div>
    </Suspense>
  );
};

export default TemplatesSelect;
