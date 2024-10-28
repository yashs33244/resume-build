
import axios from "axios";

const useAiSuggestion = () => {
  const fetchSkills = async (role: string) => {
    try {
      const response = await axios.get(`/api/generate/skills?role=${role}`);
      return response.data.skills || [];
    } catch (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
  };

  return { fetchSkills };
};

export default useAiSuggestion;
