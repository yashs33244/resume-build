import React, { useState } from "react";
import { HoverEffect } from "../components/ui/card-hover-effect";

interface Template {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const templates: Template[] = [
  {
    id: 1,
    title: "Modern Resume",
    description: "A clean and professional template with a modern touch.",
    imageUrl: "http://localhost:3000/resume1.png",
  },
  {
    id: 2,
    title: "Creative Portfolio",
    description: "Stand out with this creative and eye-catching design.",
    imageUrl: "http://localhost:3000/resume1.png",
  },
  {
    id: 3,
    title: "Executive Summary",
    description: "Perfect for seasoned professionals and executives.",
    imageUrl: "http://localhost:3000/resume1.png",
  },
  // Add more templates here, up to 10
];

export function ResumeTemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Choose Your Resume Template</h1>
      <HoverEffect
        items={templates.map((template) => ({
          title: template.title,
          description: template.description,
          link: "/editor",
          onSelect: () => handleTemplateSelect(template),
        }))}
      />
      {selectedTemplate && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">
            Selected Template: {selectedTemplate.title}
          </h2>
          <img
            src={selectedTemplate.imageUrl}
            alt={selectedTemplate.title}
            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
