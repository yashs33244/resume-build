"use client";
import React, { useState } from "react";
import DOMPurify from 'dompurify';
import "./template1.scss";

export const Template1 = (props) => {
    const { resumeData, id } = props;
//   const certificates = resumeData.certificate || [];
//   const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
console.log("DATE = ", console.log(resumeData));

  const getDuration = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });

    return formattedDate;
  }

  return (
    <div className="template-container" id={id}>
        <div className="large">
            <div className="primary-info">
                <div className="name">
                    {resumeData.personalInfo.name.toUpperCase()}
                </div>
                <div className="position">
                    {resumeData.personalInfo.title}
                </div>
                <div className="information">
                    {`${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | `}<a href={resumeData.personalInfo?.linkedin}>{resumeData.personalInfo?.linkedin}</a>
                </div>
                <div className="summary">
                    {resumeData.personalInfo.bio}
                </div>
            </div>
            <div className="experience">
                <div className="section-title">WORK EXPERIENCE</div>
                {resumeData.experience?.map((exp, index) => {
                    return (
                        <div className="exp-container" key={index}>
                            <div className="company-name">{exp.company}</div>
                            <div className="role-duration">{`${exp.role} | ${getDuration(exp.start)} - ${getDuration(exp.end)}`}</div>
                            <div className="responsibilities" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exp.responsibilities) }} />
                        </div>
                    )
                })}
            </div>
            <div className="education">
                <div className="section-title">EDUCATION</div>
                {resumeData.education?.map((edu, index) => {
                    return (
                        <div className="edu-container" key={index}>
                            <div className="college-name">{edu.institution}</div>
                            <div className="degree-major">{`${edu.degree} - ${edu.major}`}</div>
                        </div>
                    )
                })}
            </div>
            <div className="skills">
                <div className="section-title">SKILLS</div>
                <div className="core-skills">
                    {resumeData.coreSkills?.map((skill, index) => {
                        return (
                            <div className={`skill-container ${index === 0 ? 'first' : ''}`} key={index}>
                                <div className="skill">{skill}</div>
                            </div>
                        )
                    })} 
                </div>
                <div className="tech-skills">
                    {resumeData.techSkills?.map((skill, index) => {
                        return (
                            <div className={`skill-container ${index === 0 ? 'first' : ''}`} key={index}>
                                <div className="skill">{skill}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>      
    </div>
  );
};
