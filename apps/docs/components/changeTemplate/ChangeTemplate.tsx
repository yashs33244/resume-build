"use client";
import Link from "next/link";
import { useState } from "react";
import { SlGrid } from "react-icons/sl";
import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../store/resumeSize";
import SizeChange from "./SizeChange";
import { BsGridFill } from "react-icons/bs";

export default function ChangeTemplate({ resumeId }: { resumeId: string }, { resumeSize } : { resumeSize : any }) {
  return (
    <div className="widgets">
      <div className="change-template">
        <BsGridFill />
        <div>
          <Link href={`/select-templates/?id=${resumeId}`}>
            Change Template
          </Link>
        </div>
      </div>
      <SizeChange resumeSize={resumeSize} />
    </div>
  );
}
