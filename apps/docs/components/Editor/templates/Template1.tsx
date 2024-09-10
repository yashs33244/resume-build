"use client";
import React, { useState } from "react";
import DOMPurify from "dompurify";
import "./template1.scss";

export const Template1 = (props) => {
  const { resumeData, id } = props;

  // Check if resumeData is available before rendering
  if (!resumeData) {
    return <div>Loading...</div>;
  }

  console.log("DATE = ", resumeData);

  const getDuration = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    return formattedDate;
  };

  return (
    <div className="template-container" id={id}>
      <div className="large">
        <div className="primary-info">
          <div className="name">
            {resumeData?.personalInfo?.name?.toUpperCase() ||
              "Name Not Provided"}
          </div>
          <div className="position">
            {resumeData?.personalInfo?.title || "Position Not Provided"}
          </div>
          <div className="information">
            {`${resumeData?.personalInfo?.email || "Email Not Provided"} | ${resumeData?.personalInfo?.phone || "Phone Not Provided"} | `}
            {resumeData?.personalInfo?.linkedin && (
              <a href={resumeData?.personalInfo?.linkedin}>
                {resumeData.personalInfo.linkedin}
              </a>
            )}
          </div>
          <div className="summary">
            {resumeData?.personalInfo?.bio || "Bio not available"}
          </div>
        </div>

        <div className="experience">
          <div className="section-title">WORK EXPERIENCE</div>
          {resumeData?.experience?.length ? (
            resumeData.experience.map((exp, index) => (
              <div className="exp-container" key={index}>
                <div className="company-name">
                  {exp.company || "Company not provided"}
                </div>
                <div className="role-duration">
                  {`${exp.role || "Role not provided"} | ${getDuration(exp.start)} - ${getDuration(exp.end)}`}
                </div>
                <div
                  className="responsibilities"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(exp.responsibilities || ""),
                  }}
                />
              </div>
            ))
          ) : (
            <div>No work experience provided</div>
          )}
        </div>

        <div className="education">
          <div className="section-title">EDUCATION</div>
          {resumeData?.education?.length ? (
            resumeData.education.map((edu, index) => (
              <div className="edu-container" key={index}>
                <div className="college-name">
                  {edu.institution || "Institution not provided"}
                </div>
                <div className="degree-major">{`${edu.degree || "Degree not provided"} - ${edu.major || "Major not provided"}`}</div>
              </div>
            ))
          ) : (
            <div>No education details provided</div>
          )}
        </div>

        <div className="skills">
          <div className="section-title">SKILLS</div>
          {resumeData?.coreSkills?.length ? (
            <div className="core-skills">
              {resumeData.coreSkills.map((skill, index) => (
                <div
                  className={`skill-container ${index === 0 ? "first" : ""}`}
                  key={index}
                >
                  <div className="skill">{skill}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>No core skills provided</div>
          )}

          {resumeData?.techSkills?.length ? (
            <div className="tech-skills">
              {resumeData.techSkills.map((skill, index) => (
                <div
                  className={`skill-container ${index === 0 ? "first" : ""}`}
                  key={index}
                >
                  <div className="skill">{skill}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>No technical skills provided</div>
          )}
        </div>
      </div>
    </div>
  );
};
