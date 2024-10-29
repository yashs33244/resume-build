"use client";
import Link from "next/link";
import { useState } from "react";
import { SlGrid } from "react-icons/sl";
import { useRecoilState } from "recoil";
import { resumeSizeAtom } from "../../store/resumeSize";
import SizeChange from "./SizeChange";

export default function ChanegTemplate(props:any) {
  return (
    <div className="widgets">
      <div className="change-template">
        <SlGrid />
        <div>
          <Link href="/select-templates">Change Template</Link>
        </div>
      </div>
      <SizeChange resumeSize={props.resumeSize} />
    </div>
  );
}
