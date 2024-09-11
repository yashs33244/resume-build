"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import template1 from './template1.png';
import template2 from './template2.png';
import template3 from './template3.png';
import logo from './logo.svg';
import './TemplatesSelect.scss';
import { Check } from "lucide-react";

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
      "The right fit if your have just graduated or have <2 experiences",
  },
  {
    id: "designer",
    name: "Designer",
    image: "/template3.png",
    description: "Ideal if you want to stand out in manual screening",
  },
];

const TemplatesSelect = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (templateId: any) => {
    setSelectedTemplate(templateId);
  };

  return (
    <div className="template-select-container">
      <div className="container-title">
        Select your final CV template
      </div>
      <div className="templates-wrapper">
        <div className="template">
          <div className="template-name">Fresher</div>
          <Image src={template1} alt="template1" />
          <div className="template-desc">Ideal for young professionals with 0 to 3 years experience</div>
        </div>
        <div className="template">
          <div className="template-name selected">Experienced</div>
          <Image src={template2} alt="template2" />
          <div className="template-desc">Perfect if you have 3+ work experiences to write about</div>
        </div>
        <div className="template">
          <div className="template-name">Appealing</div>
          <Image src={template3} alt="template3" />
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
