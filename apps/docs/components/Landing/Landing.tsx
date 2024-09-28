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
import AliceCarousel from "react-alice-carousel";
import Link from "next/link";
import "react-alice-carousel/lib/alice-carousel.css";
import "./App.scss";
import { useSession } from "next-auth/react";
// import { useSession } from "next-auth/react";

export default function LandingPage() {
  // const { data: session, status: sessionStatus } = useSession();
  const [selectedTemplate, setSelected] = useState("classic");
  const { data: session, status: sessionStatus } = useSession();
  const currentTemplate: { [key: string]: string } = {
    classic: template1.src,
    modern: template2.src,
    bold: template3.src,
  } as { [key: string]: string };

  const templateClass = {
    classic: "back1",
    modern: "back2",
    bold: "back3",
    pro: "back4",
    creative: "back5",
  };

  return (
    <div className="App">
      {/* <div className="top-bar">
        <div className="logo-container">
          <img alt="logo" src={logo.src} width="170px" height="auto" />
        </div>
        <div className="navbar-container">
          <div>Cover Letter</div>
          {session?.user ? (
            <Link href="/api/auth/signin">Logout</Link>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
          <button>Create Resume</button>
        </div>
      </div> */}
      <div className="legend-container">
        <div className="left-container">
          <div className="title">A no bullshit Resume</div>
          <div className="title-two">that gets you hired!</div>
          <div className="typewriter">
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
          </div>
          <div className="primary-cta">
            <MdRocketLaunch />
            <div>
              {session?.user ? (
                <Link href="/select-templates/editor"> Get Started</Link>
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
            <Image alt="loved" src={lovedby} width="44%" />
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
              src={template1.src}
              alt="template"
              width="100%"
              height="580px"
            />
            <img
              src={template2.src}
              alt="template"
              width="100%"
              height="580px"
            />
            <img
              src={template3.src}
              alt="template"
              width="100%"
              height="580px"
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
                Edit with AI and in-built best practices
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
              <Link href="/select-templates/editor"> Build My Resume</Link>
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
              onClick={() => setSelected("classic")}
            >
              Fresher
            </div>
            <div
              className={`${selectedTemplate === "modern" ? "nav-item selected" : "nav-item"}`}
              onClick={() => setSelected("modern")}
            >
              Experienced
            </div>
            <div
              className={`${selectedTemplate === "bold" ? "nav-item selected" : "nav-item"}`}
              onClick={() => setSelected("bold")}
            >
              Presentable
            </div>
            <div className="template-cta">
              <Link href="/editor">Use This Template</Link>
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
              {" "}
              {session?.user ? (
                <Link href="/select-templates/editor"> Build Now</Link>
              ) : (
                <Link href="/api/auth/signin"> Build Now</Link>
              )}
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
    </div>
  );
}
