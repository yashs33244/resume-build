import { useCallback, useEffect, useState } from "react";
import { ResumeProps } from "../types/ResumeProps";
import { initialResumeData } from "../utils/resumeData";
import { useFetchResumeData } from "./useFetchResumeData";
import _ from "lodash"; // Lodash for deep comparison
import { ResumeSize, resumeSizeAtom } from "../store/resumeSize";
import { useRecoilState } from "recoil";

const isValidSize = (size: string): size is ResumeSize => {
    return ['XS', 'S', 'M', 'L', 'XL'].includes(size);
  };

export const useResumeData = (onDataChange?: (resumeData: ResumeProps) => void) => {
    
    const [selectedTemplate, setSelectedTemplate] = useState<string>('fresher');
    const [isClient, setIsClient] = useState<boolean>(false);
    const [previousData, setPreviousData] = useState<ResumeProps | null>(null);
    const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);
    const { rdata, template, loading, error, id } = useFetchResumeData();
    const [resumeData, setResumeData] = useState<ResumeProps>(rdata);
  
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && rdata) {
            const fetchedSize = rdata.size;
            if (fetchedSize && isValidSize(fetchedSize)) {
                setResumeSize(fetchedSize);
                window.localStorage.setItem('resumeSize', fetchedSize);
            }
        }
    }, [isClient, rdata]);

    useEffect(() => {
        if (isClient) {
            if (isValidSize(resumeSize)) {
                
                // Update resumeData with new size
                setResumeData(prevData => ({
                    ...prevData,
                    size: resumeSize
                }));

                console.log('Resume Size Updated:', resumeSize);
            } else {
                console.warn(`Invalid resume size: ${resumeSize}. Not saving.`);
            }
        }
    }, [resumeSize, isClient]);

    
    useEffect(() => {
        if (isClient && rdata) {
            const processedData = {
                ...rdata,
                education: Array.isArray(rdata.education) ? rdata.education : [],
                experience: Array.isArray(rdata.experience) ? rdata.experience : [],
                projects: Array.isArray(rdata.projects) ? rdata.projects : [],
                certificates: Array.isArray(rdata.certificates) ? rdata.certificates : [],
                skills: Array.isArray(rdata.skills) ? rdata.skills : [],
                coreSkills: Array.isArray(rdata.coreSkills) ? rdata.coreSkills : [],
                languages: Array.isArray(rdata.languages) ? rdata.languages : [],
                achievements: Array.isArray(rdata.achievements) ? rdata.achievements : [],
            };

            setResumeData(processedData);
            
            // Handle template and size
            if (rdata.templateId) {
                setSelectedTemplate(rdata.templateId);
            }
            
            if (rdata.size && isValidSize(rdata.size)) {
                setResumeSize(rdata.size);
                window.localStorage.setItem('resumeSize', rdata.size);
            }
        }
    }, [isClient, rdata]);

    // Handle data changes and persistence
    useEffect(() => {
        if (isClient && !_.isEqual(previousData, resumeData)) {
            // Ensure all arrays are properly initialized
            const sanitizedData = {
                ...resumeData,
                education: Array.isArray(resumeData.education) ? resumeData.education : [],
                experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
                projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
                certificates: Array.isArray(resumeData.certificates) ? resumeData.certificates : [],
                skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
                coreSkills: Array.isArray(resumeData.coreSkills) ? resumeData.coreSkills : [],
                languages: Array.isArray(resumeData.languages) ? resumeData.languages : [],
                achievements: Array.isArray(resumeData.achievements) ? resumeData.achievements : [],
            };

            setPreviousData(sanitizedData);
            window.localStorage.setItem('resumeData', JSON.stringify(sanitizedData));
            onDataChange?.(sanitizedData);
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
                    newData.personalInfo = {
                        ...newData.personalInfo,
                        name: newData.personalInfo?.name || '',
                        title: newData.personalInfo?.title || '',
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
            } else if (section === "achievements") {
                if (newData.achievements && Array.isArray(newData.achievements) && index !== undefined) {
                    newData.achievements = newData.achievements.map((item, i) =>
                        i === index ? { ...item, [field]: value } : item
                    );
                }
            } else if (field === "size") {
                const newSize = value as ResumeSize;
                if (isValidSize(newSize)) {
                    newData.size = newSize;
                    setResumeSize(newSize); // Update Recoil atom
                    window.localStorage.setItem('resumeSize', newSize);
                } else {
                    console.warn(`Invalid size: ${newSize}. Keeping current size.`);
                }
                return newData;
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
                    { institution: "", start: "", end: "", degree: "", major: "", score: "" },
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
            }else if (section === "achievements") {
                newData.achievements = [
                    ...(prevData.achievements || []),
                    { title: "", description: "" },
                ];
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
            }else if (section === "achievements" && index !== undefined) {
                newData.achievements = (prevData.achievements || []).filter(
                    (_, i) => i !== index
                );
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
