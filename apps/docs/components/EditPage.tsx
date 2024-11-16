"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./EditPage.scss";
import { Education } from "./Editor/Education";
import { Skills } from "./Editor/Skills";
import { Language } from "./Editor/Language";
import Tips from "./Tips";
import { useResumeData } from "../hooks/useResumeData";
import { useActiveSection } from "../hooks/useActiveSection";
import { FaUserTie, FaSuitcase, FaTools } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import { AiFillProject } from "react-icons/ai";
import short_logo from "./short_logo.svg";
import { IoMdDownload } from "react-icons/io";
import { Loader } from "lucide-react";
import { CiCircleChevLeft } from "react-icons/ci";
import { PiCaretCircleRightFill, PiCertificateFill } from "react-icons/pi";
import { MdTipsAndUpdates } from "react-icons/md";
import { TbGridDots } from "react-icons/tb";
import DownloadModel from "./DownloadModel";
import { Template1 } from "./Editor/templates/Template1";
import { Template2 } from "./Editor/templates/template2";
import { Template3 } from "./Editor/templates/template3";
import "react-responsive-modal/styles.css";
import Link from "next/link";
import ChanegTemplate from "./changeTemplate/ChangeTemplate";
import { useRouter } from "next/navigation";
import { ResumeProps } from "../types/ResumeProps";
import { useSession } from "next-auth/react";
import { resumeSizeAtom } from "../store/resumeSize";
import { useRecoilState } from "recoil";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useFetchResumeData } from "../hooks/useFetchResumeData";
import { useResumeDraft } from "../hooks/useResumeDraft";
import debounce from "lodash/debounce";
import { useUserStatus } from "../hooks/useUserStatus";

const PersonalInfo = dynamic(
  () => import("./Editor/PersonalInfo").then((mod) => mod.PersonalInfo),
  { ssr: false },
);
const Experience = dynamic(
  () => import("./Editor/Experience").then((mod) => mod.Experience),
  { ssr: false },
);
const Certificate = dynamic(
  () => import("./Editor/Certificate").then((mod) => mod.Certificate),
  { ssr: false },
);
const Project = dynamic(
  () => import("./Editor/Project").then((mod) => mod.Project),
  { ssr: false },
);
const Achievement = dynamic(
  () => import("./Editor/Achievement").then((mod) => mod.Achievement),
  { ssr: false },
);

const TEMPLATE_NAME_MAPPING = {
  fresher: "template1",
  experienced: "template2",
  designer: "template3",
};

