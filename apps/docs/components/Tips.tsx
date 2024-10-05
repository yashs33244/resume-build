"use client";
import React, { useState } from "react";
import { FaLightbulb } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { IoSchool } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa";
import { AiFillProject } from "react-icons/ai";
import { FaTools } from "react-icons/fa";
import { FaLanguage } from "react-icons/fa6";
import { PiCaretCircleRightFill } from "react-icons/pi";
import { tipsData } from "./tipsData";
import { PiCertificateFill } from "react-icons/pi";
import { FaUserTie } from "react-icons/fa";
// import ProfileWrapper from "./ProfileWrapper";
// import Image from "next/image";
import "./Tips.scss";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";

export default function Tips(props: any) {
  // const [isOpen, setIsOpen] = useState(false);
  const { activeSection, open, setTipsOpen } = props;

  const togglePopover = () => {
    setTipsOpen(false);
  };

  return (
    <div className="tips-cta-container">
      {/* <div className="tips-cta-button" onClick={togglePopover}>
        <FaLightbulb style={{ width: "26px", height: "26px" }} />
      </div> */}
      {open && (
        <div className="tips-popover">
          <div className="tips-popover-content">
            {/* Content goes here */}
            <div className="tips-header">
              <div>Tips and Best Practices</div>
              <IoCloseSharp
                style={{ width: "20px", height: "20px", cursor: "pointer" }}
                onClick={togglePopover}
              />
            </div>
            <Collapsible
              className="collapse-comp first"
              defaultOpen={activeSection === "Personal Info" ? true : false}
            >
              <CollapsibleTrigger className="collapse-trigger first">
                <FaUserTie />
                <div>Personal Information</div>
              </CollapsibleTrigger>
              <CollapsibleContent className="collapse-content">
                {tipsData && tipsData.personal.map((tip, index) => (
                  <li style={{marginTop: '8px'}} key={index}>{tip}</li>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              className="collapse-comp"
              defaultOpen={activeSection === "Education" ? true : false}
            >
              <CollapsibleTrigger className="collapse-trigger">
                <IoSchool />
                <div>Education</div>
              </CollapsibleTrigger>
              <CollapsibleContent className="collapse-content">
                {tipsData && tipsData.education.map((tip, index) => (
                  <li style={{marginTop: '8px'}} key={index}>{tip}</li>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              className="collapse-comp"
              defaultOpen={activeSection === "Experience" ? true : false}
            >
              <CollapsibleTrigger className="collapse-trigger">
                <FaSuitcase />
                <div>Work Experience</div>
              </CollapsibleTrigger>
              <CollapsibleContent className="collapse-content">
                {tipsData && tipsData.experience.map((tip, index) => (
                  <li style={{marginTop: '8px'}} key={index}>{tip}</li>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              className="collapse-comp"
              defaultOpen={activeSection === "Project" ? true : false}
            >
              <CollapsibleTrigger className="collapse-trigger">
                <AiFillProject />
                <div>Projects</div>
              </CollapsibleTrigger>
              <CollapsibleContent className="collapse-content">
                {tipsData && tipsData.projects.map((tip, index) => (
                  <li style={{marginTop: '8px'}} key={index}>{tip}</li>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              className="collapse-comp"
              defaultOpen={activeSection === "Skills" ? true : false}
            >
              <CollapsibleTrigger className="collapse-trigger">
                <FaTools />
                <div>Skills</div>
              </CollapsibleTrigger>
              <CollapsibleContent className="collapse-content">
                {tipsData && tipsData.skills.map((tip, index) => (
                  <li style={{marginTop: '8px'}} key={index}>{tip}</li>
                ))}
              </CollapsibleContent>
            </Collapsible>
            <Collapsible
              className="collapse-comp"
              defaultOpen={activeSection === "Certificate" ? true : false}
            >
              <CollapsibleTrigger className="collapse-trigger">
                <PiCertificateFill />
                <div>Certificate</div>
              </CollapsibleTrigger>
              <CollapsibleContent className="collapse-content">
                <div>Best Practices of personal information will go here</div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}
    </div>
  );
}
