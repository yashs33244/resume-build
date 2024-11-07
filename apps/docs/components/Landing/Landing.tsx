"use client";
import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import imp from "./imp.svg";
import ats from "./ats.svg";
import ai from "./ai.svg";
import job from "./job.svg";
import amz from "./referrals/amazon.png";
import meta from "./referrals/meta.png";
import google from "./referrals/google.png";
import microsoft from "./referrals/microsoft.png";
import phonepe from "./referrals/phonepe.png";
import flip from "./referrals/flipkart.png";
import cars from "./referrals/cars.png";
import acko from "./referrals/acko.png";
import groww from "./referrals/groww.png";
import ycom from "./referrals/ycom.png";
import cover from "./cover.svg";
import format from "./format.svg";
import { GrLinkedin } from "react-icons/gr";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import template1 from "./template1.png";
import template2 from "./template2.png";
import template3 from "./template3.png";
import legend1 from "./legend1.svg";
import legend2 from "./legend2.svg";
import legend3 from "./legend3.svg";
import temp_resume1 from "./temp_resume1.png";
import temp_resume2 from "./temp_resume2.png";
import temp_resume3 from "./temp_resume3.png";
import Image from "next/image";
import lovedby from "./lovedby.svg";
import flipkart from "./flipkart.png";
import uber from "./uber.png";
import olx from "./olx.png";
import swiggy from "./swiggy1.png";
import { MdRocketLaunch } from "react-icons/md";
import amazon from "./amazon.png";
import paytm from "./paytm.png";
import Typewriter from "typewriter-effect";
import stars from "./stars.svg";
import apoorv from "./apoorv.jpeg";
import apoorva from "./apoorva.jpeg";
import yash from "./yash.jpeg";
import vega from "./vega.jpeg";
import parth from "./parth.jpeg";
import medha from "./medha.jpeg";
import AliceCarousel from "react-alice-carousel";
import Link from "next/link";
import "react-alice-carousel/lib/alice-carousel.css";
import "./App.scss";
import { useSession } from "next-auth/react";
import { FaCircleCheck } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import {
  templateClassSelector,
  useTemplateSync,
} from "../../store/templatesState";
import { useRecoilValue } from "recoil";
import { useRouter, useSearchParams } from "next/navigation";
import { useSaveResume } from "../../hooks/useSaveResume";
import { initialResumeData } from "../../utils/resumeData";
// import { useSession } from "next-auth/react";
type LandingPageTemplateType = "classic" | "modern" | "bold";
type ActualTemplateType = "fresher" | "experienced" | "designer";

const templateMapping: Record<LandingPageTemplateType, ActualTemplateType> = {
  classic: "fresher",
  modern: "experienced",
  bold: "designer",
};

const reverseTemplateMapping: Record<
  LandingPageTemplateType,
  ActualTemplateType
> = {
  classic: "fresher",
  modern: "experienced",
  bold: "designer",
};

