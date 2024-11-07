import { useState, useEffect } from "react";

// Utility function to get time ago string
const getTimeAgo = (timestamp: any) => {
  const now = new Date();
  const givenTime = new Date(timestamp);
  const differenceInMs = now.getTime() - givenTime.getTime();

  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(differenceInMs / (1000 * 60));
  const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
  const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(differenceInMs / (1000 * 60 * 60 * 24 * 7));

  if (weeks >= 2) return `${weeks} weeks ago`;
  if (weeks === 1) return `1 week ago`;
  if (days >= 2) return `${days} days ago`;
  if (days === 1) return `1 day ago`;
  if (hours >= 2) return `${hours} hours ago`;
  if (hours === 1) return `an hour ago`;
  if (minutes >= 2) return `${minutes} minutes ago`;
  if (minutes === 1) return `a minute ago`;
  return "just now";
};

// React component to display time ago
const TimeAgo = ({ timestamp }: any) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateAgo = () => setTimeAgo(getTimeAgo(timestamp));
    updateAgo();

    // Update every minute to keep it accurate
    const interval = setInterval(updateAgo, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>Edited {timeAgo}</span>;
};

export default TimeAgo;
