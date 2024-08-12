"use client";
import React from "react";
import { ResumeProps } from "../../types/ResumeProps";
import "./resume2.css";

export const Resume2: React.FC<ResumeProps> = ({
  personalInfo,
  education,
  experience,
  skills,
}) => {
  return (
    <div className="resume2" id="resume2">
      <header>
        <div className="profile-image">
          {/* Add profile image here if available */}
        </div>
        <div className="header-content">
          <h1>{personalInfo.name}</h1>
          <h2>{personalInfo.title}</h2>
          <p>{personalInfo.website}</p>
          <p>{personalInfo.email}</p>
          <p>{personalInfo.phone}</p>
        </div>
      </header>

      <section>
        <h3>Profile</h3>
        <p>{personalInfo.bio}</p>
      </section>

      <section>
        <h3>Experience</h3>
        {experience.map((exp, index) => (
          <div className="experience-item" key={index}>
            <h4>{exp.role}</h4>
            <h5>{exp.company}</h5>
            <p>{exp.duration}</p>
            <ul>
              {exp.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h3>Education</h3>
        {education.map((edu, index) => (
          <div key={index}>
            <h4>{edu.institution}</h4>
            <p>{edu.degree}</p>
            <p>{edu.years}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Skills</h3>
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category}>
            <h4>{category}</h4>
            <ul className="skills-list">
              {skillList.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Resume2;
