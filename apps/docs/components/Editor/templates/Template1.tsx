"use client";
import React from "react";
//@ts-ignore
import DOMPurify from "dompurify";
import "./template1.css";
import { ResumeProps } from "../../../types/ResumeProps";

type Template1Props = {
  resumeData: ResumeProps;
  id: string;
};

export const Template1 = (props: any) => {
  const { resumeData, id } = props;

  // Fallback for undefined properties to prevent errors
  const personalInfo = resumeData.personalInfo || {};
  const experience = resumeData.experience || [];
  const education = resumeData.education || [];
  const coreSkills = resumeData.coreSkills || [];
  const techSkills = resumeData.techSkills || [];
  const projects = resumeData.projects || [];
  const certificates = resumeData.certificates || [];

  const getDuration = (dateString: any) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

  const getInitials = (name: any) => {
    return name?.split?.(" ")?.map((item: any) => item?.[0]);
  };

  // Safely access name for initials
  const initials = getInitials(personalInfo?.name?.toUpperCase() || "");

  return (
    <div className="template-container" id={id}>
      <div className="large">
        <div className="tag">
          {initials?.map((item: any, index: number) => (
            <div className="tag_value" key={index}>
              {item}
            </div>
          ))}
        </div>
        <div className="primary-info">
          <div className="name">
            {personalInfo?.name?.toUpperCase() || "Name"}
          </div>
          <div className="position">{personalInfo?.title || "Title"}</div>
          <div className="information">
            {`${personalInfo?.email || "Email"} | ${personalInfo?.phone || "Phone"} | `}
            <a href={personalInfo?.linkedin || "#"}>
              {personalInfo?.linkedin || "LinkedIn"}
            </a>
          </div>
          <div className="summary">{personalInfo?.bio || "Bio goes here"}</div>
        </div>

        {/* Experience Section */}
        <div className="experience">
          <div className="section-title">WORK EXPERIENCE</div>
          {experience?.map((exp: any, index: any) => (
            <div className="exp-container" key={index}>
              <div className="company-name">{exp.company}</div>
              <div className="role-duration">
                {`${exp.role} | ${getDuration(exp.start)} - ${
                  (!exp.current && exp?.end) || (exp.current && "Present") || ""
                }`}
              </div>
              <div
                className="responsibilities"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(exp.responsibilities),
                }}
              />
            </div>
          ))}
        </div>

        {/* Education Section */}
        <div className="education">
          <div className="section-title">EDUCATION</div>
          {education?.map((edu: any, index: any) => (
            <div className="edu-container" key={index}>
              <div className="college-name">{edu.institution}</div>
              <div className="degree-major">{`${edu.degree} - ${edu.major}`}</div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="skills">
          {!!coreSkills.length && <div className="section-title">SKILLS</div>}
          <div className="core-skills">
            {coreSkills.map((skill: any, index: any) => (
              <div
                className={`skill-container ${index === 0 ? "first" : ""}`}
                key={index}
              >
                <div className="skill">{skill}</div>
              </div>
            ))}
          </div>
          <div className="tech-skills">
            {techSkills.map((skill: any, index: any) => (
              <div
                className={`skill-container ${index === 0 ? "first" : ""}`}
                key={index}
              >
                <div className="skill">{skill}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="projects">
          <div className="section-title">PROJECTS</div>
          {projects?.map((proj: any, index: any) => (
            <div className="proj-container" key={index}>
              <div className="project-name">
                <a href={proj.link || "#"}>{proj.name}</a>
              </div>
              <div className="project-duration">
                {`${getDuration(proj.start)} - ${proj.end ? getDuration(proj.end) : "Present"}`}
              </div>
              <div
                className="project-description"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(proj.description),
                }}
              />
            </div>
          ))}
        </div>

        {/* Certificates Section */}
        <div className="certificates">
          <div className="section-title">CERTIFICATES</div>
          {certificates?.map((cert: any, index: any) => (
            <div className="cert-container" key={index}>
              <div className="certificate-name">{cert.name}</div>
              <div className="certificate-issuer">{cert.issuer}</div>
              <div className="certificate-issuedOn">
                Issued: {getDuration(cert.issuedOn)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
