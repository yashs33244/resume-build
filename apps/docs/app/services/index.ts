export const fetchResumeState = async (resumeId: string) => {
    const res = await fetch(`/api/resume/resumestatus?id=${resumeId}`);
    
    if (!res.ok) {
        throw new Error('Failed to fetch resume state');
    }

    const data = await res.json(); // Await the parsed JSON data
    console.log(data); // Log the parsed data
    return data; // Return the parsed JSON data
};