export default function LandingPage() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<LandingPageTemplateType>("classic");
  const { data: session, status: sessionStatus } = useSession();
  const { template, setTemplateAndUpdateURL } = useTemplateSync();
  const templateClass = useRecoilValue<any>(templateClassSelector);
  const router = useRouter();

  const { saveResume, isSaving } = useSaveResume();
  const searchParams = useSearchParams();

  const handleSetTemplate = (template: LandingPageTemplateType) => {
    setSelectedTemplate(template);

    // Encode the parameters properly
    const params = new URLSearchParams({
      callbackUrl: `/create-preference?template=${template}&fromLanding=true`,
      fromLanding: "true",
      template: template,
    }).toString();

    if (!session?.user) {
      // Include template in the signin URL
      router.push(`/api/auth/signin?${params}`);
    } else {
      // Direct navigation for logged-in users
      router.push(`/create-preference?template=${template}&fromLanding=true`);
    }
  };

  // Handle post-login redirect
  useEffect(() => {
    const template = searchParams.get("template");
    const fromLanding = searchParams.get("fromLanding") === "true";

    if (session?.user && fromLanding && template) {
      router.push(`/create-preference?template=${template}&fromLanding=true`);
    }
  }, [session, searchParams, router]);
  // Map current templates to the respective images
  const currentTemplate: { [key: string]: string } = {
    classic: temp_resume1.src,
    modern: temp_resume2.src,
    bold: temp_resume3.src,
  };

  // Handle redirect based on user session
  const handleRedirect = () => {
    if (session?.user) {
      const actualTemplate = templateMapping[template]; // Use the correct mapping
      router.push(`/select-templates/editor?template=${actualTemplate}`);
    } else {
      router.push("/api/auth/signin");
    }
  };
  return (
    <div className="App">
      <div className="legend-container">
        <div className="left-container">
          <div className="title">A no bullshit Resume</div>
          <div className="title-two">that gets you hired!</div>
          <div className="title-three">
            <div className="sub-head first">
              <FaCircleCheck />
              <div>ATS Friendly</div>
            </div>
            <div className="sub-head">
              <FaCircleCheck />
              <div>Clean Designs</div>
            </div>
            <div className="sub-head">
              <FaCircleCheck />
              <div>Concise Formats</div>
            </div>
          </div>
          {/* <div className="typewriter">
            <Typewriter
              options={{
                strings: [
                  "Clean designs",
                  "Concise formats",
                  "Compelling content",
                ],
                autoStart: true,
                loop: true,
                delay: 30,
                deleteSpeed: 10,
              }}
            />
          </div> */}
          <div className="primary-cta">
            <MdRocketLaunch />
            <div>
              {session?.user ? (
                <Link href="/dashboard"> Get Started</Link>
              ) : (
                <Link href="/api/auth/signin"> Get Started</Link>
              )}
            </div>
          </div>
          {/* <div className="secondary-cta">
            <FaEdit />
            <div>
              {session?.user ? (
                <Link href="/select-templates/editor">
                  {" "}
                  Enter Details Manually
                </Link>
              ) : (
                <Link href="/api/auth/signin"> Enter Details Manually</Link>
              )}
            </div>
          </div> */}
          <div style={{ marginTop: "36px" }}>
            <Image alt="loved" src={lovedby} style={{ width: "44%" }} />
          </div>
        </div>
        <div className="right-container">
          <AliceCarousel
            mouseTracking
            animationType="fadeout"
            disableDotsControls={true}
            disableButtonsControls={true}
            autoPlay={true}
            autoPlayInterval={3000}
            infinite={true}
          >
            <img
              src={legend2.src}
              alt="template"
              // width="100%"
              // height="200px"
            />
            <img
              src={legend3.src}
              alt="template"
              // width="100%"
              // height="200px"
            />
            <img
              src={legend1.src}
              alt="template"
              // width="100%"
              // height="200px"
            />
          </AliceCarousel>
        </div>
      </div>
      <div className="made-by-container">
        <div className="made-by-title">A Product By Alumni Of</div>
        <div className="company-container">
          <img alt="flipkart" src={flipkart.src} width="80px" height="auto" />
          <img alt="uber" src={uber.src} width="80px" height="auto" />
          <img alt="paytm" src={paytm.src} width="80px" height="auto" />
          <img alt="swiggy" src={swiggy.src} width="80px" height="auto" />
          <img alt="amazon" src={amazon.src} width="80px" height="auto" />
          <img alt="olx" src={olx.src} width="80px" height="auto" />
        </div>
      </div>
      <div className="process-container">
        <div className="title">How It Works</div>
        <div className="subtitle">3 Steps. 5 Minutes.</div>
        <div className="steps-container">
          <div className="step">
            <div className="step-count">1</div>
            <div>
              <div className="step-title">Choose a template</div>
              <div className="step-subtitle">
                3 Hiring manager approved templates
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step-count">2</div>
            <div>
              <div className="step-title">Enter Details</div>
              <div className="step-subtitle">
                Edit an existing resume or start from scratch
              </div>
            </div>
          </div>
          <div className="step">
            <div className="step-count">3</div>
            <div>
              <div className="step-title">Download and share</div>
              <div className="step-subtitle">
                Download resume in PDF and DOC
              </div>
            </div>
          </div>
        </div>
        <div className="action-cta">
          <button>
            {/* <Link href="/editor"> Build My Resume</Link> */}
            {session?.user ? (
              <Link href="/dashboard"> Build My Resume</Link>
            ) : (
              <Link href="/api/auth/signin"> Build My Resume</Link>
            )}
          </button>
        </div>
      </div>
      <div className="templates-container">
        <div className="template-title">Templates That Actually Work</div>
        <div className="template-subtitle">Apply With Confidence</div>
        <div className="template-text-container">
          <div className="template-text">
            Templates designed in collaboration with 60+ Hiring Managers
          </div>
        </div>
        <div className={`templates ${templateClass[selectedTemplate]}`}>
          <div className="nav-container">
            <div
              className={`${selectedTemplate === "classic" ? "nav-item selected" : "nav-item"}`}
              onClick={() => {
                setTemplateAndUpdateURL("classic"),
                  setSelectedTemplate("classic");
              }}
            >
              Fresher
            </div>
            <div
              className={`${selectedTemplate === "modern" ? "nav-item selected" : "nav-item"}`}
              onClick={() => {
                setTemplateAndUpdateURL("modern"),
                  setSelectedTemplate("modern");
              }}
            >
              Experienced
            </div>
            <div
              className={`${selectedTemplate === "bold" ? "nav-item selected" : "nav-item"}`}
              onClick={() => {
                setTemplateAndUpdateURL("bold");
                setSelectedTemplate("bold");
              }}
            >
              Presentable
            </div>
            <div
              className="template-cta"
              onClick={() => handleSetTemplate(template)}
            >
              <div>Use This Template</div>
              <FaAngleRight />
            </div>
          </div>
          <div className="image-container">
            {/* <div className='template-tagline'>Nothing flashy, just your best pitch with <span>finalCV</span></div> */}
            <div className="template-image">
              <img src={currentTemplate[selectedTemplate]} alt="template" />
            </div>
          </div>
        </div>
      </div>
      <div className="features-container">
        <div className="title">Resume Builder</div>
        <div className="subtitle">Dead Simple</div>
        <div className="features1">
          {/* <div className="feature">
            <div className="infographic">
              <img
                style={{ height: "40px", width: "auto" }}
                src={imp.src}
                alt="imp"
              />
            </div>
            <div className="feature-title">Linkedin Import</div>
            <div className="feature-desc">
              Get started effortlessly by importing all basic information from
              Linkedin directly
            </div>
          </div> */}
          <div className="feature">
            <div className="infographic">
              <img
                style={{ height: "40px", width: "auto" }}
                src={ats.src}
                alt="ats"
              />
            </div>
            <div className="feature-title">ATS Compliant</div>
            <div className="feature-desc">
              Every resume template is customised for ATS and checks out all
              best practices
            </div>
          </div>
          <div className="feature">
            <div className="infographic">
              <img
                style={{ height: "40px", width: "auto" }}
                src={ai.src}
                alt="ai"
              />
            </div>
            <div className="feature-title">Edit with AI</div>
            <div className="feature-desc">
              Detail your experience, skill set and summaries with best in class
              AI prompts
            </div>
          </div>
        </div>
        <div className="features1">
          {/* <div className="feature">
            <div className="infographic">
              <img
                style={{ height: "40px", width: "auto" }}
                src={cover.src}
                alt="cover"
              />
            </div>
            <div className="feature-title">One Click Cover Letter</div>
            <div className="feature-desc">
              Generate your professional cover letter in one click for your
              desired job
            </div>
          </div> */}
          <div className="feature">
            <div className="infographic">
              <img
                style={{ height: "40px", width: "auto" }}
                src={job.src}
                alt="job"
              />
            </div>
            <div className="feature-title">Tailored For Every Job</div>
            <div className="feature-desc">
              Just paste the job description and get a matching resume instantly
            </div>
          </div>
          <div className="feature">
            <div className="infographic">
              <img
                style={{ height: "40px", width: "auto" }}
                src={format.src}
                alt="format"
              />
            </div>
            <div className="feature-title">Auto Formatting</div>
            <div className="feature-desc">
              Those spaces, margins and paddings are already neatly taken care
              of
            </div>
          </div>
        </div>
      </div>
      <div className="referral-container">
        <div className="title">That's Not All</div>
        <div className="subtitle">Interview With Top Companies</div>
        <div className="referral">
          <div className="left">
            <div className="left-title">
              <MdOutlineContentPasteSearch
                style={{ fontSize: "5rem", marginRight: "16px" }}
              />
              <div>You finalCV is shared with Recruiters</div>
            </div>
            <div className="left-subtitle">
              We automatically share your resume for relevant roles with top
              companies
            </div>
            <div className="left-cta">
              <Link href="/api/auth/signin"> Build Now</Link>
              <FaAngleRight />            
            </div>
          </div>
          <div className="right">
            <div className="fang">
              <div className="logo-container">
                <img src={amz.src} alt="amz" width="60px" height="auto" />
              </div>
              <div className="logo-container">
                <img src={meta.src} alt="meta" width="70px" height="auto" />
              </div>
              <div className="logo-container">
                <img src={google.src} alt="google" width="60px" height="auto" />
              </div>
              <div className="logo-container">
                <img
                  src={microsoft.src}
                  alt="microsoft"
                  width="60px"
                  height="auto"
                />
              </div>
              <div className="fang-text">+3 more</div>
            </div>
            <div className="unicorns">
              <div className="logo-container">
                <img src={paytm.src} alt="paytm" width="60px" height="auto" />
              </div>
              <div className="logo-container">
                <img src={swiggy.src} alt="swiggy" width="70px" height="auto" />
              </div>
              <div className="logo-container">
                <img
                  src={phonepe.src}
                  alt="phonepe"
                  width="70px"
                  height="auto"
                />
              </div>
              <div className="logo-container">
                <img src={groww.src} alt="groww" width="70px" height="auto" />
              </div>
              <div className="logo-container">
                <img src={cars.src} alt="cars" width="70px" height="auto" />
              </div>
              <div className="logo-container">
                <img src={acko.src} alt="acko" width="70px" height="auto" />
              </div>
              <div className="unicorns-text">+20 more</div>
            </div>
            <div className="startups">
              <div className="logo-container">
                <img src={ycom.src} alt="ycom" width="60%" height="auto" />
              </div>
              <div className="startup-text">+50 Startups</div>
            </div>
          </div>
        </div>
      </div>
      <div className="testimonial-container">
        <div className="title">In The Buzz</div>
        <div className="subtitle">Our Users &#10084; us</div>
        <div className="testimonials">
          <div className="testimony first">
            <div className="header">
              <Image alt="logo" src={apoorv} />
              <div className="primary-info">
                <div className="name">Apoorv J.</div>
                <div className="profile">Product</div>
              </div>
            </div>
            <div className="star-rating">
              <Image src={stars} alt="stars" />
            </div>
            <div className="content">
              "The only resume building platform which also gives you job
              interviews. That’s what mattered for me the most."
            </div>
            <div className="timestamp">Jan 3, 2024</div>
          </div>
          <div className="testimony">
            <div className="header">
              <Image alt="logo" src={vega} />
              <div className="primary-info">
                <div className="name">Vega V.</div>
                <div className="profile">Marketing</div>
              </div>
            </div>
            <div className="star-rating">
              <Image src={stars} alt="stars" />
            </div>
            <div className="content">
              "There custom AI prompts and tips were truly a live saver. I could
              finally write my experiences professionally."
            </div>
            <div className="timestamp">Jan 19, 2024</div>
          </div>
          <div className="testimony">
            <div className="header">
              <Image alt="logo" src={yash} />
              <div className="primary-info">
                <div className="name">Yash M.</div>
                <div className="profile">Engineer</div>
              </div>
            </div>
            <div className="star-rating">
              <Image src={stars} alt="stars" />
            </div>
            <div className="content">
              "Super satisfied. You don’t need fancy templates. My ATS friendly
              resume gets screened and attention easily."
            </div>
            <div className="timestamp">Mar 12, 2024</div>
          </div>
          <div className="testimony first second">
            <div className="header">
              <Image alt="logo" src={parth} />
              <div className="primary-info">
                <div className="name">Parth A.</div>
                <div className="profile">Engineer</div>
              </div>
            </div>
            <div className="star-rating">
              <Image src={stars} alt="stars" />
            </div>
            <div className="content">
              "This is game changer. I could build my impressive resume from
              scratch in just a few minutes. Totally worth it."
            </div>
            <div className="timestamp">May 21, 2024</div>
          </div>
          <div className="testimony second">
            <div className="header">
              <Image alt="logo" src={apoorva} />
              <div className="primary-info">
                <div className="name">Apoorva G.</div>
                <div className="profile">Consultant</div>
              </div>
            </div>
            <div className="star-rating">
              <Image src={stars} alt="stars" />
            </div>
            <div className="content">
              "Tailoring your resume for every job profile in this market is
              like mandatory. I’m glad I landed on FinalCV."
            </div>
            <div className="timestamp">May 28, 2024</div>
          </div>
          <div className="testimony second">
            <div className="header">
              <Image alt="logo" src={medha} />
              <div className="primary-info">
                <div className="name">Medha A.</div>
                <div className="profile">Designer</div>
              </div>
            </div>
            <div className="star-rating">
              <Image src={stars} alt="stars" />
            </div>
            <div className="content">
              "What an honest product. It removes all noise and irrelavant stuff
              to focus only on building your resume that works."
            </div>
            <div className="timestamp">Jul 7, 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}
