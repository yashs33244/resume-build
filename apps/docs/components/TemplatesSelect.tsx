"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

const templates = [
  {
    id: "experienced",
    name: "Experienced",
    image: "/template1.png",
    description: "Perfect if you have 3+ experiences to write about",
  },
  {
    id: "fresher",
    name: "Fresher",
    image: "/template2.png",
    description:
      "The right fit if your have just graduated or have <2 experiences",
  },
  {
    id: "designer",
    name: "Designer",
    image: "/template3.png",
    description: "Ideal if you want to stand out in manual screening",
  },
];

const TemplatesSelect = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleTemplateSelect = (templateId: any) => {
    setSelectedTemplate(templateId);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-8">
        Choose your final CV template
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-gray-800 rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
              selectedTemplate === template.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              {template.name}
            </h2>
            <div className="relative w-full aspect-[3/4]">
              <Image
                src={template.image}
                alt={template.name}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-2 text-center">
              {template.description}
            </p>
            {template.id === "fresher" && (
              <Link href={`select-templates/editor`} passHref>
                <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  Select Template
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center">
        <Image
          src="/finalCV-logo.png"
          alt="finalCV logo"
          width={96}
          height={48}
          className="mr-4"
        />
        {selectedTemplate && (
          <Link href={`select-templates/editor`} passHref>
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
              Continue to Editor
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TemplatesSelect;
