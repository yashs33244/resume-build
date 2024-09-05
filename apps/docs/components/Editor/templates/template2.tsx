"use client";
import React, { useState } from "react";
//@ts-ignore
import DOMPurify from 'dompurify';
import styles from "./template2.module.scss";


export const Template2 = (props:any) => {
    const { resumeData, id } = props;

    return (
        <div className={styles['template-container']} id={id}>
            <div className={styles['header']}>
                <div className={styles['header_left_part']}>
                    <div className={styles['header_left_part_name']}>{resumeData?.personalInfo?.name}</div>
                    <div className={styles['header_left_part_role']}>{resumeData?.personalInfo?.title}</div>
                </div>
                <div className={styles['header_right_part']}>
                    <div className={styles['header_right_part_url']}>{resumeData.personalInfo.email}</div>
                    <div className={styles['header_right_part_phone']}>
                        <a href={resumeData.personalInfo?.linkedin}>{resumeData.personalInfo?.linkedin}</a>
                    </div>
                    <div className={styles['header_right_part_email']}>{resumeData.personalInfo.phone}</div>
                </div>
            </div>
            <div className={styles['content']}>
                <div className={`${styles['content_bio_div']} ${styles['content_container']}`}>
                    <div className={`${styles['content_bio_div_label']} ${styles['content_left_part']}`}>
                        Bio
                    </div>
                    <div className={`${styles['content_bio_div_value']} ${styles['content_right_part']}`}>
                        {resumeData.personalInfo.bio}
                    </div>
                </div>
                <div className={`${styles['content_education_div']} ${styles['content_container']}`}>
                    <div className={`${styles['content_education_div_label']} ${styles['content_left_part']}`}>
                        Education
                    </div>
                    <div className={`${styles['content_education_div_value']} ${styles['content_right_part']}`}>
                        {
                            resumeData.education?.map((edu:any) => {
                                return(
                                    <div className={styles['content_education_div_value_section']}>
                                        <div className={styles['content_education_div_value_section_name']}>{edu?.institution}</div>
                                        <div className={styles['content_education_div_value_section_year']}>{edu?.start + " - " + edu?.end}</div>
                                        <div className={styles['content_education_div_value_section_field']}>{edu?.degree + " - " + edu?.major}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={`${styles['content_experience_div']} ${styles['content_container']}`}>
                    <div className={`${styles['content_experience_div_label']} ${styles['content_left_part']}`}>
                        Experience
                    </div>
                    <div className={`${styles['content_experience_div_value']} ${styles['content_right_part']}`}>
                        {
                            resumeData.experience?.map((exp:any) => {
                                return(
                                    <div className={styles['content_experience_div_value_section']}>
                                        <div className={styles['content_experience_div_value_section_name']}>{exp?.company + " - " + exp?.role}</div>
                                        <div className={styles['content_experience_div_value_section_year']}>{exp?.duration || (exp?.start + " - " + exp.end)}</div>
                                        <div 
                                            className={styles['content_experience_div_value_section_work']}
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(exp.responsibilities) }}
                                        ></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={`${styles['content_skill_div']} ${styles['content_container']}`}>
                    <div className={`${styles['content_skill_div_label']} ${styles['content_left_part']}`}>
                        Skill
                    </div>
                    <div className={`${styles['content_skill_div_value']} ${styles['content_right_part']}`}>
                        <div className={styles['content_skill_div_value_section']}>
                            <div className={styles['content_skill_div_value_section_category']}>Core Skills</div>
                            <div className={styles['content_skill_div_value_section_skills']}>{resumeData?.coreSkills?.join(', ')}</div>
                        </div>
                        <div className={styles['content_skill_div_value_section']}>
                            <div className={styles['content_skill_div_value_section_category']}>Tools and Technologies</div>
                            <div className={styles['content_skill_div_value_section_skills']}>{resumeData?.techSkills?.join(', ')}</div>
                        </div>
                    </div>
                </div>
                <div className={`${styles['content_acheivement_div']} ${styles['content_container']}`}>
                    <div className={`${styles['content_acheivement_div_label']} ${styles['content_left_part']}`}>
                        Achievement
                    </div>
                    <div className={`${styles['content_acheivement_div_value']} ${styles['content_right_part']}`}>
                        {
                            resumeData.certificate?.map((achievements:any) => {
                                return(
                                    <div className={styles['content_acheivement_div_value_section']}>
                                        <div className={styles['content_acheivement_div_value_section_title']}>{achievements?.issuer + ' - ' + achievements?.issuedOn}</div>
                                        <div className={styles['content_acheivement_div_value_section_remarks']}>{achievements?.name}</div>
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
