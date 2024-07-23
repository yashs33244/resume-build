"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import Resume from "./Resume";
import { ResumeProps } from "../interfaces/ResumeProps";
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion"



const sections = ['Personal Info', 'Education', 'Experience', 'Skills', 'Achievement'];

export default function Editor() {
  const [resumeData, setResumeData] = useState<ResumeProps>({
    name: "Dianne Russell",
    title: "UI/UX Designer",
    contact: {
      website: "diannerussell.art",
      email: "hello@diannerussell.com",
      phone: "(629) 555-0129"
    },
    bio: "I'm a UI/UX Designer with over 8 years of experience and a focus on branding, motion graphics, videography, and photography. I have expertise in making digital product designs, such as applications and websites, and I can also implement designs into WordPress.",
    education: [
      {
        institution: "Liceria University",
        years: "2009 - 2012",
        degree: "Bachelor of Computer Technology"
      },
      {
        institution: "Oxford University",
        years: "2012 - 2015",
        degree: "Master of Computer Science - Software Engineering"
      }
    ],
    experience: [
      {
        company: "Facebook",
        role: "Lead UI/UX Designer",
        duration: "SEP 2022 - PRESENT",
        responsibilities: [
          "Led the design direction and created custom UI assets using Figma and Adobe CC, from wireframes to high fidelity interactions",
          "Managed numerous cross-discipline workshops to communicate design intentions and manage expectations across teams"
        ]
      }
    ],
    skills: {
      "UI/UX Design": ["User Research", "Wireframing", "Prototyping"],
      "Development": ["JavaScript", "TypeScript", "React"]
    },
    achievement: {
      title: "Bestfolios, 2022",
      description: "Editor's Pick for Best Design Portfolio"
    }
  });
  const [activeSection, setActiveSection] = useState(sections[0]);

  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const handleDownload = () => {
    const element = document.querySelector("#resume")!;
  
    html2canvas(element, {
      scale: 4,
      logging: false,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
  
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
  
      const canvasWidth = canvas.width * ratio;
      const canvasHeight = canvas.height * ratio;
  
      const marginX = (pageWidth - canvasWidth) / 2;
      const marginY = (pageHeight - canvasHeight) / 2;
  
      pdf.addImage(imgData, 'PNG', marginX, marginY, canvasWidth, canvasHeight, undefined, 'FAST');
  
      pdf.save("resume.pdf");
    });
  };

  const handleInputChange = (section: keyof ResumeProps, field: string, value: any, index?: number, subIndex?: number, category?: string) => {
    setResumeData((prevData) => {
      if (section === 'experience' || section === 'education') {
        const updatedSection = [...prevData[section]!];
        if (index !== undefined && subIndex !== undefined && field === 'responsibilities') {
          const updatedResponsibilities = [...updatedSection[index].responsibilities];
          updatedResponsibilities[subIndex] = value;
          updatedSection[index] = { ...updatedSection[index], responsibilities: updatedResponsibilities };
        } else {
          updatedSection[index!] = { ...updatedSection[index!], [field]: value };
        }
        return { ...prevData, [section]: updatedSection };
      } else if (section === 'skills') {
      const updatedSkills = { ...prevData.skills };
      if (category) {
        const updatedCategorySkills = Array.isArray(updatedSkills[category]) ? [...updatedSkills[category]] : [];
        if (field === 'newSkill') {
          updatedCategorySkills.push(''); // Add an empty string as a new skill
        } else if (field === 'deleteSkill') {
          updatedCategorySkills.splice(index!, 1);
        } else if (field === 'skill') {
          updatedCategorySkills[index!] = value;
        }
        updatedSkills[category] = updatedCategorySkills;
      } else if (field === 'newCategory') {
        updatedSkills[value] = [];
      } else if (field === 'category') {
        const oldCategory = Object.keys(updatedSkills)[index!];
        updatedSkills[value] = updatedSkills[oldCategory];
        delete updatedSkills[oldCategory];
      }
      return { ...prevData, skills: updatedSkills };
    } else if (typeof prevData[section] === 'object' && prevData[section] !== null) {
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [field]: value
          }
        };
      } else {
        return {
          ...prevData,
          [section]: value
        };
      }
    });
  };
  

  const handleAddField = (section: keyof ResumeProps) => {
    if (section === 'skills') {
      handleInputChange('skills', 'newCategory', 'New Category');
    } else if (section === 'experience' || section === 'education') {
      setResumeData((prevData) => {
        const updatedSection = [...prevData[section]!, { responsibilities: [] }]; // Initialize responsibilities
        return { ...prevData, [section]: updatedSection };
      });
    } else if (section === 'achievement') {
      setResumeData((prevData) => ({ ...prevData, achievement: { title: '', description: '' } }));
    }
  };
  

  const handleDeleteField = (section: keyof ResumeProps, index?: number, category?: string) => {
    if (section === 'experience' || section === 'education') {
      setResumeData((prevData) => {
        const updatedSection = prevData[section]?.filter((_, i) => i !== index);
        return { ...prevData, [section]: updatedSection };
      });
    } else if (section === 'skills' && category) {
      const updatedSkills = { ...resumeData.skills };
      delete updatedSkills[category];
      setResumeData((prevData) => ({ ...prevData, skills: updatedSkills }));
    } else if (section === 'achievement') {
      setResumeData((prevData) => ({ ...prevData, achievement: undefined }));
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-foreground dark:bg-[#1a1b1e] dark:text-white">
        <nav className="flex justify-center p-2 bg-gray-900 rounded-full mx-auto my-4 max-w-2xl">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeSection === section
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {section}
            </button>
          ))}
        </nav>
        <main className="flex flex-1 p-4 md:p-10">
  <div className="flex flex-col w-full gap-4 md:flex-row">
    <div className="w-full md:w-1/2">
      <h1 className="text-3xl font-bold">Edit Resume</h1>
      <Accordion type="single" collapsible>
        {activeSection === 'Personal Info' && (
          <AccordionItem value="personal-info">
            <AccordionTrigger>Personal Info</AccordionTrigger>
            <AccordionContent>
              <div className="mt-8">
                <h2 className="text-2xl font-semibold">Personal Info</h2>
                <div className="mt-4">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={resumeData.name || ''}
                    onChange={(e) => handleInputChange('name', 'name', e.target.value)}
                    placeholder="Name"
                  />
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={resumeData.title || ''}
                    onChange={(e) => handleInputChange('title', 'title', e.target.value)}
                    placeholder="Title"
                  />
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={resumeData.contact.website || ''}
                    onChange={(e) => handleInputChange('contact', 'website', e.target.value)}
                    placeholder="Website"
                  />
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={resumeData.contact.email || ''}
                    onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                    placeholder="Email"
                  />
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.contact.phone || ''}
                    onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                    placeholder="Phone"
                  />
                  <Label htmlFor="bio">Bio</Label>
                  <ReactQuill
                    id="bio"
                    value={resumeData.bio || ''}
                    onChange={(value) => handleInputChange('bio', 'bio', value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {activeSection === 'Education' && (
          <AccordionItem value="education">
            <AccordionTrigger>Education</AccordionTrigger>
            <AccordionContent>
              <div className="mt-8">
                <h2 className="text-2xl font-semibold">Education</h2>
                {resumeData.education?.map((edu, index) => (
                  <div key={index} className="mt-4">
                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                    <Input
                      id={`institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                      placeholder="Institution"
                    />
                    <Label htmlFor={`years-${index}`}>Years</Label>
                    <Input
                      id={`years-${index}`}
                      value={edu.years}
                      onChange={(e) => handleInputChange('education', 'years', e.target.value, index)}
                      placeholder="Years"
                    />
                    <Label htmlFor={`degree-${index}`}>Degree</Label>
                    <Input
                      id={`degree-${index}`}
                      value={edu.degree}
                      onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                      placeholder="Degree"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteField('education', index)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <Button variant="default" onClick={() => handleAddField('education')}>
                  Add Education
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {activeSection === 'Experience' && (
          <Accordion type="single" collapsible>
          {activeSection === 'Experience' && (
            <>
              {resumeData.experience.map((exp, index) => (
                <AccordionItem key={exp.id} value={`experience-${index}`}>
                  <AccordionTrigger>
                    <Input
                      value={exp.company}
                      onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                      placeholder="Company"
                    />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mt-4">
                      <Label htmlFor={`role-${index}`}>Role</Label>
                      <Input
                        id={`role-${index}`}
                        value={exp.role}
                        onChange={(e) => handleInputChange('experience', 'role', e.target.value, index)}
                        placeholder="Role"
                      />
                      <Label htmlFor={`duration-${index}`}>Duration</Label>
                      <Input
                        id={`duration-${index}`}
                        value={exp.duration}
                        onChange={(e) => handleInputChange('experience', 'duration', e.target.value, index)}
                        placeholder="Duration"
                      />
                      <Label htmlFor={`responsibilities-${index}`}>Responsibilities</Label>
                      <ReactQuill
                        id={`responsibilities-${index}`}
                        value={exp.responsibilities.join('\n')}
                        onChange={(value) => handleInputChange('experience', 'responsibilities', value.split('\n'), index)}
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteField('experience', index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
              <Button variant="default" onClick={() => handleAddField('experience')}>
                Add Experience
              </Button>
            </>
          )}
          {/* Render other sections similarly */}
        </Accordion>
        )}

        {activeSection === 'Skills' && (
          <AccordionItem value="skills">
            <AccordionTrigger>Skills</AccordionTrigger>
            <AccordionContent>
              <div className="mt-8">
                <h2 className="text-2xl font-semibold">Skills</h2>
                {Object.entries(resumeData.skills).map(([category, skills], index) => (
                  <div key={index} className="mt-4">
                    <Label htmlFor={`category-${index}`}>Category</Label>
                    <Input
                      id={`category-${index}`}
                      value={category}
                      onChange={(e) => handleInputChange('skills', 'category', e.target.value, index)}
                      placeholder="Category"
                    />
                    {Array.isArray(skills) && skills.map((skill, subIndex) => (
                      <div key={subIndex} className="flex items-center mt-2">
                        <Input
                          value={skill}
                          onChange={(e) => handleInputChange('skills', 'skill', e.target.value, subIndex, undefined, category)}
                          placeholder="Skill"
                        />
                        <Button
                          variant="destructive"
                          onClick={() => handleInputChange('skills', 'deleteSkill', '', subIndex, undefined, category)}
                          className="ml-2"
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="default"
                      onClick={() => handleInputChange('skills', 'newSkill', '', undefined, undefined, category)}
                      className="mt-2"
                    >
                      Add Skill
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteField('skills', undefined, category)}
                      className="ml-2"
                    >
                      Delete Category
                    </Button>
                  </div>
                ))}
                <Button variant="default" onClick={() => handleAddField('skills')} className="mt-4">
                  Add Category
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {activeSection === 'Achievement' && (
          <AccordionItem value="achievement">
            <AccordionTrigger>Achievement</AccordionTrigger>
            <AccordionContent>
              <div className="mt-8">
                <h2 className="text-2xl font-semibold">Achievement</h2>
                <Label htmlFor="achievement-title">Title</Label>
                <Input
                  id="achievement-title"
                  value={resumeData.achievement?.title || ''}
                  onChange={(e) => handleInputChange('achievement', 'title', e.target.value)}
                  placeholder="Title"
                />
                <Label htmlFor="achievement-description">Description</Label>
                <ReactQuill
                  id="achievement-description"
                  value={resumeData.achievement?.description || ''}
                  onChange={(value) => handleInputChange('achievement', 'description', value)}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteField('achievement')}
                >
                  Delete
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
    <div className="w-full md:w-1/2">
      <Resume {...resumeData} />
      <Button onClick={handleDownload} className="mt-4">Download as PDF</Button>
    </div>
  </div>
</main>
    </div>
  );
}
