"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import file_upload from './File_Upload.png';
import file_add from './File_Add.png';
import Image from "next/image";
import { LiaFileUploadSolid } from "react-icons/lia";
import { AiOutlineFileAdd } from "react-icons/ai";


import "./CreatePreference.scss";

export default function CreatePreference () {    

    return (
        <div className="preference-container">
            <div className="content-container">
                <div className="left">
                    <Image alt="upload" src={file_upload} width={150} height={150} />
                    <div className="action">Upload Existing Resume</div>
                    <div className="info">Autofill details using your current resume</div>
                </div>
                <div className="right">
                    <Image alt="add" src={file_add} width={150} height={150} />
                    <div className="action">Create From Scratch</div>
                    <div className="info">Craft your perfect resume from start</div>
                </div>
            </div>
        </div>
    )
}