import React from 'react';
import '../app/css/resume.css';

export interface ResumeProps {
  name?: string;
  title?: string;
  contact?: {
    website?: string;
    email?: string;
    phone?: string;
  };
  bio?: string;
  education?: {
    institution: string;
    years: string;
    degree: string;
  }[];
  experience?: {
    company: string;
    role: string;
    duration: string;
    responsibilities?: string[];
  }[];
  skills?: {
    [category: string]: string[];
  };
  achievement?: {
    title: string;
    description: string;
  };
}

export const Resume: React.FC<ResumeProps> = ({
  name = '',
  title = '',
  contact = {},
  bio = '',
  education = [],
  experience = [],
  skills = {},
  achievement = { title: '', description: '' }
}) => {
  return (
    <div className="resume" id="resume" >
      <header>
        <div className="header-left">
          <h1>{name}</h1>
          <h2>{title}</h2>
        </div>
        <div className="header-right">
          <p>{contact.website || ''}</p>
          <p>{contact.email || ''}</p>
          <p>{contact.phone || ''}</p>
        </div>
      </header>

      <section>
        <h3>Bio</h3>
        <p>{bio}</p>
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
            <h4>{exp.company} - {exp.role}</h4>
            <p>{exp.duration}</p>
            <ul>
              {(exp.responsibilities || []).map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h3>Skills</h3>
        {Object.entries(skills).map(([category, skillList], index) => (
          <div key={index}>
            <h4>{category}</h4>
            <p>{skillList.join(', ')}</p>
          </div>
        ))}
      </section>

      <section>
        <h3>Achievement</h3>
        <h4>{achievement.title}</h4>
        <p>{achievement.description}</p>
      </section>
    </div>
  );
};

export default Resume;
