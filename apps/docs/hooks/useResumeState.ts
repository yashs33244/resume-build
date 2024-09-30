import { useEffect, useState } from 'react';

export const useResumeState = () => {
  const [resumeState, setResumeState] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [createDate, setCreateDate] = useState(null);
  const [updateDate, setUpdateDate] = useState(null);

  useEffect(() => {
    const fetchResumeState = async () => {
      try {
        const res = await fetch('/api/resume/resumestatus');
        const data = await res.json();

        setResumeState(data.state);

        if (data.state === 'DOWNLOAD_SUCCESS') {
          const createdAt = new Date(data.createdAt);
          const updatedAt = new Date(data.updatedAt);
          const now = new Date();

          setCreateDate(createdAt);
          setUpdateDate(updatedAt);

          // Calculate days left based on the most recent date (either createdAt or updatedAt)
          const mostRecentDate = updatedAt > createdAt ? updatedAt : createdAt;
          const differenceInDays = Math.max(30 - Math.floor((now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)), 0);
          setDaysLeft(differenceInDays);
        } else {
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

  return { resumeState, daysLeft, createDate, updateDate };
};