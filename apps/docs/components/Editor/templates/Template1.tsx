"use client";
import React, { useState } from "react";
//@ts-ignore
import DOMPurify from 'dompurify';
import "./template1.scss";

export const Template1 = (props: any) => {
    const { resumeData, id } = props;
    console.log("resumeData", resumeData)

    const getDuration = (dateString: any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
        return formattedDate;
    }
    const getInitials = (name: any) => {
        return (
            name?.split?.(' ')?.map((item: any) => item?.[0])
        )
    }

    const initials = getInitials(resumeData.personalInfo.name.toUpperCase());

    return (
        <div className="template-container" id={id}>
            <div className="large">
                <div className="tag">
                    {
                        initials?.map((item: any) => {
                            return (
                                <div className="tag_value">
                                    {item}
                                </div>
                            )
                        })
                    }
                </div>
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
                    {!!resumeData?.coreSkills?.length && <div className="section-title">SKILLS</div>}
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
