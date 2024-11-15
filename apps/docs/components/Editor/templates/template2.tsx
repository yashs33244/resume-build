"use client";
import React, { useState } from "react";
//@ts-ignore
import "./template2.css";
import DOMPurify from "dompurify";
import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../../store/resumeSize";
import { getDuration } from "../../../utils";

export const Template2 = (props: any) => {
  const { resumeData, id } = props;
  // console.log("Resume data = ", resumeData);
  console.log("Resume data = ", resumeData);
  const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);

  return (
    <div className={`template2-wrapper ${resumeSize} wrapper`} id={id}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Inter"
      />
      <div className={"template-container"}>
        <div className={"header"}>
          <div className={"header_left_part"}>
            <div className={"header_left_part_name"}>
              {resumeData?.personalInfo?.name || "Full Name"}
            </div>
            <div className={"header_left_part_role"}>
              {resumeData?.personalInfo?.title || "Job Title"}
            </div>
          </div>
          <div className={"header_right_part"}>
            <div className={"header_right_part_url"}>
              {resumeData?.personalInfo?.email || "Email"}
            </div>
            <div className={"header_right_part_phone"}>
              <a href={resumeData?.personalInfo?.linkedin || "#"}>
                {`${resumeData?.personalInfo.linkedin ? `LinkedIn` : ""}`}
              </a>
            </div>
            <div className={"header_right_part_email"}>
              {resumeData?.personalInfo?.phone || "Contact Number"}
            </div>
          </div>
        </div>
        <div className={"content"}>
          {resumeData?.personalInfo?.bio && (
            <div className={`${"content_bio_div"} ${"content_container"}`}>
              <div
                className={`${"content_bio_div_label"} ${"content_left_part"}`}
              >
                Bio
              </div>
              <div
                className={`${"content_bio_div_value"} ${"content_right_part"}`}
              >
                {resumeData?.personalInfo?.bio}
              </div>
            </div>
          )}
          {Array.isArray(resumeData?.education) &&
            resumeData?.education.length > 0 && (
              <div
                className={`${"content_education_div"} ${"content_container"}`}
              >
                <div
                  className={`${"content_education_div_label"} ${"content_left_part"}`}
                >
                  Education
                </div>
                <div
                  className={`${"content_education_div_value"} ${"content_right_part"}`}
                >
                  {resumeData.education.map((edu: any, index: number) => {
                    return (
                      <div
                        className={"content_education_div_value_section"}
                        key={index}
                      >
                        {edu?.institution && (
                          <div
                            className={
                              "content_education_div_value_section_name"
                            }
                          >
                            {edu?.institution || "Institution Name"}
                          </div>
                        )}
                        {Number(edu?.score) > 0 && (
                          <div
                            className={
                              "content_education_div_value_section_field"
                            }
                          >
                            CGPA {edu.score}
                          </div>
                        )}
                        {edu?.start && edu?.end && (
                          <div
                            className={
                              "content_education_div_value_section_year"
                            }
                          >
                            {edu?.start && edu?.end
                              ? `${edu.start} - ${edu.end}`
                              : "Dates not available"}
                          </div>
                        )}
                        {edu?.degree && edu?.major && (
                          <div
                            className={
                              "content_education_div_value_section_field"
                            }
                          >
                            {edu?.degree && edu?.major
                              ? `${edu.degree} - ${edu.major}`
                              : "Degree/Major not available"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          {Array.isArray(resumeData?.experience) &&
            resumeData?.experience.length > 0 && (
              <div
                className={`${"content_experience_div"} ${"content_container"}`}
              >
                <div
                  className={`${"content_experience_div_label"} ${"content_left_part"}`}
                >
                  Experience
                </div>
                <div
                  className={`${"content_experience_div_value"} ${"content_right_part"}`}
                >
                  {resumeData?.experience.map((exp: any, index: number) => {
                    return (
                      <div
                        className={"content_experience_div_value_section"}
                        key={index}
                      >
                        {exp?.company && exp?.role && (
                          <div
                            className={
                              "content_experience_div_value_section_name"
                            }
                          >
                            {exp?.company + " - " + exp?.role}
                          </div>
                        )}
                        {(exp?.start || exp?.end || exp?.duration) && (
                          <div
                            className={
                              "content_experience_div_value_section_year"
                            }
                          >
                            {exp?.duration ||
                              getDuration(exp?.start) +
                                " - " +
                                (exp?.current
                                  ? "Present"
                                  : getDuration(exp?.end))}
                          </div>
                        )}
                        {exp?.responsibilities && (
                          <div
                            className={
                              "content_experience_div_value_section_work"
                            }
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(exp?.responsibilities),
                            }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          {Array.isArray(resumeData?.projects) &&
            resumeData?.projects.length > 0 && (
              <div
                className={`${"content_projects_div"} ${"content_container"}`}
              >
                <div
                  className={`${"content_projects_div_label"} ${"content_left_part"}`}
                >
                  Projects
                </div>
                <div
                  className={`${"content_projects_div_value"} ${"content_right_part"}`}
                >
                  {resumeData?.projects.map((proj: any, index: number) => {
                    return (
                      <div
                        className={"content_projects_div_value_section"}
                        key={index}
                      >
                        {proj?.name && proj?.link && (
                          <div
                            className={
                              "content_projects_div_value_section_name"
                            }
                          >
                            {proj?.name + " - " + proj?.link}
                          </div>
                        )}
                        {(proj?.start || proj?.end || proj?.duration) && (
                          <div
                            className={
                              "content_projects_div_value_section_year"
                            }
                          >
                            {proj?.duration ||
                              getDuration(proj?.start) +
                                " - " +
                                (proj?.current
                                  ? "Present"
                                  : getDuration(proj?.end))}
                          </div>
                        )}
                        {proj?.responsibilities && (
                          <div
                            className={
                              "content_projects_div_value_section_work"
                            }
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                proj?.responsibilities,
                              ),
                            }}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          {Array.isArray(resumeData?.certificates) &&
            resumeData?.certificates.length > 0 && (
              <div
                className={`${"content_certificates_div"} ${"content_container"}`}
              >
                <div
                  className={`${"content_certificates_div_label"} ${"content_left_part"}`}
                >
                  Certificates
                </div>
                <div
                  className={`${"content_certificates_div_value"} ${"content_right_part"}`}
                >
                  {resumeData.certificates.map((cert: any, index: number) => {
                    return (
                      <div
                        className={"content_certificates_div_value_section"}
                        key={index}
                      >
                        {cert?.name && (
                          <div
                            className={
                              "content_certificates_div_value_section_name"
                            }
                          >
                            {cert?.name || "Certificate Name"}
                          </div>
                        )}
                        {cert?.issuedOn && (
                          <div
                            className={
                              "content_certificates_div_value_section_year"
                            }
                          >
                            {cert?.issuedOn
                              ? getDuration(cert.issuedOn)
                              : "Date not available"}
                          </div>
                        )}
                        {cert.issuer && (
                          <div
                            className={
                              "content_certificates_div_value_section_field"
                            }
                          >
                            {cert?.issuer
                              ? cert.issuer
                              : "Issuer not available"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          {Array.isArray(resumeData?.coreSkills) &&
            resumeData?.coreSkills?.length > 0 && (
              <div className={`${"content_skill_div"} ${"content_container"}`}>
                <div
                  className={`${"content_skill_div_label"} ${"content_left_part"}`}
                >
                  Skills
                </div>
                <div
                  className={`${"content_skill_div_value"} ${"content_right_part"}`}
                >
                  {Array.isArray(resumeData?.coreSkills) &&
                    resumeData?.coreSkills?.length > 0 && (
                      <div className={"content_skill_div_value_section"}>
                        {/* <div
                      className={"content_skill_div_value_section_category"}
                    >
                      Core Skills
                    </div> */}
                        <div
                          className={"content_skill_div_value_section_skills"}
                        >
                          {resumeData?.coreSkills.join(", ")}
                        </div>
                      </div>
                    )}
                  {/* Uncomment this section if you want to display tech skills */}
                  {/* {Array.isArray(resumeData?.techSkills) &&
                resumeData?.techSkills?.length > 0 && (
                  <div className={"content_skill_div_value_section"}>
                    <div
                      className={"content_skill_div_value_section_category"}
                    >
                      Tools and Technologies
                    </div>
                    <div className={"content_skill_div_value_section_skills"}>
                      {resumeData?.techSkills.join(", ")}
                    </div>
                  </div>
                )} */}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
