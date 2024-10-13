import React, { useState, useCallback, useEffect } from "react";
import { IoMdDownload } from "react-icons/io";
import { useRecoilState } from "recoil";
import { isGeneratingPDFAtom } from "../../store/pdfgenerating";
import { resumeTimeAtom } from "../../store/expiry";
import { Template1 } from "../Editor/templates/Template1";
import { Template2 } from "../Editor/templates/template2";
import { Template3 } from "../Editor/templates/template3";
import { ResumeProps } from "../../types/ResumeProps";
import { useResumeData } from "../../hooks/useResumeData";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import styles from './style.module.scss'

const TailoredResumePage: React.FC = () => {

    const searchParams = useSearchParams()
    const { resumeData } = useResumeData();
    const templateId = searchParams.get('template') ?? "fresher";

    const [jobDescription, setJobDescription] = useState("");
    const [isGeneratingPDF, setIsGeneratingPDF] = useRecoilState(isGeneratingPDFAtom);
    const [resumeTimes, setResumeTimes] = useRecoilState(resumeTimeAtom);
    const [tailoredResumeData, setTailoredResumeData] = useState<ResumeProps | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [isTailoring, setIsTailoring] = useState(false);

    function scaleContent() {
        const containers = document.querySelectorAll(".resumeParent");
        containers.forEach((container) => {
            const content = container.querySelector(".wrapper");
            if (container && content) {
                const widthScale = container.clientWidth / content.clientWidth;
                const heightScale = container.clientHeight / content.clientHeight;
                const scale = Math.min(widthScale, heightScale);
                // @ts-ignore
                content.style.transform = `scale(${scale})`;
            }
        });
    }

    useEffect(() => {
        window.addEventListener("resize", scaleContent);
        scaleContent();
        return () => {
            window.removeEventListener("resize", scaleContent);
        };
    }, []);

    useEffect(()=>{
        scaleContent()
    },[tailoredResumeData])


    const renderTemplate = useCallback(
        (data: ResumeProps) => {
            switch (templateId) {
                case "fresher":
                    return <Template1 resumeData={data} className="wrapper" />;
                case "experienced":
                    return <Template2 resumeData={data} className="wrapper" />;
                case "designer":
                    return <Template3 resumeData={data} className="wrapper" />;
                default:
                    return <div>Select a template from the template selection page</div>;
            }
        },
        [templateId],
    );

    const updateResumeTime = useCallback(
        (id: string) => {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            const timeLeft = Math.floor(
                (expirationDate.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            );
            setResumeTimes((prev) => ({ ...prev, [id]: timeLeft }));
        },
        [setResumeTimes],
    );

    const handleDownload = useCallback(
        async (data: ResumeProps) => {
            setIsGeneratingPDF(true);
            try {
                const element = document.getElementById("wrapper");
                if (!element) throw new Error("Resume wrapper not found");

                element.style.transform = "scale(1)";

                const cssLink = `<link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/(pages)/select-templates/editor/page.css">`;
                const htmlContent = cssLink + element.outerHTML;

                const response = await fetch("/api/generate-pdf", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ html: htmlContent }),
                });

                if (!response.ok) throw new Error("PDF generation failed");

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.style.display = "none";
                a.href = url;
                a.download = "resume.pdf";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);

                updateResumeTime(templateId);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsGeneratingPDF(false);
            }
        },
        [setIsGeneratingPDF, templateId, updateResumeTime],
    );

    const handleTailor = useCallback(async () => {
        if (!jobDescription) {
            alert("Please enter the job description.");
            return;
        }
        setIsTailoring(true);
        try {
            const response = await fetch("/api/generate/taylor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ jobDescription, resumeData }),
            });

            if (!response.ok) {
                throw new Error(
                    "Failed to tailor resume. Please check your inputs and try again.",
                );
            }

            const tailoredData: ResumeProps = await response.json();

            if (JSON.stringify(tailoredData) === JSON.stringify(resumeData)) {
                throw new Error("Tailored resume is identical to the original.");
            }

            setTailoredResumeData(tailoredData);
            setShowComparison(true);
        } catch (error: any) {
            alert(
                error.message ||
                "An unexpected error occurred while tailoring the resume.",
            );
        } finally {
            setIsTailoring(false);
        }
    }, [jobDescription, resumeData]);

    const handleBackToEdit = useCallback(() => {
        setShowComparison(false);
        setTailoredResumeData(null);
    }, []);


    return (
        <div className={styles.head}>
            {
                showComparison ?
                    <div className={styles.tailor_p2_head}>
                        <div className={styles.tailor_p2_head_section}>
                            <div className={styles.tailor_p2_head_section_heading}>
                                <p className={styles.tailor_p2_head_section_heading_data}>Original</p>
                            </div>
                            <div className={`${styles.tailor_p2_head_section_preview} resumeParent`} id="resumeParent">
                                {
                                    renderTemplate(resumeData)
                                }
                            </div>
                            <button
                                className={styles.tailor_p2_head_section_heading_button}
                                onClick={() => handleDownload(resumeData)}
                            >
                                <IoMdDownload/>
                                Download
                            </button>
                        </div>
                        <div className={styles.tailor_p2_head_section}>
                            <div className={styles.tailor_p2_head_section_heading}>
                                <p className={styles.tailor_p2_head_section_heading_data}>Tailored CV</p>
                            </div>
                            <div className={`${styles.tailor_p2_head_section_preview} resumeParent`} id="resumeParent">
                                {
                                    tailoredResumeData && renderTemplate(tailoredResumeData)
                                }
                            </div>
                            <button
                                className={styles.tailor_p2_head_section_heading_button}
                                onClick={() => tailoredResumeData && handleDownload(tailoredResumeData)}
                            >
                                <IoMdDownload/>
                                Download
                            </button>
                        </div>
                    </div>
                    :
                    <div className={styles.tailor_p1_head}>
                        <div className={styles.tailor_p1_head_heading}>
                            <p className={styles.tailor_p1_head_heading_data}>Tailor Your CV</p>
                        </div>
                        <div className={styles.tailor_p1_head_section}>
                            <div className={`${styles.tailor_p1_head_section_preview} resumeParent`} id="resumeParent">
                                {
                                    renderTemplate(resumeData)
                                }
                            </div>
                            <div className={styles.tailor_p1_head_section_user_action}>
                                <p className={styles.tailor_p1_head_section_user_action_heading}>Enter the job description from the job post below</p>
                                <div className={styles.tailor_p1_head_section_user_action_input}>
                                    <textarea
                                        placeholder="Paste the job description here to tailor your resume"
                                        className={styles.tailor_p1_head_section_user_action_input_textarea}
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        rows={10}
                                    />
                                </div>
                                <button
                                    className={styles.tailor_p1_head_section_user_action_button}
                                    onClick={handleTailor}
                                    disabled={isTailoring}
                                >
                                    Tailor my CV
                                </button>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
};

export default TailoredResumePage;
