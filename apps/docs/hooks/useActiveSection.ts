import { useState } from "react";

const sections = ["Personal Info", "Education", "Experience", "Skills", "Achievement"];

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState(sections[0]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return {
    activeSection,
    handleSectionChange,
    sections,
    setActiveSection
  };
};
