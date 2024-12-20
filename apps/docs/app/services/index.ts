export const fetchResumeState = async (resumeId: string) => {
    const res = await fetch(`/api/resume/getResume?resumeId=${resumeId}`);
    
    if (!res.ok) {
        throw new Error('Failed to fetch resume state');
    }

    const data = await res.json(); // Await the parsed JSON data
    return data; // Return the parsed JSON data
};
