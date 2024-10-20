"use client";
import React from "react";
//@ts-ignore
import DOMPurify from "dompurify";
import "./template1.css";
import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../../store/resumeSize";

type Template1Props = {
  resumeData: ResumeProps;
  id: string;
};

export const Template1 = (props: any) => {
  const { resumeData, id } = props;
  const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);

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
    <div className="template1-container wrapper" id={id}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Inter"
      />
      <div className={`M ${resumeSize}`}>
        {initials && initials.length > 0 && (
          <div className="tag">
            {initials.map((item: any, index: number) => (
              <div className="tag_value" key={index}>
                {item}
              </div>
            ))}
          </div>
        )}
        <div className="primary-info">
          <div className="name">
            {personalInfo?.name?.toUpperCase() || "Name"}
          </div>
          <div className="position">{personalInfo?.title || "Title"}</div>
          <div className="information">
            {`${personalInfo?.email || "Email"} | ${personalInfo?.phone || "Phone"} `}
            <a href={personalInfo?.linkedin || "#"}>
              {`${personalInfo.linkedin ? `| ${personalInfo.linkedin}` : ""}`}
            </a>
          </div>
          <div className="summary">{personalInfo?.bio || ""}</div>
        </div>
        {experience.length > 0 && (
          <div className="experience">
            <div className="section-title">WORK EXPERIENCE</div>
            {experience.map((exp: any, index: any) => (
              <div className="exp-container" key={index}>
                {exp?.company && (
                  <div className="company-name">{exp.company}</div>
                )}
                {(exp?.role || exp?.start || exp?.end) && (
                  <div className="role-duration">
                    {`${exp?.role || ""} | ${getDuration(exp?.start)} - ${exp?.current ? "Present" : getDuration(exp?.end)}`}
                  </div>
                )}
                {exp?.responsibilities && (
                  <div
                    className="responsibilities"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(exp.responsibilities),
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {education.length > 0 && (
          <div className="education">
            <div className="section-title">EDUCATION</div>
            {education.map((edu: any, index: any) => (
              <div className="edu-container" key={index}>
                {edu?.institution && (
                  <div className="college-name">{edu.institution}</div>
                )}
                {(edu?.degree || edu?.major) && (
                  <div className="degree-major">
                    {/* {`${edu?.degree || ""} - ${edu?.major || ""}`} */}
                    {`${edu.degree ? edu.degree : ""} ${edu.major ? `- ${edu.major}` : ""}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {(coreSkills.length > 0 || techSkills.length > 0) && (
          <div className="skills">
            {coreSkills.length > 0 && (
              <div className="section-title">SKILLS</div>
            )}
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
            <div className="core-skills">
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
        )}
        <div className="projects">
          <div className="section-title">PROJECTS</div>
          {projects?.map((proj: any, index: any) => (
            <div className="exp-container" key={index}>
              <div className="company-name">
                <a href={proj.link || "#"}>{proj.name}</a>
              </div>
              <div className="rols-duration">
                {`${getDuration(proj.start)} - ${proj.end ? getDuration(proj.end) : "Present"}`}
              </div>
              <div
                className="responsibilities"
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
