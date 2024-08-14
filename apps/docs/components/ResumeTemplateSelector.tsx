"use client";
import Image from "next/image";
import React from "react";
import { Carousel, Card } from "./ui/apple-cards-carousal";

export function AppleCardsCarouselDemo() {
  const cards = templates.map((template, index) => (
    <Card key={template.id} card={template} index={index} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Choose Your Resume Template
      </h2>
      <Carousel items={cards} />
    </div>
  );
}

const DummyContent = ({ template }: any) => {
  return (
    <>
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
          <span className="font-bold text-neutral-700 dark:text-neutral-200">
            {template.title}
          </span>{" "}
          {template.description}
        </p>
        <Image
          src={template.imageUrl}
          alt={template.title}
          height="500"
          width="500"
          className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
        />
      </div>
    </>
  );
};

const templates = [
  {
    id: 1,
    category: "Modern",
    title: "Modern Resume",
    description: "A clean and professional template with a modern touch.",
    src: "/resume1.png",
    imageUrl: "/resume1.png",
    content: (
      <DummyContent
        template={{
          title: "Modern Resume",
          description: "A clean and professional template with a modern touch.",
          imageUrl: "/resume1.png",
        }}
      />
    ),
  },
  {
    id: 2,
    category: "Creative",
    title: "Creative Portfolio",
    description: "Stand out with this creative and eye-catching design.",
    src: "/resume2.png",
    imageUrl: "/resume2.png",
    content: (
      <DummyContent
        template={{
          title: "Creative Portfolio",
          description: "Stand out with this creative and eye-catching design.",
          imageUrl: "/resume2.png",
        }}
      />
    ),
  },
  {
    id: 3,
    category: "Executive",
    title: "Executive Summary",
    description: "Perfect for seasoned professionals and executives.",
    src: "/resume3.png",
    imageUrl: "/resume3.png",
    content: (
      <DummyContent
        template={{
          title: "Executive Summary",
          description: "Perfect for seasoned professionals and executives.",
          imageUrl: "/resume3.png",
        }}
      />
    ),
  },
  // Add more templates here if needed
];
