import { useEffect, useState } from "react";
import { ResumeProps } from "../types/ResumeProps";
import { initialResumeData } from "../utils/resumeData";

export const useResumeData = () => {
    const [resumeData, setResumeData] = useState<ResumeProps>(initialResumeData);
    const [selectedTemplate, setSelectedTemplate] = useState<string>("fresher");
    const [isClient, setIsClient] = useState<boolean>(false);   

    useEffect(() => {
        setIsClient(true);
    },[]);

    useEffect(() => {
        if (isClient) {
            const savedData = window.localStorage.getItem("resumeData");
            const savedTemplate = window.localStorage.getItem("selectedTemplate");
            
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (!Array.isArray(parsedData.coreSkills)) {
                    parsedData.coreSkills = [];
                }
                if (!Array.isArray(parsedData.languages)) {
                    parsedData.languages = [];
                }
                setResumeData(parsedData);    
            }
            
            if (savedTemplate) {
                setSelectedTemplate(savedTemplate);
            }
        }
    }, [isClient]);

    useEffect(() => {
        if (isClient) {
            window.localStorage.setItem("resumeData", JSON.stringify(resumeData));
            window.localStorage.setItem("selectedTemplate", selectedTemplate);
        }
    }, [resumeData, selectedTemplate, isClient]);

    const handleInputChange = (
        section: keyof ResumeProps,
        field: string,
        value: any,
        index?: number
    ) => {
        setResumeData((prevData) => {
            const newData = { ...prevData } as ResumeProps;

            if (section === "personalInfo") {
                //@ts-ignore
                newData.personalInfo = {
                    ...newData.personalInfo,
                    [field]: value,
                };
            } else if (section === "education") {
                if (newData.education && Array.isArray(newData.education) && index !== undefined) {
                    newData.education = newData.education.map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    );
                }
            } else if (section === "experience") {
                if (newData.experience && Array.isArray(newData.experience) && index !== undefined) {
                    newData.experience = newData.experience.map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    );
                    // change current 
                    if (field === "current") {
                        newData.experience = newData.experience.map((item, i) =>
                            i === index ? { ...item, end: value ? "Present" : "" } : item
                        );
                    }
                }
            } else if (section === "projects") { // Fix this to match "projects"
                if (newData.projects && Array.isArray(newData.projects) && index !== undefined) {
                    newData.projects = newData.projects.map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    );
                }
            } else if (section === "certificates") {
                if (newData.certificates && Array.isArray(newData.certificates) && index !== undefined) {
                    newData.certificates = newData.certificates.map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    );
                }
            } else if (section === "skills") {
                if (field === "coreSkill" && index !== undefined) {
                    const currentSkills = Array.isArray(newData.coreSkills) ? newData.coreSkills : [];
                    newData.coreSkills = [
                        ...currentSkills.slice(0, index),
                        value,
                        ...currentSkills.slice(index + 1)
                    ];
                }
            } else if (section === "languages") { // Fix this to match "languages"
                if (index !== undefined) {
                    const currentLanguages = Array.isArray(newData.languages) ? newData.languages : [];
                    newData.languages = [
                        ...currentLanguages.slice(0, index),
                        value,
                        ...currentLanguages.slice(index + 1)
                    ];
                }
            } else if (section === "achievement") {
                newData.achievement = {
                    ...newData.achievement,
                    [field]: value,
                } as { title: string; description: string };
            } else {
                (newData as any)[field] = value;
            }

            return newData;
        });
    };

    const handleAddField = (section: keyof ResumeProps) => {
      setResumeData((prevData) => {
          const newData = { ...prevData };
          if (section === "education") {
              newData.education = [
                  ...(prevData.education || []),
                  { institution: "", start: "", end: "", degree: "" , major: "" },
              ];
          } else if (section === "experience") {
              newData.experience = [
                  ...(prevData.experience || []),
                  { company: "", role: "", start: "", end: "", responsibilities: [] , current: false },
              ];
          } else if (section === "projects") { // Fix this to match "projects"
            newData.projects = [
                ...(prevData.projects || []),
                { name: "", link: "", start: "", end: "", responsibilities: [] },
            ];
          } else if (section === "certificates") {
            newData.certificates = [
                ...(prevData.certificates || []),
                { name: "", issuer: "", issuedOn: "" },
            ];
          } else if (section === "skills") {
              newData.skills = Array.isArray(prevData.skills) 
                  ? [...prevData.skills, ""]
                  : [""];
          } else if (section === "languages") {
             newData.languages = Array.isArray(prevData.languages) 
                ? [...prevData.languages, ""]
                : [""];
          }
          return newData;
      });
    };

    const handleDeleteField = (
        section: keyof ResumeProps,
        field: string,
        index?: number
    ) => {
        setResumeData((prevData) => {
            const newData = { ...prevData };
            if (section === "education" || section === "experience" || section === "projects" || section === "certificates") {
                (newData[section] as any[]) = (prevData[section] as any[]).filter(
                    (_, i) => i !== index
                );
                
            } else if (section === "skills" && field === 'coreSkill' && index !== undefined) {
                newData.coreSkills = Array.isArray(newData.coreSkills) 
                    ? newData.coreSkills.filter((_, i) => i !== index)
                    : [];
            } else if (section === "skills" && field === 'techSkill' && index !== undefined) {
                newData.techSkills = Array.isArray(newData.techSkills) 
                    ? newData.techSkills.filter((_, i) => i !== index)
                    : [];
            } else if (section === "languages" && field === 'language' && index !== undefined) {
                newData.languages = Array.isArray(newData.languages) 
                    ? newData.languages.filter((_, i) => i !== index)
                    : [];
            } else if (section === "achievement") {
                newData.achievement = undefined;
            }
            return newData;
        });
    };
    const setTemplate = (template: string) => {
        setSelectedTemplate(template);
    };


    return {
        resumeData,
        selectedTemplate,
        handleInputChange,
        handleAddField,
        handleDeleteField,
        setTemplate,
    };
};