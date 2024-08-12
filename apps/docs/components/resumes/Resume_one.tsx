"use client";
import React from "react";
import { ResumeProps } from "../../types/ResumeProps";
import styles from "./resume.module.css";

export const Resume: React.FC<ResumeProps> = ({
  personalInfo = {
    name: "Your Name",
    title: "Title",
    website: "website@",
    email: "email @",
    phone: "+1234567890",
    bio: "Please add a bio",
  },
  education = [],
  experience = [],
  skills = {},
  achievement = { title: "", description: "" },
}) => {
  const renderHtml = (html: string) => {
    return { __html: html };
  };

  return (
    <div className={styles.resume} id="resume">
      <header>
        <div className={styles["header-left"]}>
          <h1>{personalInfo.name}</h1>
          <h2>{personalInfo.title}</h2>
        </div>
        <div className={styles["header-right"]}>
          <p>{personalInfo.website || ""}</p>
          <p>{personalInfo.email || ""}</p>
          <p>{personalInfo.phone || ""}</p>
        </div>
      </header>

      <section>
        <h3>Bio</h3>
        <div dangerouslySetInnerHTML={renderHtml(personalInfo.bio || "")} />
      </section>

      <section>
        <h3>Education</h3>
        <div className="education-grid">
          {education.map((edu, index) => (
            <div key={index}>
              <h4>{edu.institution}</h4>
              <p>{edu.years}</p>
              <p>{edu.degree}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>Experience</h3>
        {experience.map((exp, index) => (
          <div className="experience-item" key={index}>
            <h4>
              {exp.company} - {exp.role}
            </h4>
            <p>{exp.duration}</p>
            <ul>
              {(exp.responsibilities || []).map((resp, i) => (
                <li key={i} dangerouslySetInnerHTML={renderHtml(resp)} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h3>Skills</h3>
        {Object.entries(skills).map(([category, skillList]) => {
          const skillsText = Array.isArray(skillList)
            ? skillList.join(", ")
            : skillList;
          return (
            <div key={category}>
              <h4>{category}</h4>
              <p>{skillsText}</p>
            </div>
          );
        })}
      </section>

      <section>
        <h3>Achievement</h3>
        <h4>{achievement?.title}</h4>
        <div
          dangerouslySetInnerHTML={renderHtml(achievement?.description || "")}
        />
      </section>
    </div>
  );
};

export default Resume;
