import React from "react";
import Image from "next/image";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card";

const ResumeCard = () => {
  return (
    <div>
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-lg dark:hover:shadow-emerald-500/[0.05] dark:bg-black dark:border-white/[0.1] border-black/[0.05] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
          <CardItem translateZ="20" className="w-full h-full">
            <Image
              src="/resume1.png"
              layout="responsive"
              width={800}
              height={1000}
              className="object-contain rounded-xl group-hover/card:shadow-lg"
              alt="resume"
            />
          </CardItem>
          <CardItem
            as="p"
            translateZ="10"
            className="text-neutral-500 text-sm max-w-sm mt-4 dark:text-neutral-300"
          >
            Hover over this card to see a subtle 3D effect.
          </CardItem>
        </CardBody>
      </CardContainer>

      <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] transition duration-200">
        View Full Resume →
      </button>
    </div>
  );
};

export default ResumeCard;
