import { useEffect, useState } from "react";
import { ResumeProps } from "../types/ResumeProps";
import { initialResumeData } from "../utils/resumeData";

export const useResumeData = () => {
    const [resumeData, setResumeData] = useState<ResumeProps>(initialResumeData);
    const [isClient, setIsClient] = useState<boolean>(false);   

    useEffect(() => {
        setIsClient(true);
    },[]);

    useEffect(() => {
      const saveData = isClient ?
          window.localStorage.getItem("resumeData") : null;
      if(saveData){
          const parsedData = JSON.parse(saveData);
          if (!Array.isArray(parsedData.coreSkills)) {
              parsedData.coreSkills = [];
          }
          if (!Array.isArray(parsedData.techSkills)) {
            parsedData.techSkills = [];
          }
          if (!Array.isArray(parsedData.languages)) {
            parsedData.languages = [];
          }
          setResumeData(parsedData);    
      }
    },[isClient]);

    useEffect(()=>{
        if(isClient){
            window.localStorage.setItem("resumeData", JSON.stringify(resumeData));
        }
    },[resumeData,isClient]);

    const handleInputChange = (
        section: keyof ResumeProps,
        field: string,
        value: any,
        index?: number
    ) => {
        setResumeData((prevData) => {
            const newData = { ...prevData } as ResumeProps;

            if (section === "personalInfo") {
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
                }
            } else if (section === "project") {
                if (newData.project && Array.isArray(newData.project) && index !== undefined) {
                    newData.project = newData.project.map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    );
                }
            } else if (section === "certificate") {
                if (newData.certificate && Array.isArray(newData.certificate) && index !== undefined) {
                    newData.certificate = newData.certificate.map((item, i) =>
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
                if (field === "techSkill" && index !== undefined) {
                    const currentSkills = Array.isArray(newData.techSkills) ? newData.techSkills : [];
                    newData.techSkills = [
                        ...currentSkills.slice(0, index),
                        value,
                        ...currentSkills.slice(index + 1)
                    ];
                }
            } else if (section === "language") {
                if (field === "language" && index !== undefined) {
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
                  { institution: "", years: "", degree: "" },
              ];
          } else if (section === "experience") {
              newData.experience = [
                  ...(prevData.experience || []),
                  { company: "", role: "", duration: "", responsibilities: [] },
              ];
          } else if (section === "project") {
            newData.project = [
                ...(prevData.project || []),
                { name: "", link: "", start: "", end: "", responsibilities: [] },
            ];
          } else if (section === "certificate") {
            newData.certificate = [
                ...(prevData.certificate || []),
                { name: "", issuer: "", issuedOn: "" },
            ];
          } else if (section === "skills") {
              newData.skills = Array.isArray(prevData.skills) 
                  ? [...prevData.skills, ""]
                  : [""];
          } else if (section === "language") {
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
            if (section === "education" || section === "experience" || section === "project" || section === "certificate") {
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
            } else if (section === "language" && field === 'language' && index !== undefined) {
                newData.languages = Array.isArray(newData.languages) 
                    ? newData.languages.filter((_, i) => i !== index)
                    : [];
            } else if (section === "achievement") {
                newData.achievement = undefined;
            }
            return newData;
        });
    };

    return {
        resumeData,
        handleInputChange,
        handleAddField,
        handleDeleteField,
    };
};