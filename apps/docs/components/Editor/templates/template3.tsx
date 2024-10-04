"use client";
import React, { useState } from "react";
//@ts-ignore
import DOMPurify from "dompurify";
import "./template3.css";
import { IoMail } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { ResumeProps } from "../../../types/ResumeProps";

export const Template3 = (props: any) => {
  const { resumeData, id } = props;

  return (
    <div className="template3-wrapper" id={id}>
      <div className={"template-container"}>
        <div className={"lp"}>
          <div className={"lp_personalInfo"}>
            <div className={"lp_personalInfo_name"}>
              {resumeData?.personalInfo?.name}
            </div>
            <div className={"lp_personalInfo_role"}>
              {resumeData?.personalInfo?.title}
            </div>
          </div>
          <div className={"lp_add_info"}>
            <div className={"lp_add_info_value"}>
              <IoMail />
              {resumeData.personalInfo.email}
            </div>
            <div className={"lp_add_info_value"}>
              <FaPhoneAlt />
              {resumeData.personalInfo.phone}
            </div>
            <div className={"lp_add_info_value"}>
              <FaLinkedin />
              <a href={resumeData.personalInfo?.linkedin}>
                {resumeData.personalInfo?.linkedin}
              </a>
            </div>
          </div>
          <div className={`${"lp_education_div"} ${"lp_container"}`}>
            <div
              className={`${"lp_education_div_label"} ${"lp_container_header"}`}
            >
              Education
            </div>
            <div className={`${"lp_education_div_value"}`}>
              {resumeData.education?.map((edu: any) => {
                return (
                  <div className={"lp_education_div_value_section"}>
                    <div className={"lp_education_div_value_section_name"}>
                      {edu?.degree +
                        " - " +
                        edu?.major +
                        ", " +
                        edu?.institution}
                    </div>
                    <div className={"lp_education_div_value_section_year"}>
                      {edu?.start + " - " + edu?.end}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${"lp_skill_div"} ${"lp_container"}`}>
            <div className={`${"lp_skill_div_label"} ${"lp_container_header"}`}>
              Skill
            </div>
            <div className={`${"lp_skill_div_value"}`}>
              {resumeData?.coreSkills?.map((item: any, index: number) => (
                <div key={index} className={"lp_skill_div_value_item"}>
                  {item}
                </div>
              ))}{" "}
            </div>
          </div>
        </div>
        <div className={"rp"}>
          <div className={`${"rp_bio_div"} ${"rp_container"}`}>
            <div className={`${"rp_bio_div_label"} ${"rp_container_header"}`}>
              PROFILE
            </div>
            <div className={`${"rp_bio_div_value"} ${"rp_container_content"}`}>
              {resumeData.personalInfo.bio}
            </div>
          </div>
          <div className={`${"rp_experience_div"} ${"rp_container"}`}>
            <div
              className={`${"rp_experience_div_label"} ${"rp_container_header"}`}
            >
              Experience
            </div>
            <div
              className={`${"rp_experience_div_value"} ${"rp_container_content"}`}
            >
              {resumeData.experience?.map((exp: any) => {
                return (
                  <div className={"rp_experience_div_value_section"}>
                    <div className={"rp_experience_div_value_section_name"}>
                      {exp?.company + " - " + exp?.role}
                    </div>
                    <div className={"rp_experience_div_value_section_year"}>
                      {exp?.duration || exp?.start + " - " + exp.end}
                    </div>
                    <div
                      className={"rp_experience_div_value_section_work"}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(exp.responsibilities),
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${"rp_experience_div"} ${"rp_container"}`}>
            <div
              className={`${"rp_experience_div_label"} ${"rp_container_header"}`}
            >
              Experience
            </div>
            <div
              className={`${"rp_experience_div_value"} ${"rp_container_content"}`}
            >
              {resumeData.experience?.map((exp: any) => {
                return (
                  <div className={"rp_experience_div_value_section"}>
                    <div className={"rp_experience_div_value_section_name"}>
                      {exp?.company + " - " + exp?.role}
                    </div>
                    <div className={"rp_experience_div_value_section_year"}>
                      {exp?.duration || exp?.start + " - " + exp.end}
                    </div>
                    <div
                      className={"rp_experience_div_value_section_work"}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(exp.responsibilities),
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
