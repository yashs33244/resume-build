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

const templates = [
  {
    id: "experienced",
    name: "Experienced",
    image: "/template1.png",
    description: "Perfect if you have 3+ experiences to write about",
  },
  {
    id: "fresher",
    name: "Fresher",
    image: "/template2.png",
    description:
      "The right fit if you have just graduated or have <2 experiences",
  },
  {
    id: "designer",
    name: "Designer",
    image: "/template3.png",
    description: "Ideal if you want to stand out in manual screening",
  },
];

const TemplatesSelect = () => {
  const [activeTemplate, setTemplate] = useState(2);
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Handle template selection and navigate to editor with template ID in the query
  const handleSetTemplate = (templateId: string) => {
    router.push(`/select-templates/editor?template=${templateId}`);
  };

  const setActiveTemplate = () => {}

  return (
    <div className="template-select-container">
      <div className="container-title">
        Select your final CV template
      </div>
      <div className="templates-wrapper">
        <div className="template" onMouseOver={() => setTemplate(1)}>
          <div className={`template-name ${activeTemplate === 1 ? 'selected' : ''}`}>Fresher</div>
          <Image src={template1} alt="template1" className={activeTemplate === 1 ? 'active' : ''} />
          <div className={`select-cta ${activeTemplate === 1 ? 'open' : ''}`} onClick={() => handleSetTemplate("fresher")}>Select Template</div>
          <div className="template-desc">Ideal for young professionals with 0 to 3 years experience</div>
        </div>
        <div className="template" onMouseOver={() => setTemplate(2)}>
          <div className={`template-name ${activeTemplate === 2 ? 'selected' : ''}`}>Experienced</div>
          <Image src={template2} alt="template2" className={activeTemplate === 2 ? 'active' : ''} />
          <div className={`select-cta ${activeTemplate === 2 ? 'open' : ''}`} onClick={() => handleSetTemplate("experienced")}>Select Template</div>
          <div className="template-desc">Perfect if you have 3+ work experiences to write about</div>
        </div>
        <div className="template" onMouseOver={() => setTemplate(3)}>
          <div className={`template-name ${activeTemplate === 3 ? 'selected' : ''}`}>Appealing</div>
          <Image src={template3} alt="template3" className={activeTemplate === 3 ? 'active' : ''} />
          <div className={`select-cta ${activeTemplate === 3 ? 'open' : ''}`} onClick={() => handleSetTemplate("designer")}>Select Template</div>
          <div className="template-desc">Stand out in manual screening by hiring managers or recruiters</div>
        </div>
      </div>
      <div className="logo-wrapper">
        <Image
          src={logo}
          // width="120"
          alt="logo"
        />
      </div>
    </div>
  );
};

export default TemplatesSelect;
