"use client";
import React from "react";
//@ts-ignore
import DOMPurify from "dompurify";
import "./template1.css";
import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../../store/resumeSize";
import { ResumeProps } from "../../../types/ResumeProps";
import { IoIosLink } from "react-icons/io";

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
  const achievements = resumeData.achievements || [];
  const projects = resumeData.projects || [];
  const certificates = resumeData.certificates || [];

  const getDuration = (dateString: any) => {
    // console.log("Date string = ", dateString);
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
    <div className={`template1-wrapper ${resumeData.size} wrapper`} id={id}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Inter"
      />
      <div className={`template-container M ${resumeData.size}`}>
        {/* {initials && initials.length > 0 && (
          <div className="tag">
            {initials.map((item: any, index: number) => (
              <div className="tag_value" key={index}>
                {item}
              </div>
            ))}
          </div>
        )} */}
        <div className="primary-info">
          <div className="name">
            <div>{personalInfo?.name?.toUpperCase() || "Full Name"}</div>
            <div className="job-title">{personalInfo?.title || "Job Title"}</div>
          </div>
          {/* <div className="position">{personalInfo?.title || "Job Title"}</div> */}
          <div className="information">
            {`${personalInfo?.email || "Email"} | ${personalInfo?.phone || "Contact Number"} `}
            <a href={personalInfo?.linkedin || "#"}>
              {`${personalInfo.linkedin ? `| LinkedIn` : ""}`}
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
                  <div className="company-name">
                    <div className="company-role">
                      <div>{exp.company}</div>
                      <div className="role">{exp?.role || ""}</div>
                    </div>
                    <div className="company-duration">{`${getDuration(exp?.start)} - ${exp?.current ? "Present" : getDuration(exp?.end)}`}</div>
                  </div>
                )}
                {/* {(exp?.role || exp?.start || exp?.end) && (
                  <div className="role-duration">
                    {`${exp?.role || ""}`}
                  </div>
                )} */}
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
                  <div className="college-name">
                    <div>{edu.institution}</div>
                    <div className="college-duration">{`${edu.start} - ${edu.end}`}</div>
                  </div>
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
        {projects.length > 0 && (
          <div className="projects">
            <div className="section-title">PROJECTS</div>
            {projects.map((proj: any, index: any) => (
              <div className="proj-container" key={index}>
                {proj?.name && (
                  <a className="proj-name" href={proj?.link || null}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>{proj.name} {proj?.link ? <IoIosLink /> : null}</div>
                    <div className="project-duration">{`${getDuration(proj?.start)} - ${proj?.current ? "Present" : getDuration(proj?.end)}`}</div>
                  </a>
                )}
                {(proj?.link || proj?.start || proj?.end) && (
                  <div className="link-duration">
                    {/* {`${getDuration(proj?.start)} - ${proj?.current ? "Present" : getDuration(proj?.end)}`} */}
                  </div>
                )}
                {proj?.responsibilities && (
                  <div
                    className="responsibilities"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(proj.responsibilities),
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {certificates.length > 0 && (
          <div className="certificates">
            <div className="section-title">CERTIFICATES</div>
            <div className="cert-wrapper">
              {certificates.map((cert: any, index: any) => (
                <div className="cert-container" key={index}>
                  {cert?.name && <div className="cert-name">{cert.name}</div>}
                  {(cert?.issuedOn || cert?.issuer) && (
                    <div className="issuing">
                      {`${cert.issuer ? cert.issuer : ""} ${cert.issuedOn ? `- ${getDuration(cert.issuedOn)}` : ""}`}
                    </div>
                  )}
                </div>
              ))}
            </div>            
          </div>
        )}
        {coreSkills.length > 0 && (
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
          </div>
        )}
        {achievements.length > 0 && (
          <div className="projects">
            <div className="section-title">ACHIEVEMENTS</div>
            {achievements.map((ach: any, index: any) => (
              <div className="proj-container" key={index}>
                {ach.title && <div className="proj-name">{ach.title}</div>}
                {ach?.description && (
                  <div
                    className="responsibilities"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(ach.description),
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
