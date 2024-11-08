import { useCallback, useEffect, useState } from "react";
import { ResumeProps } from "../types/ResumeProps";
import { initialResumeData } from "../utils/resumeData";
import { useFetchResumeData } from "./useFetchResumeData";
import _ from "lodash"; // Lodash for deep comparison

export const useResumeData = (onDataChange?: (resumeData: ResumeProps) => void) => {
    const [resumeData, setResumeData] = useState<ResumeProps>(initialResumeData);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('fresher');
    const [isClient, setIsClient] = useState<boolean>(false);
    const [previousData, setPreviousData] = useState<ResumeProps | null>(null);

    const { rdata, template, loading, error, id } = useFetchResumeData();
  
    useEffect(() => {
        setIsClient(true);
    }, []);
    
    // Load initial resumeData from localStorage and avoid redundant fetch
    useEffect(() => {
        if (isClient && rdata) {
            const savedData = JSON.stringify(rdata);
            const parsedData = JSON.parse(savedData);
            const savedTemplate = parsedData.templateId;

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
    }, [isClient, rdata]);
  
    // Only send data changes if resumeData has changed meaningfully
    useEffect(() => {
        if (isClient && !_.isEqual(previousData, resumeData)) {
            setPreviousData(resumeData); // Update to current data after successful change
            window.localStorage.setItem('resumeData', JSON.stringify(resumeData));
            onDataChange?.(resumeData);
        }
    }, [resumeData, isClient, onDataChange, previousData]);

    const handleInputChange = useCallback((
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
                    if (field === "current") {
                        newData.experience = newData.experience.map((item, i) =>
                            i === index ? { ...item, end: value ? "Present" : "" } : item
                        );
                    }
                }
            } else if (section === "projects") {
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
            } else if (section === "languages") {
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
      }, []);

    const handleAddField = useCallback((section: keyof ResumeProps) => {
        setResumeData((prevData) => {
            const newData = { ...prevData };
            if (section === "education") {
                newData.education = [
                    ...(prevData.education || []),
                    { institution: "", start: "", end: "", degree: "", major: "", score: 0 },
                ];
            } else if (section === "experience") {
                newData.experience = [
                    ...(prevData.experience || []),
                    { company: "", role: "", start: "", end: "", responsibilities: [], current: false },
                ];
            } else if (section === "projects") {
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
    }, []);

    const handleDeleteField = useCallback((
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
            } else if (section === "languages" && field === 'language' && index !== undefined) {
                newData.languages = Array.isArray(newData.languages) 
                    ? newData.languages.filter((_, i) => i !== index)
                    : [];
            } else if (section === "achievement") {
                newData.achievement = undefined;
            }
            return newData;
        });
    }, []);

    const setTemplate = (template: string) => {
        setSelectedTemplate(template);
    };

    return {
        loading,
        resumeData,
        setResumeData,
        selectedTemplate,
        handleInputChange,
        handleAddField,
        handleDeleteField,
        setTemplate: setSelectedTemplate,
    };
};
