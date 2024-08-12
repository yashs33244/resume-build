import { useEffect, useState } from "react";
import { ResumeProps } from "../types/ResumeProps";
import { initialResumeData } from "../utils/resumeData";
import { isClipEffect } from "html2canvas/dist/types/render/effects";

export const useResumeData = () => {
    const [resumeData, setResumeData] = useState<ResumeProps>(initialResumeData);
    const [isClient, setIsClient] = useState<boolean>(false);   

    useEffect(() => {
        setIsClient(true);
    },[]);

    useEffect(()=>{
        const saveData = isClient ?
            window.localStorage.getItem("resumeData") : null;
        if(saveData){
            setResumeData(JSON.parse(saveData));    
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
    index?: number,
    subIndex?: number,
    category?: string,
  ) => {
    setResumeData((prevData) => {
      const newData = { ...prevData } as ResumeProps;

      if (section === "personalInfo") {
        newData.personalInfo = {
          ...newData.personalInfo,
          [field]: value,
        };
      } else if (section === "education") {
        if (newData.education && Array.isArray(newData.education)) {
          newData.education = newData.education.map((item, i) =>
            i === index ? { ...item, [field]: value } : item,
          );
        }
      } else if (section === "experience") {
        if (newData.experience && Array.isArray(newData.experience)) {
          newData.experience = newData.experience.map((item, i) =>
            i === index ? { ...item, [field]: value } : item,
          );
        }
      } else if (section === "skills") {
        const updatedSkills = { ...newData.skills };

        if (field === "updateCategory") {
          const { oldName, newName } = value as {
            oldName: string;
            newName: string;
          };
          if (oldName !== newName && updatedSkills[oldName]) {
            updatedSkills[newName] = updatedSkills[oldName]?.slice() || [];
            delete updatedSkills[oldName];
          }
        } else if (field === "skill" && category && subIndex !== undefined) {
          if (!updatedSkills[category]) {
            updatedSkills[category] = [];
          }
          const categorySkills = updatedSkills[category];
          if (
            categorySkills &&
            subIndex >= 0 &&
            subIndex < categorySkills.length
          ) {
            const updatedCategorySkills = [...categorySkills];
            updatedCategorySkills[subIndex] = value;
            updatedSkills[category] = updatedCategorySkills;
          }
        } else if (field === "newSkill" && category) {
          if (!updatedSkills[category]) {
            updatedSkills[category] = [];
          }
          const categorySkills = updatedSkills[category];
          if (categorySkills) {
            const lastSkill = categorySkills[categorySkills.length - 1];
            if (lastSkill === undefined || lastSkill.trim() !== "") {
              updatedSkills[category] = [...categorySkills, ""];
            }
          }
        } else if (
          field === "deleteSkill" &&
          category &&
          subIndex !== undefined
        ) {
          const categorySkills = updatedSkills[category];
          if (categorySkills) {
            updatedSkills[category] = categorySkills.filter(
              (_, i) => i !== subIndex,
            );
          }
        }

        newData.skills = updatedSkills;
      } else if (section === "achievement") {
        newData.achievement = {
          ...newData.achievement,
          [field]: value,
        } as { title: string; description: string };
      } else {
        // Handle personal info fields (name, title, website, email, phone)
        (newData as any)[field] = value;
      }

      return newData;
    });
  };
  const handleAddField = (section: keyof ResumeProps, category?: string) => {
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
        if (category) {
          // Add a new skill to the specified category
          newData.skills = {
            ...prevData.skills,
            [category]: [...(prevData.skills[category] || []), ""],
          };
        } else {
          // Add a new category
          const newCategoryName = `New Category ${Object.keys(prevData.skills || {}).length + 1}`;
          newData.skills = {
            ...(prevData.skills || {}),
            [newCategoryName]: [],
          };
        }
      }
      return newData;
    });
  };

  const handleDeleteField = (
    section: keyof ResumeProps,
    index?: number,
    category?: string,
    skillIndex?: number,
  ) => {
    setResumeData((prevData) => {
      const newData = { ...prevData };
      if (section === "education" || section === "experience") {
        (newData[section] as any[]) = (prevData[section] as any[]).filter(
          (_, i) => i !== index,
        );
      } else if (section === "skills") {
        if (category && skillIndex !== undefined) {
          // Delete a skill from a category
          newData.skills = {
            ...newData.skills,
            [category]:
              newData.skills[category]?.filter((_, i) => i !== skillIndex) ||
              [],
          };
        } else if (category) {
          // Delete an entire category
          const { [category]: _, ...rest } = newData.skills;
          newData.skills = rest;
        }
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