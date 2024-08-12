"use client";
import React from "react";
import { ResumeProps } from "../../types/ResumeProps";
import Image from "next/image";
import { Mail, Phone, Globe, MapPin } from "lucide-react";
import "./resume3.css";

export const Resume3: React.FC<ResumeProps> = ({
  personalInfo,
  experience,
  skills,
  projects,
}) => {
  return (
    <div className="resume3" id="resume3">
      <div className="sidebar">
        <div className="profile-image">
          <Image
            src="/path-to-profile-image.jpg"
            alt={personalInfo.name}
            width={100}
            height={100}
          />
        </div>
        <h1>{personalInfo.name}</h1>
        <h2>{personalInfo.title}</h2>
        <div className="contact-info">
          <p>
            <Mail size={16} /> {personalInfo.email}
          </p>
          <p>
            <Phone size={16} /> {personalInfo.phone}
          </p>
          <p>
            <Globe size={16} /> {personalInfo.website}
          </p>
          <p>
            <MapPin size={16} /> {personalInfo.location}
          </p>
        </div>
        <div className="social-links">
          <h3>Social Links</h3>
          {/* Add social links here */}
        </div>
        <div className="skills">
          <h3>Skills</h3>
          {Object.entries(skills).map(([category, skillList]) => (
            <div key={category}>
              <h4>{category}</h4>
              <div className="skill-list">
                {skillList.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="tools">
          <h3>Tools</h3>
          {/* Add tools here */}
        </div>
      </div>
      <div className="main-content">
        <section className="experience">
          <h3>Experience</h3>
          {experience.map((exp, index) => (
            <div className="experience-item" key={index}>
              <div className="company-logo">{/* Add company logo here */}</div>
              <div className="experience-details">
                <h4>{exp.role}</h4>
                <p className="company-name">{exp.company}</p>
                <p className="duration">{exp.duration}</p>
                <ul>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
        <section className="projects">
          <h3>Projects</h3>
          {projects?.map((project, index) => (
            <div className="project-item" key={index}>
              <div className="company-logo">{/* Add project logo here */}</div>
              <div className="project-details">
                <h4>{project.name}</h4>
                <p className="duration">{project.duration}</p>
                <ul>
                  {project.description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Resume3;
