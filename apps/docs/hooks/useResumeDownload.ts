import { useRecoilState } from "recoil";
import { isGeneratingPDFAtom } from "../store/pdfgenerating";
import { resumeTimeAtom } from "../store/expiry";
import { initialResumeData } from "../utils/resumeData";

const useResumeDownload = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useRecoilState(isGeneratingPDFAtom);
  const [resumeTimes, setResumeTimes] = useRecoilState(resumeTimeAtom);

  const updateResumeTime = (id) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const timeLeft = Math.floor((expirationDate - new Date()) / (1000 * 60 * 60 * 24));
    setResumeTimes((prev) => ({ ...prev, [id]: timeLeft }));
  };

  const getResumeDataFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("resumeData");
      return savedData ? JSON.parse(savedData) : initialResumeData;
    }
    return initialResumeData;
  };

  const handleDownload = async (id) => {
    setIsGeneratingPDF(true);
    try {
      const resumeData = getResumeDataFromLocalStorage();
      const htmlContent = generateResumeHTML(resumeData);

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      updateResumeTime(id);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return { handleDownload, isGeneratingPDF };
};

const generateResumeHTML = (resumeData) => {
  const cssLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/(pages)/select-templates/editor/page.css">`;
  
  const getInitials = (name) => {
    return name.split(' ').map(item => item[0]).join('');
  };

  const getDuration = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const initials = getInitials(resumeData.personalInfo.name.toUpperCase());

  const html = `
    <html>
      <head>
        ${cssLink}
        <style>
          /* Add any additional styles here */
        </style>
      </head>
      <body>
        <div class="template-container" id="wrapper">
          <div class="large">
            <div class="tag">
              ${initials.split('').map(item => `<div class="tag_value">${item}</div>`).join('')}
            </div>
            <div class="primary-info">
              <div class="name">${resumeData.personalInfo.name.toUpperCase()}</div>
              <div class="position">${resumeData.personalInfo.title}</div>
              <div class="information">
                ${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | 
                <a href="${resumeData.personalInfo.linkedin}">${resumeData.personalInfo.linkedin}</a>
              </div>
              <div class="summary">${resumeData.personalInfo.bio}</div>
            </div>
            <div class="experience">
              <div class="section-title">WORK EXPERIENCE</div>
              ${resumeData.experience.map(exp => `
                <div class="exp-container">
                  <div class="company-name">${exp.company}</div>
                  <div class="role-duration">${exp.role} | ${getDuration(exp.start)} - ${getDuration(exp.end)}</div>
                  <div class="responsibilities">${exp.responsibilities}</div>
                </div>
              `).join('')}
            </div>
            <div class="education">
              <div class="section-title">EDUCATION</div>
              ${resumeData.education.map(edu => `
                <div class="edu-container">
                  <div class="college-name">${edu.institution}</div>
                  <div class="degree-major">${edu.degree} - ${edu.major}</div>
                </div>
              `).join('')}
            </div>
            <div class="skills">
              ${resumeData.coreSkills.length ? '<div class="section-title">SKILLS</div>' : ''}
              <div class="core-skills">
                ${resumeData.coreSkills.map((skill, index) => `
                  <div class="skill-container ${index === 0 ? 'first' : ''}">
                    <div class="skill">${skill}</div>
                  </div>
                `).join('')}
              </div>
              <div class="tech-skills">
                ${resumeData.techSkills.map((skill, index) => `
                  <div class="skill-container ${index === 0 ? 'first' : ''}">
                    <div class="skill">${skill}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ${resumeData.projects.length ? `
              <div class="projects">
                <div class="section-title">PROJECTS</div>
                ${resumeData.projects.map(project => `
                  <div class="project-container">
                    <div class="project-name">${project.name}</div>
                    <div class="project-duration">${getDuration(project.start)} - ${getDuration(project.end)}</div>
                    <div class="project-link"><a href="${project.link}">${project.link}</a></div>
                    <div class="project-responsibilities">${project.responsibilities}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${resumeData.certificate.length ? `
              <div class="certificates">
                <div class="section-title">CERTIFICATES</div>
                ${resumeData.certificate.map(cert => `
                  <div class="certificate-container">
                    <div class="certificate-name">${cert.name}</div>
                    <div class="certificate-issuer">${cert.issuer}</div>
                    <div class="certificate-date">${getDuration(cert.issuedOn)}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${resumeData.languages.length ? `
              <div class="languages">
                <div class="section-title">LANGUAGES</div>
                ${resumeData.languages.map(lang => `
                  <div class="language-container">
                    <div class="language">${lang}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${resumeData.achievement ? `
              <div class="achievement">
                <div class="section-title">ACHIEVEMENT</div>
                <div class="achievement-title">${resumeData.achievement.title}</div>
                <div class="achievement-description">${resumeData.achievement.description}</div>
              </div>
            ` : ''}
          </div>
        </div>
      </body>
    </html>
  `;

  return html;
};

export default useResumeDownload;