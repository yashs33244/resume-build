"use client";
import React, { useState } from "react";
//@ts-ignore
import DOMPurify from "dompurify";
import "./template2.css";

export const Template2 = (props: any) => {
  const { resumeData, id } = props;

  return (
    <div className="template2-wrapper" id={id}>
      <div className={"template-container"}>
        <div className={"header"}>
          <div className={"header_left_part"}>
            <div className={"header_left_part_name"}>
              {resumeData?.personalInfo?.name}
            </div>
            <div className={"header_left_part_role"}>
              {resumeData?.personalInfo?.title}
            </div>
          </div>
          <div className={"header_right_part"}>
            <div className={"header_right_part_url"}>
              {resumeData.personalInfo?.email}
            </div>
            <div className={"header_right_part_phone"}>
              <a href={resumeData.personalInfo?.linkedin}>
                {resumeData.personalInfo?.linkedin}
              </a>
            </div>
            <div className={"header_right_part_email"}>
              {resumeData.personalInfo.phone}
            </div>
          </div>
        </div>
        <div className={"content"}>
          <div className={`${"content_bio_div"} ${"content_container"}`}>
            <div
              className={`${"content_bio_div_label"} ${"content_left_part"}`}
            >
              Bio
            </div>
            <div
              className={`${"content_bio_div_value"} ${"content_right_part"}`}
            >
              {resumeData.personalInfo.bio}
            </div>
          </div>
          <div className={`${"content_education_div"} ${"content_container"}`}>
            <div
              className={`${"content_education_div_label"} ${"content_left_part"}`}
            >
              Education
            </div>
            <div
              className={`${"content_education_div_value"} ${"content_right_part"}`}
            >
              {Array.isArray(resumeData.education) &&
              resumeData.education.length > 0 ? (
                resumeData.education.map((edu: any, index: number) => {
                  return (
                    <div
                      className={"content_education_div_value_section"}
                      key={index}
                    >
                      <div
                        className={"content_education_div_value_section_name"}
                      >
                        {edu?.institution || "Institution Name"}
                      </div>
                      <div
                        className={"content_education_div_value_section_year"}
                      >
                        {edu?.start && edu?.end
                          ? `${edu.start} - ${edu.end}`
                          : "Dates not available"}
                      </div>
                      <div
                        className={"content_education_div_value_section_field"}
                      >
                        {edu?.degree && edu?.major
                          ? `${edu.degree} - ${edu.major}`
                          : "Degree/Major not available"}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No education details available</div>
              )}
            </div>
          </div>
          <div className={`${"content_experience_div"} ${"content_container"}`}>
            <div
              className={`${"content_experience_div_label"} ${"content_left_part"}`}
            >
              Experience
            </div>
            <div
              className={`${"content_experience_div_value"} ${"content_right_part"}`}
            >
              {resumeData.experience?.map((exp: any) => {
                return (
                  <div className={"content_experience_div_value_section"}>
                    <div
                      className={"content_experience_div_value_section_name"}
                    >
                      {exp?.company + " - " + exp?.role}
                    </div>
                    <div
                      className={"content_experience_div_value_section_year"}
                    >
                      {exp?.duration || exp?.start + " - " + exp.end}
                    </div>
                    <div
                      className={"content_experience_div_value_section_work"}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(exp.responsibilities),
                      }}
                    ></div>
                    <div>{exp.current == true ? "currently working" : ""}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${"content_experience_div"} ${"content_container"}`}>
            <div
              className={`${"content_experience_div_label"} ${"content_left_part"}`}
            >
              Projects
            </div>
            <div
              className={`${"content_experience_div_value"} ${"content_right_part"}`}
            >
              {resumeData.projects?.map((proj: any) => {
                return (
                  <div className={"content_experience_div_value_section"}>
                    <div
                      className={"content_experience_div_value_section_name"}
                    >
                      {proj?.name + " - " + proj?.link}
                    </div>
                    <div
                      className={"content_experience_div_value_section_year"}
                    >
                      {proj?.start + " - " + proj.end}
                    </div>
                    <div
                      className={"content_experience_div_value_section_work"}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(proj.responsibilities),
                      }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={`${"content_skill_div"} ${"content_container"}`}>
            <div className={`${"content_skill_div"} ${"content_container"}`}>
              <div
                className={`${"content_skill_div_label"} ${"content_left_part"}`}
              >
                Skills
              </div>
              <div
                className={`${"content_skill_div_value"} ${"content_right_part"}`}
              >
                <div className={"content_skill_div_value_section"}>
                  <div className={"content_skill_div_value_section_category"}>
                    Core Skills
                  </div>
                  <div className={"content_skill_div_value_section_skills"}>
                    {Array.isArray(resumeData?.coreSkills)
                      ? resumeData.coreSkills.join(", ")
                      : "No core skills listed"}
                  </div>
                </div>
                <div className={"content_skill_div_value_section"}>
                  <div className={"content_skill_div_value_section_category"}>
                    Tools and Technologies
                  </div>
                  <div className={"content_skill_div_value_section_skills"}>
                    {Array.isArray(resumeData?.techSkills)
                      ? resumeData.techSkills.join(", ")
                      : "No tech skills listed"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`${"content_acheivement_div"} ${"content_container"}`}
          >
            <div
              className={`${"content_acheivement_div_label"} ${"content_left_part"}`}
            >
              Certificates
            </div>
            <div
              className={`${"content_acheivement_div_value"} ${"content_right_part"}`}
            >
              {resumeData.certificates?.map((cert: any) => {
                return (
                  <div className={"content_acheivement_div_value_section"}>
                    <div
                      className={"content_acheivement_div_value_section_title"}
                    >
                      {cert?.issuer + " - " + cert?.issuedOn}
                    </div>
                    <div
                      className={
                        "content_acheivement_div_value_section_remarks"
                      }
                    >
                      {cert?.name}
                    </div>
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