export default function EditPage() {
  const [currentTemplate, setCurrentTemplate] = useState("template1");
  const [resumeSize, setResumeSize] = useRecoilState(resumeSizeAtom);
  const [isOverflowing, setIsOverflowing] = useState<boolean | undefined>(
    undefined,
  );
  const router = useRouter();
  const [initails, setInitials] = useState("");

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved",
  );
  const { user, isPaid, refetchUser } = useUserStatus();

  const { data: session, status: sessionStatus } = useSession();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const {
    resumeData,
    handleInputChange,
    handleAddField,
    handleDeleteField,
    loading,
  } = useResumeData((data) => debouncedSave(data)); // Use debounced save as the callback
  const resumeId = resumeData.resumeId;
  // Memoized save draft function
  const saveDraft = useCallback(
    async (data: ResumeProps) => {
      if (!resumeId) {
        console.error("No resume ID available");
        setSaveStatus("error");
        return;
      }

      try {
        setSaveStatus("saving");

        const response = await fetch("/api/resume/saveResume/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId,
            content: {
              ...data,
              state: "EDITING",
              userId: session?.user?.id || "default-user-id",
            },
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to save draft");
        }

        setSaveStatus("saved");
      } catch (error) {
        console.error("Error saving draft:", error);
        setSaveStatus("error");
      }
    },
    [resumeId, session?.user?.id],
  );

  // Create debounced save function
  const debouncedSave = useCallback(
    debounce((data: ResumeProps) => {
      saveDraft(data);
    }, 5000),
    [saveDraft],
  );

  // Cleanup debounced save on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const template = resumeData.templateId;

  useEffect(() => {
    if (session?.user?.name) {
      const nameParts = session.user.name.split(" ");
      // Get the first two initials or fallback to an empty string
      const firstInitial = nameParts[0]?.[0] || "";
      const secondInitial = nameParts[1]?.[0] || "";
      setInitials(firstInitial + secondInitial);
    }
  }, [session]);

  const { activeSection, handleSectionChange, sections, setActiveSection } =
    useActiveSection();

  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById("wrapper");
      if (!element) throw new Error("Resume wrapper not found");
      element.style.transform = "scale(1)";

      // Add the CSS link directly in the HTML content
      const templateName =
        TEMPLATE_NAME_MAPPING[
          resumeData.templateId as keyof typeof TEMPLATE_NAME_MAPPING
        ];

      const cssLink = `<link rel="stylesheet" href="${process.env.NEXT_PUBLIC_BASE_URL}/${templateName}.css">`;
      const htmlContent = cssLink + element.outerHTML;
      // console.log("HTML Content", htmlContent);

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: htmlContent, resumeId: resumeId }),
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
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const openModel = () => {
    if (isPaid) {
      handleDownload();
    } else {
      router.push("/select-templates/checkout");
    }
  };

  const closeModel = () => {
    setIsModelOpen(false);
  };

  const renderTemplate = () => {
    // console.log("Template", template);
    switch (template) {
      case "fresher":
        return <Template1 resumeData={resumeData} id="wrapper" />;
      case "experienced":
        return <Template2 resumeData={resumeData} id="wrapper" />;
      case "designer":
        return <Template3 resumeData={resumeData} id="wrapper" />;
      default:
        return <div>Select a template from the template selection page</div>;
    }
  };

  const handleRedirect = async () => {
    try {
      localStorage.removeItem("resumeData");
      router.push("/dashboard");
    } catch (error: any) {
      console.log("Error", error);
    }
  };

  const navElements = [
    "Personal Info",
    "Education",
    "Experience",
    "Project",
    "Skills",
    "Certificate",
  ];

  const handleLeftNav = () => {
    const currentIndex = navElements.indexOf(
      activeSection ? activeSection : "",
    );
    if (currentIndex === 0) {
      return;
    }

    const newIndex = currentIndex - 1;
    setActiveSection(navElements[newIndex]);
  };

  const handleRightNav = () => {
    const currentIndex = navElements.indexOf(
      activeSection ? activeSection : "",
    );
    if (currentIndex === navElements.length - 1) {
      return;
    }
    const newIndex = currentIndex + 1;
    setActiveSection(navElements[newIndex]);
  };

  useEffect(() => {
    function scaleContent() {
      const container = document.getElementById("resumeParent");
      const content = document.getElementById("wrapper");
      // @ts-ignore
      const widthScale = container?.offsetWidth / content?.offsetWidth;
      // @ts-ignore
      const heightScale = container?.offsetHeight / content?.offsetHeight;
      const scale = Math.min(widthScale, heightScale);
      if (content) {
        content.style.transform = `scale(${scale})`;
      }
    }

    window.addEventListener("resize", scaleContent);
    scaleContent();
  });

  useEffect(() => {
    const checkOverflow = () => {
      const templateElement = document.querySelector(".template-container");
      // console.log("TEMPLATE ELEMENT ------", templateElement);
      if (templateElement) {
        // console.log("SCROLL HEIGHT ------", templateElement.scrollHeight);
        const isOverflown = templateElement.scrollHeight > 842;
        setIsOverflowing(isOverflown);
      }
    };
    checkOverflow();
  }, [resumeData, resumeSize]);

  const [tipsOpen, setTipsOpen] = useState(false);

  const getSectionTitle = (props: any) => {
    switch (activeSection) {
      case "Personal Info":
        return "Add Personal Details";
        break;
      case "Education":
        return "Add Education";
        break;
      case "Experience":
        return "Add Work Experience";
        break;
      case "Project":
        return "Add Projects";
        break;
      case "Skills":
        return "Add Skills";
        break;
      case "Certificate":
        return "Add Certificates";
        break;
      case "Language":
        return "Add Languages";
        break;
      default:
        return;
        break;
    }
  };
  const handleSkillsSelect = (resumeData: ResumeProps) => {
    setActiveSection("Skills");
  };

  const templateChangeHandler = (e: any) => {
    setCurrentTemplate(e?.target?.value);
  };

  const reduceSize = () => {
    if (resumeSize == "M") {
      setResumeSize("S");
    } else if (resumeSize == "L") {
      setResumeSize("M");
    } else if (resumeSize == "XL") {
      setResumeSize("L");
    } else if (resumeSize == "S") {
      setResumeSize("XS");
    }
  };
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          minHeight: "calc(100vh - 100px)",
          maxHeight: "calc(100vh - 100px)",
        }}
      >
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <div className="flex flex-col w-full min-h-screen bg-background text-foreground dark:bg-[#1a1b1e] dark:text-white">
        <Tips
          activeSection={activeSection}
          open={tipsOpen}
          setTipsOpen={(val: any) => setTipsOpen(val)}
        />
        <ReactTooltip
          id="dashboard"
          place="bottom"
          content="Dashboard"
          style={{ zIndex: "1000", backgroundColor: "#1B2432" }}
        />
        <ReactTooltip
          id="personal"
          place="right"
          content="Personal Details"
          style={{ zIndex: "1000", backgroundColor: "#1B2432" }}
        />
        <ReactTooltip
          id="education"
          place="right"
          content="Education"
          style={{ zIndex: "1000", backgroundColor: "#1B2432" }}
        />
        <ReactTooltip
          id="experience"
          place="right"
          content="Work Experience"
          style={{ zIndex: "1000", backgroundColor: "#1B2432" }}
        />
        <ReactTooltip
          id="project"
          place="right"
          content="Projects"
          style={{ zIndex: "1000", backgroundColor: "#1B2432" }}
        />
        <ReactTooltip
          id="skills"
          place="right"
          content="Skills"
          style={{ zIndex: "1000", backgroundColor: "#1B2432" }}
        />
        <ReactTooltip
          id="certificate"
          place="right"
          content="Certificates"
          style={{ zIndex: "1000", backgroundColor: "#1B2432" }}
        />
        <ReactTooltip
          id="left"
          place="bottom"
          content="Previous Section"
          style={{ zIndex: "1000", backgroundColor: "#1B2432" }}
        />
        <ReactTooltip
          id="right"
          place="bottom"
          content="Next Section"
          style={{ zIndex: "10000", backgroundColor: "#1B2432" }}
        />
        <div className="editor-container">
          <div className="navigation">
            <div className="login-container" data-tooltip-id="dashboard">
              {session?.user ? (
                <div className="login-cta" onClick={handleRedirect}>
                  <TbGridDots />
                  <div>{initails?.toUpperCase()}</div>
                </div>
              ) : (
                <div className="login-cta">
                  <TbGridDots />
                  <div>
                    <Link href="/">{initails?.toUpperCase()}</Link>
                  </div>
                </div>
              )}
            </div>
            <div className="nav-container">
              <div className="logo-placement">
                <Image
                  alt="short_logo"
                  src={short_logo}
                  width={50}
                  height={50}
                />
              </div>
              <div
                onClick={() => setActiveSection("Personal Info")}
                className={`icon-container ${activeSection === "Personal Info" ? "border" : ""}`}
                data-tooltip-id="personal"
              >
                <FaUserTie
                  className={`icon ${activeSection === "Personal Info" ? "selected" : ""}`}
                />
              </div>
              <div
                onClick={() => setActiveSection("Education")}
                className={`icon-container ${activeSection === "Education" ? "border" : ""}`}
                data-tooltip-id="education"
              >
                <IoSchool
                  className={`icon ${activeSection === "Education" ? "selected" : ""}`}
                />
              </div>
              <div
                onClick={() => setActiveSection("Experience")}
                className={`icon-container ${activeSection === "Experience" ? "border" : ""}`}
                data-tooltip-id="experience"
              >
                <FaSuitcase
                  className={`icon ${activeSection === "Experience" ? "selected" : ""}`}
                />
              </div>
              <div
                onClick={() => setActiveSection("Project")}
                className={`icon-container ${activeSection === "Project" ? "border" : ""}`}
                data-tooltip-id="project"
              >
                <AiFillProject
                  className={`icon ${activeSection === "Project" ? "selected" : ""}`}
                />
              </div>
              <div
                onClick={() => handleSkillsSelect(resumeData)}
                className={`icon-container ${activeSection === "Skills" ? "border" : ""}`}
                data-tooltip-id="skills"
              >
                <FaTools
                  className={`icon ${activeSection === "Skills" ? "selected" : ""}`}
                />
              </div>
              <div
                onClick={() => setActiveSection("Certificate")}
                className={`icon-container ${activeSection === "Certificate" ? "border" : ""}`}
                data-tooltip-id="certificate"
              >
                <PiCertificateFill
                  className={`icon ${activeSection === "Certificate" ? "selected" : ""}`}
                />
              </div>
            </div>
          </div>
          <div className="editor">
            <div className="section-header">
              <div className="section-title">
                {getSectionTitle(activeSection)}
                <div className="tips" onClick={() => setTipsOpen(!tipsOpen)}>
                  <MdTipsAndUpdates />
                  <div>Tips</div>
                </div>
              </div>
              <div className="move-container">
                <CiCircleChevLeft
                  data-tooltip-id="left"
                  style={{
                    marginRight: "50px",
                    width: "40px",
                    height: "40px",
                    cursor: "pointer",
                  }}
                  onClick={handleLeftNav}
                />
                <PiCaretCircleRightFill
                  data-tooltip-id="right"
                  style={{ width: "40px", height: "40px", cursor: "pointer" }}
                  onClick={handleRightNav}
                />
              </div>
            </div>
            <div className="material-container">
              {activeSection === "Personal Info" && (
                <PersonalInfo
                  resumeData={resumeData}
                  handleInputChange={handleInputChange}
                />
              )}
              {activeSection === "Education" && (
                <Education
                  resumeData={resumeData}
                  handleInputChange={handleInputChange}
                  handleAddField={handleAddField}
                  handleDeleteField={handleDeleteField}
                />
              )}
              {activeSection === "Experience" && (
                <Experience
                  resumeData={resumeData}
                  handleInputChange={handleInputChange}
                  handleAddField={handleAddField}
                  handleDeleteField={handleDeleteField}
                />
              )}
              {activeSection === "Skills" && (
                <Skills
                  resumeData={resumeData}
                  handleInputChange={handleInputChange}
                  handleAddField={handleAddField}
                  handleDeleteField={handleDeleteField}
                />
              )}
              {activeSection === "Project" && (
                <Project
                  resumeData={resumeData}
                  handleInputChange={handleInputChange}
                  handleAddField={handleAddField}
                  handleDeleteField={handleDeleteField}
                />
              )}
              {activeSection === "Certificate" && (
                <Certificate
                  resumeData={resumeData}
                  handleInputChange={handleInputChange}
                  handleAddField={handleAddField}
                  handleDeleteField={handleDeleteField}
                />
              )}
              {activeSection === "Language" && (
                <Language
                  resumeData={resumeData}
                  handleInputChange={handleInputChange}
                  handleAddField={handleAddField}
                  handleDeleteField={handleDeleteField}
                />
              )}
            </div>
          </div>
          <div className="preview">
            <div className="tools">
              <div className="tools-container">
                <ChanegTemplate resumeId={resumeId} />
                <div className="download-container cursor-pointer">
                  {session?.user ? (
                    <div className="download" onClick={openModel}>
                      <IoMdDownload />
                      <div>Download</div>
                    </div>
                  ) : (
                    <div className="download">
                      {" "}
                      <Link href="/api/auth/signin">Login to download</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="preview-container" id="resumeParent">
              {renderTemplate()}
            </div>
            {isOverflowing && (
              <div className="overflow_div">
                <span className="overflow_div_p1">
                  Your content is overflowing. You can optimize the content
                </span>
                {["M", "L", "S", "XL"].includes(resumeSize) && (
                  <span className="overflow_div_p1">
                    &nbsp;or you can click&nbsp;
                    <span onClick={reduceSize} className="overflow_div_action">
                      here
                    </span>
                    &nbsp;to reduce the size.
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
