"use client";
import React, { useState } from "react";
//@ts-ignore
import DOMPurify from "dompurify";
import "./template3.css";
import { IoMail } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../../store/resumeSize";
import { getDuration } from "../../../utils";
import { IoIosLink } from "react-icons/io";

export const Template3 = (props: any) => {
    const { resumeData, id } = props;
    const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);

    return (
        <div className={`template3-wrapper ${resumeSize} wrapper`} id={id}>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Inter"
            />
            <div className={"template-container"}>
                <div className={"lp"}>
                    <div className={"lp_personalInfo"}>
                        <div className={"lp_personalInfo_name"}>
                            {resumeData?.personalInfo?.name || "Full Name"}
                        </div>
                        <div className={"lp_personalInfo_role"}>
                            {resumeData?.personalInfo?.title || "Job Title"}
                        </div>
                    </div>
                    <div className={"lp_add_info"}>
                        {
                            resumeData?.personalInfo?.email &&
                            <div className={"lp_add_info_value"}>
                                <IoMail/>
                                <span>{resumeData?.personalInfo?.email || "Email"}</span>
                            </div>
                        }
                        {
                            resumeData?.personalInfo?.phone &&
                            <div className={"lp_add_info_value"}>
                                <FaPhoneAlt/>
                                <span>{resumeData?.personalInfo?.phone || "Contact Number"}</span>
                            </div>
                        }
                        {
                            resumeData?.personalInfo?.linkedin &&
                            <div className={"lp_add_info_value"}>
                                <FaLinkedin/>
                                <a href={resumeData.personalInfo?.linkedin}>
                                    <span>{resumeData.personalInfo?.linkedin ? 'LinkedIn' : ''}</span>
                                </a>
                            </div>
                        }
                    </div>
                    {
                        Array.isArray(resumeData?.education) && resumeData.education.length > 0 &&
                        <div className={`${"lp_education_div"} ${"lp_container"}`}>
                            <div
                                className={`${"lp_education_div_label"} ${"lp_container_header"}`}
                            >
                                EDUCATION
                            </div>
                            <div className={`${"lp_education_div_value"}`}>
                                {resumeData.education.map((edu: any, index: number) => {
                                    return (
                                        <div className={"lp_education_div_value_section"} key={index}>
                                            {
                                                edu?.institution &&
                                                <div className={"lp_education_div_value_section_name"}>
                                                    <span>{`${edu.degree ? `${edu.degree}, ` : ''}`}</span>
                                                    <span>{`${edu.institution ? `${edu.institution}` : ''}`}</span>
                                                </div>
                                            }
                                            {
                                                edu?.start && edu?.end &&
                                                <div className={"lp_education_div_value_section_year"}>
                                                    {edu.start + " - " + edu.end}
                                                </div>
                                            }
                                            {
                                                edu?.major &&
                                                <div className={"lp_education_div_value_section_major"}>
                                                    {edu.major}
                                                </div>
                                            }                                            
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    }
                    {
                        Array.isArray(resumeData?.certificates) && resumeData.certificates.length > 0 &&
                        <div className={`${"lp_certificate_div"} ${"lp_container"}`}>
                            <div
                                className={`${"lp_certificate_div_label"} ${"lp_container_header"}`}
                            >
                                CERTIFICATES
                            </div>
                            <div className={`${"lp_certificate_div_value"}`}>
                                {resumeData.certificates.map((cert: any, index: number) => {
                                    return (
                                        <div className={"lp_certificate_div_value_section"} key={index}>
                                            {
                                                cert?.name &&
                                                <div className={"lp_certificate_div_value_section_name"}>
                                                    <span>{`${cert.name ? `${cert.name}` : ''}`}</span>
                                                </div>
                                            }
                                            {
                                                cert?.issuedOn &&
                                                <div className={"lp_certificate_div_value_section_year"}>
                                                    {cert.issuedOn}
                                                </div>
                                            }
                                            {
                                                cert?.issuer &&
                                                <div className={"lp_certificate_div_value_section_major"}>
                                                    {cert.issuer}
                                                </div>
                                            }                                            
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    }
                    {
                        Array.isArray(resumeData?.coreSkills) && resumeData.coreSkills.length > 0 &&
                        <div className={`${"lp_skill_div"} ${"lp_container"}`}>
                            <div className={`${"lp_skill_div_label"} ${"lp_container_header"}`}>
                                SKILLS
                            </div>
                            <div className={`${"lp_skill_div_value"}`}>
                                {resumeData.coreSkills.map((item: any, index: number) => (
                                    <div key={index} className={"lp_skill_div_value_item"}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
                <div className={"rp"}>
                    {
                        resumeData?.personalInfo?.bio &&
                        <div className={`${"rp_bio_div"} ${"rp_container"}`}>
                            <div className={`${"rp_bio_div_label"} ${"rp_container_header"}`}>
                                PROFILE
                            </div>
                            <div className={`${"rp_bio_div_value"} ${"rp_container_content"}`}>
                                {resumeData.personalInfo.bio}
                            </div>
                        </div>
                    }
                    {
                        Array.isArray(resumeData?.experience) && resumeData.experience.length > 0 &&
                        <div className={`${"rp_experience_div"} ${"rp_container"}`}>
                            <div className={`${"rp_experience_div_label"} ${"rp_container_header"}`}>
                                WORK EXPERIENCE
                            </div>
                            <div className={`${"rp_experience_div_value"} ${"rp_container_content"}`}>
                                {resumeData.experience.map((exp: any, index: number) => {
                                    return (
                                        <div className={"rp_experience_div_value_section"} key={index}>
                                            {
                                                exp?.company && exp?.role &&
                                                <div className={"rp_experience_div_value_section_name"}>
                                                    {exp.company + " - " + exp.role}
                                                </div>
                                            }
                                            {
                                                (exp?.start || exp?.end || exp?.duration) &&
                                                <div className={"rp_experience_div_value_section_year"}>
                                                    {exp?.duration || getDuration(exp.start) + " - " + (exp.current ? "Present" : getDuration(exp.end))}
                                                </div>
                                            }
                                            {
                                                exp?.responsibilities &&
                                                <div
                                                    className={"rp_experience_div_value_section_work"}
                                                    dangerouslySetInnerHTML={{
                                                        __html: DOMPurify.sanitize(exp.responsibilities),
                                                    }}
                                                ></div>
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    }
                    {Array.isArray(resumeData?.projects) && resumeData.projects.length > 0 && <div className={`${"rp_experience_div"} ${"rp_container"}`}>
                        <div
                            className={`${"rp_experience_div_label"} ${"rp_container_header"}`}
                        >
                            PROJECTS
                        </div>
                        <div
                            className={`${"rp_experience_div_value"} ${"rp_container_content"}`}
                        >
                        {resumeData.projects?.map((proj: any) => {
                            return (
                            <div className={"rp_projerience_div_value_section"}>
                                <a className={"rp_projerience_div_value_section_name"} href={proj?.link || null}>
                                {proj?.name} {proj?.link ? <IoIosLink /> : null}
                                </a>
                                {(proj?.start || proj?.end) && <div className={"rp_projerience_div_value_section_year"}>
                                {getDuration(proj?.start) + " - " + getDuration(proj.end)}
                                </div>}
                                <div
                                className={"rp_projerience_div_value_section_work"}
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(proj.responsibilities),
                                }}
                                ></div>
                            </div>
                            );
                        })}
                        </div>
                    </div>}          
                </div>
            </div>
        </div>
    );
};
