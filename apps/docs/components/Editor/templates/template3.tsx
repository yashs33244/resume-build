"use client";
import React, { useState } from "react";
//@ts-ignore
import DOMPurify from 'dompurify';
import styles from "./template3.module.scss";
import { IoMail } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export const Template3 = (props:any) => {
    const { resumeData, id } = props;

    return (
        <div className={styles['template-container']} id={id}>
            <div className={styles['lp']}>
                <div className={styles['lp_personalInfo']}>
                    <div className={styles['lp_personalInfo_name']}>{resumeData?.personalInfo?.name}</div>
                    <div className={styles['lp_personalInfo_role']}>{resumeData?.personalInfo?.title}</div>
                </div>
                <div className={styles['lp_add_info']}>
                    <div className={styles['lp_add_info_value']}>
                        <IoMail />
                        {resumeData.personalInfo.email}
                    </div>
                    <div className={styles['lp_add_info_value']}>
                        <FaPhoneAlt/>
                        {resumeData.personalInfo.phone}
                    </div>
                    <div className={styles['lp_add_info_value']}>
                        <FaLinkedin/>
                        <a href={resumeData.personalInfo?.linkedin}>{resumeData.personalInfo?.linkedin}</a>
                    </div>
                </div>
                <div className={`${styles['lp_education_div']} ${styles['lp_container']}`}>
                    <div className={`${styles['lp_education_div_label']} ${styles['lp_container_header']}`}>
                        Education
                    </div>
                    <div className={`${styles['lp_education_div_value']}`}>
                        {
                            resumeData.education?.map((edu:any) => {
                                return(
                                    <div className={styles['lp_education_div_value_section']}>
                                        <div className={styles['lp_education_div_value_section_name']}>{edu?.degree + " - " + edu?.major + ", "+edu?.institution}</div>
                                        <div className={styles['lp_education_div_value_section_year']}>{edu?.start + " - " + edu?.end}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={`${styles['lp_skill_div']} ${styles['lp_container']}`}>
                    <div className={`${styles['lp_skill_div_label']} ${styles['lp_container_header']}`}>
                        Skill
                    </div>
                    <div className={`${styles['lp_skill_div_value']}`}>
                        {
                            resumeData?.coreSkills?.map((item:any)=>{
                                return(
                                    <div className={styles['lp_skill_div_value_item']}>{item}</div>
                                )
                            })
                        }
                        {
                            resumeData?.coreSkills?.map((item:any)=>{
                                return(
                                    <div className={styles['lp_skill_div_value_item']}>{item}</div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className={styles['rp']}>
                <div className={`${styles['rp_bio_div']} ${styles['rp_container']}`}>
                    <div className={`${styles['rp_bio_div_label']} ${styles['rp_container_header']}`}>
                        PROFILE
                    </div>
                    <div className={`${styles['rp_bio_div_value']} ${styles['rp_container_content']}`}>
                        {resumeData.personalInfo.bio}
                    </div>
                </div>
                <div className={`${styles['rp_experience_div']} ${styles['rp_container']}`}>
                    <div className={`${styles['rp_experience_div_label']} ${styles['rp_container_header']}`}>
                        Experience
                    </div>
                    <div className={`${styles['rp_experience_div_value']} ${styles['rp_container_content']}`}>
                        {
                            resumeData.experience?.map((exp:any) => {
                                return(
                                    <div className={styles['rp_experience_div_value_section']}>
                                        <div className={styles['rp_experience_div_value_section_name']}>{exp?.company + " - " + exp?.role}</div>
                                        <div className={styles['rp_experience_div_value_section_year']}>{exp?.duration || (exp?.start + " - " + exp.end)}</div>
                                        <div 
                                            className={styles['rp_experience_div_value_section_work']}
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exp.responsibilities) }}
                                        ></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={`${styles['rp_experience_div']} ${styles['rp_container']}`}>
                    <div className={`${styles['rp_experience_div_label']} ${styles['rp_container_header']}`}>
                        Experience
                    </div>
                    <div className={`${styles['rp_experience_div_value']} ${styles['rp_container_content']}`}>
                        {
                            resumeData.experience?.map((exp:any) => {
                                return(
                                    <div className={styles['rp_experience_div_value_section']}>
                                        <div className={styles['rp_experience_div_value_section_name']}>{exp?.company + " - " + exp?.role}</div>
                                        <div className={styles['rp_experience_div_value_section_year']}>{exp?.duration || (exp?.start + " - " + exp.end)}</div>
                                        <div 
                                            className={styles['rp_experience_div_value_section_work']}
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exp.responsibilities) }}
                                        ></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};