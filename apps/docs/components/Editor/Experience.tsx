"use client";
import React, { useState } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { ResumeProps } from "../../types/ResumeProps";
import "./styles/experience.scss";
import { BsStars } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@repo/ui/components/ui/collapsible";
import loading from "../../public/loading.gif";
import CustomDatePicker from "./CustomDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ClientSideQuill = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => (
        <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
        </div>
    ),
});

interface ExperienceProps {
    resumeData: ResumeProps;
    handleInputChange: (
        section: keyof ResumeProps,
        field: string,
        value: any,
        index?: number,
    ) => void;
    handleAddField: (section: keyof ResumeProps) => void;
    handleDeleteField: (
        section: keyof ResumeProps,
        field: string,
        index?: number,
    ) => void;
}

export const Experience: React.FC<ExperienceProps> = ({
    resumeData,
    handleInputChange,
    handleAddField,
    handleDeleteField,
}) => {
    const experiences = resumeData.experience || [];
    const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

    const handleResponsibilitiesChange = (value: string, index: number) => {
        const responsibilities = value
            .split("\n")
            .filter((item) => item.trim() !== "");
        handleInputChange(
            "experience",
            "responsibilities",
            responsibilities,
            index,
        );
    };

    const handleAiGeneration = async (prompt: string, index: number) => {
        setIsLoading({ ...isLoading, [index]: true });
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate content");
            }

            const data = await response.text();
            const selection = window.getSelection();
            if (selection && !selection.isCollapsed) {
                const range = selection.getRangeAt(0);
                const quillEditor = document.querySelector(
                    `#responsibilities-${index} .ql-editor`,
                ) as HTMLElement;
                if (quillEditor) {
                    const start = range.startOffset;
                    const end = range.endOffset;
                    const newContent =
                        quillEditor.innerHTML.slice(0, start) +
                        data +
                        quillEditor.innerHTML.slice(end);
                    handleResponsibilitiesChange(newContent, index);
                }
            } else {
                handleResponsibilitiesChange(data, index);
            }
        } catch (error) {
            console.error("Error generating content:", error);
        } finally {
            setIsLoading({ ...isLoading, [index]: false });
        }
    };

    const aiPrompts = [
        "Make It Impressive",
        "Fix Grammar",
        "Shorten",
        "Elaborate",
    ];

    return (
        <div className="experience-container">
            <div className="experience-list">
                {experiences.map((exp, index) => (
                    <Collapsible
                        className={index === 0 ? "collapse-comp first" : "collapse-comp"}
                        key={index}
                    >
                        <CollapsibleTrigger className="collapse-trigger">
                            <div className="exp-note">
                                <ChevronDownIcon className="h-5 w-5 transition-transform" />
                                <div className="company-details">
                                    <div className="title">
                                        {exp.company || `Enter Experience`}
                                    </div>
                                    <div className="subtitle">{exp.role ? exp.role : null}</div>
                                </div>
                            </div>
                            <div
                                className="delete-cta"
                                onClick={() => handleDeleteField("experience", "", index)}
                            >
                                <FaTrashAlt />
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="collapse-content">
                            <div className="content-container">
                                <div className="form-row">
                                    <div className="row-form-field">
                                        <Label htmlFor={`company-${index}`} className="field-label">
                                            Company Name
                                        </Label>
                                        <Input
                                            id={`company-${index}`}
                                            value={exp.company || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "company",
                                                    e.target.value,
                                                    index,
                                                )
                                            }
                                            placeholder="Amazon"
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="row-form-field">
                                        <Label htmlFor={`role-${index}`} className="field-label">
                                            Designation
                                        </Label>
                                        <Input
                                            id={`role-${index}`}
                                            value={exp.role || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "role",
                                                    e.target.value,
                                                    index,
                                                )
                                            }
                                            placeholder="Product Manager"
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="row-form-field">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <CustomDatePicker
                                                id={`start-${index}`}
                                                value={exp.start || ""}
                                                onChange={handleInputChange}
                                                index={index}
                                                className="text-white"
                                                field="start"
                                                category="experience"
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    {
                                        exp?.end != 'Present' && 
                                        <div className="row-form-field">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <CustomDatePicker
                                                    id={`end-${index}`}
                                                    value={exp.end || ""}
                                                    onChange={handleInputChange}
                                                    index={index}
                                                    className="text-white"
                                                    field="end"
                                                    category="experience"
                                                />
                                            </LocalizationProvider>
                                        </div>
                                    }
                                </div>
                                <div className="inline-flex items-center">
                                    <label
                                        className="relative flex cursor-pointer items-center rounded-full p-3"
                                        htmlFor={`ripple-on-${index}`}
                                        data-ripple-dark="true"
                                    >
                                        <input
                                            id={`ripple-on-${index}`}
                                            type="checkbox"
                                            checked={exp.current}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "experience",
                                                    "current",
                                                    e.target.checked,
                                                    index,
                                                )
                                            }
                                            className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow hover:shadow-md transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400 before:opacity-0 before:transition-opacity checked:border-slate-800 checked:bg-slate-800 checked:before:bg-slate-400 hover:before:opacity-10"
                                        />
                                        <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3.5 w-3.5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </span>
                                    </label>
                                    <label
                                        className="cursor-pointer text-slate-600 text-sm"
                                        htmlFor={`ripple-on-${index}`}
                                    >
                                        Current
                                    </label>
                                </div>

                                <div className="single-form-row">
                                    <div className="form-field">
                                        <Label
                                            htmlFor={`responsibilities-${index}`}
                                            className="field-label"
                                        >
                                            Details
                                        </Label>
                                        <div className="text-editor-container">
                                            <ClientSideQuill
                                                id={`responsibilities-${index}`}
                                                value={exp.responsibilities?.join("\n") || ""}
                                                onChange={(value) =>
                                                    handleResponsibilitiesChange(value, index)
                                                }
                                                className="text-editor"
                                                modules={{
                                                    toolbar: [
                                                        ["bold", "italic", "underline", "strike"],
                                                        [{ list: "ordered" }, { list: "bullet" }],
                                                        ["link"],
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="ai-container flex flex-wrap items-center gap-2 mt-4">
                                        {!isLoading[index] ? (
                                            <BsStars style={{ width: "20px", height: "20px" }} />
                                        ) : (
                                            <img
                                                src={loading.src}
                                                alt="loading..."
                                                style={{ width: "20px", height: "20px" }}
                                            />
                                        )}
                                        {aiPrompts.map((prompt, promptIndex) => (
                                            <button
                                                key={promptIndex}
                                                onClick={() => {
                                                    const selection = window.getSelection()?.toString();
                                                    const textToUse =
                                                        selection || exp.responsibilities?.join("\n") || "";
                                                    handleAiGeneration(`${prompt}: ${textToUse}`, index);
                                                }}
                                                className=" ai-chip px-3 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                                                disabled={isLoading[index]}
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
            <Button
                variant="default"
                onClick={() => handleAddField("experience")}
                className="add-cta"
            >
                + Add Experience
            </Button>
        </div>
    );
};

function ChevronDownIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}
