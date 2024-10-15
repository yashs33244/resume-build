import { useEffect, useState } from 'react';

export const useResumeState = () => {
  const [resumeState, setResumeState] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [createDate, setCreateDate] = useState<Date | null>(null);
  const [updateDate, setUpdateDate] = useState<Date | null>(null);
  const [resumeData, setResumeData] = useState({
    resumeId: null,
    personalInfo: null,
    education: [],
    experience: [],
    skills: [],
    coreSkills: [],
    techSkills: [],
    languages: [],
    achievement: null,
    projects: [],
    certificates: [],
  }); // Hold all resume data with default structure
  const [template, setTemplate] = useState<string | null>(null); // Add state for template

  useEffect(() => {
    const fetchResumeState = async () => {
      try {
        const res = await fetch(`/api/resume/resumestatus`);
        if (!res.ok) {
          throw new Error('Failed to fetch resume status');
        }

        const data = await res.json();
        console.log('Resume state:', data); 

        // Set the resume state and data
        setResumeState(data[0].state);
        setResumeData({
          resumeId: data[0].resumeId,  
          personalInfo: data[0].personalInfo,
          education: data[0].education,
          experience: data[0].experience,
          skills: data[0].skills,
          coreSkills: data[0].coreSkills,
          techSkills: data[0].techSkills,
          languages: data[0].languages,
          achievement: data[0].achievement,
          projects: data[0].projects,
          certificates: data[0].certificates,
        });
        setTemplate(data[0].templateId); // Set template data[0]

        // If the state is 'DOWNLOAD_SUCCESS', calculate days left for the 30-day expiration
        if (data[0].state === 'DOWNLOAD_SUCCESS') {
          const createdAt = new Date(data[0].createdAt);
          const updatedAt = new Date(data[0].updatedAt);
          const now = new Date();

          setCreateDate(createdAt);
          setUpdateDate(updatedAt);

          // Calculate days left based on the most recent date (either createdAt or updatedAt)
          const mostRecentDate = updatedAt > createdAt ? updatedAt : createdAt;
          const differenceInDays = Math.max(
            30 - Math.floor((now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)),
            0
          );
          setDaysLeft(differenceInDays);
        } else {
          // Reset dates and days left if not in 'DOWNLOAD_SUCCESS'
          setDaysLeft(null);
          setCreateDate(null);
          setUpdateDate(null);
        }
      } catch (error) {
        console.error('Error fetching resume state:', error);
      }
    };

    
      fetchResumeState();
    
  }, []);

  return { resumeState, daysLeft, createDate, updateDate, resumeData, template};
};
