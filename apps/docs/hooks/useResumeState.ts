import { useEffect, useState } from 'react';

export const useResumeState = () => {
  const [resumeState, setResumeState] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [createDate, setCreateDate] = useState(null);

  useEffect(() => {
    const fetchResumeState = async () => {
      try {
        const res = await fetch('/api/resume/resumestatus');
        const data = await res.json();

        if (data.state === 'DOWNLOAD_SUCCESS') {
          const createDate = data.createdAt;
          const now = new Date();
          const differenceInDays = Math.max(30 - Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)), 0);
          setDaysLeft(differenceInDays);
        }

        setResumeState(data.state);
      } catch (error) {
        console.error('Error fetching resume state:', error);
      }
    };

    fetchResumeState();
  }, []);

  return { resumeState, daysLeft , createDate};
};
