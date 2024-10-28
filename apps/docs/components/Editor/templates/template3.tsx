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
                            {resumeData?.personalInfo?.name}
                        </div>
                        <div className={"lp_personalInfo_role"}>
                            {resumeData?.personalInfo?.title}
                        </div>
                    </div>
                    <div className={"lp_add_info"}>
                        {
                            resumeData?.personalInfo?.email &&
                            <div className={"lp_add_info_value"}>
                                <IoMail/>
                                <span>{resumeData.personalInfo.email}</span>
                            </div>
                        }
                        {
                            resumeData?.personalInfo?.phone &&
                            <div className={"lp_add_info_value"}>
                                <FaPhoneAlt/>
                                <span>{resumeData.personalInfo.phone}</span>
                            </div>
                        }
                        {
                            resumeData?.personalInfo?.linkedin &&
                            <div className={"lp_add_info_value"}>
                                <FaLinkedin/>
                                <a href={resumeData.personalInfo?.linkedin}>
                                    <span>{resumeData.personalInfo?.linkedin}</span>
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
                                Education
                            </div>
                            <div className={`${"lp_education_div_value"}`}>
                                {resumeData.education.map((edu: any, index: number) => {
                                    return (
                                        <div className={"lp_education_div_value_section"} key={index}>
                                            {
                                                edu?.institution &&
                                                <div className={"lp_education_div_value_section_name"}>
                                                    <span>{edu.institution}</span>
                                                    <span>{`${edu.degree ? ` - ${edu.degree}` : ''}`}</span>
                                                    <span>{`${edu.major ? `, ${edu.major}` : ''}`}</span>
                                                </div>
                                            }
                                            {
                                                edu?.start && edu?.end &&
                                                <div className={"lp_education_div_value_section_year"}>
                                                    {edu.start + " - " + edu.end}
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
                                Skill
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
                                Experience
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
                            Projects
                        </div>
                        <div
                            className={`${"rp_experience_div_value"} ${"rp_container_content"}`}
                        >
                        {resumeData.projects?.map((proj: any) => {
                            return (
                            <div className={"rp_projerience_div_value_section"}>
                                <div className={"rp_projerience_div_value_section_name"}>
                                {proj?.name + " - " + proj?.link}
                                </div>
                                <div className={"rp_projerience_div_value_section_year"}>
                                {proj?.start + " - " + proj.end}
                                </div>
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
          <div className={`${"rp_experience_div"} ${"rp_container"}`}>
            <div
              className={`${"rp_experience_div_label"} ${"rp_container_header"}`}
            >
              Certificates
            </div>
            <div
              className={`${"rp_experience_div_value"} ${"rp_container_content"}`}
            >
              {resumeData.certificates?.map((cert: any) => {
                return (
                  <div className={"rp_projerience_div_value_section"}>
                    <div className={"rp_projerience_div_value_section_name"}>
                        <div>
                            <span>{cert?.name}</span>
                            <span className="issuer">{`${cert?.issuer ? `- ${cert.issuer}` : ''}`}</span>
                        </div>
                      {/* {cert?.name + " - " + cert?.issuer} */}
                    </div>
                    <div className={"rp_projerience_div_value_section_year"}>
                      {cert?.issuedOn}
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
