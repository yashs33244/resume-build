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
          if (!Array.isArray(parsedData.skills)) {
              parsedData.skills = [];
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
            } else if (section === "skills") {
                if (field === "skill" && index !== undefined) {
                    const currentSkills = Array.isArray(newData.skills) ? newData.skills : [];
                    newData.skills = [
                        ...currentSkills.slice(0, index),
                        value,
                        ...currentSkills.slice(index + 1)
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
          } else if (section === "skills") {
              newData.skills = Array.isArray(prevData.skills) 
                  ? [...prevData.skills, ""]
                  : [""];
          }
          return newData;
      });
    };

    const handleDeleteField = (
        section: keyof ResumeProps,
        index?: number
    ) => {
        setResumeData((prevData) => {
            const newData = { ...prevData };
            if (section === "education" || section === "experience") {
                (newData[section] as any[]) = (prevData[section] as any[]).filter(
                    (_, i) => i !== index
                );
            } else if (section === "skills" && index !== undefined) {
                newData.skills = Array.isArray(newData.skills) 
                    ? newData.skills.filter((_, i) => i !== index)
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