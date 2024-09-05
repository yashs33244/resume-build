import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import imp from './imp.svg';
import ats from './ats.svg';
import ai from './ai.svg';
import job from './job.svg';
import amz from './referrals/amazon.png';
import meta from './referrals/meta.png';
import google from './referrals/google.png';
import microsoft from './referrals/microsoft.png';
import phonepe from './referrals/phonepe.png';
import flip from './referrals/flipkart.png';
import cars from './referrals/cars.png';
import acko from './referrals/acko.png';
import groww from './referrals/groww.png';
import ycom from './referrals/ycom.png';
import cover from './cover.svg';
import format from './format.svg';
import { BsStars } from "react-icons/bs";
import { FcViewDetails } from "react-icons/fc";
import { MdRocketLaunch } from "react-icons/md";
import { FcBriefcase } from "react-icons/fc";
import { GrLinkedin } from "react-icons/gr";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { FcTemplate } from "react-icons/fc";
import template1 from './template1.png';
import template2 from './template2.png';
import template3 from './template3.png';
import template4 from './template4.png';
import template5 from './template5.png';
import flipkart from './flipkart.png';
import uber from './uber.png';
import olx from './olx.png';
import swiggy from './swiggy1.png';
import amazon from './amazon.png';
import paytm from './paytm.png';
import Typewriter from 'typewriter-effect';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import './App.scss';

function App() {

  const [selectedTemplate, setSelected] = useState('classic');
  const currentTemplate = {
    "classic" : template1,
    "modern" : template2,
    "bold" : template3,
    "pro" : template4,
    "creative" : template5 
  };

  const templateClass = {
    "classic" : "back1",
    "modern" : "back2",
    "bold" : "back3",
    "pro" : "back4",
    "creative" : "back5"
  }

  return (
    <div className="App">
     <div className='top-bar'>
      <div className='logo-container'>
        <img alt="logo" src={logo} width="170px" height="auto" />
      </div>
      <div className='navbar-container'>
        <div>Cover Letter</div>
        <div>Login</div>
        <button>Create Resume</button>
      </div>
     </div>
     <div className='legend-container'>
        <div className='left-container'>
          <div className='title'>
            A no bullshit Resume
          </div>
          <div className='title-two'>that gets you hired!</div>
          <div className='typewriter'>
            <Typewriter
              options={{
                strings: ['Clean designs', 'Concise formats', 'Compelling content'],
                autoStart: true,
                loop: true,
                delay: 30,
                deleteSpeed: 10
              }}
            />
          </div>
          {/* <div className='form-container'>
              <div className='name'>
                <input placeholder='First Name' />
                <input placeholder='Last Name' />
              </div>
              <div className='contact'>
                <input placeholder='Your Email' />
                <input placeholder='Your Phone' />
              </div>
          </div> */}
          <div className='primary-cta'>
            <GrLinkedin /> 
            <div>Import From LinkedIn</div>
          </div>
          <div className='secondary-cta'>
            <FaEdit /> 
            <div>Enter Details Manually</div>
          </div>
        </div>
        <div className='right-container'>
          <AliceCarousel mouseTracking animationType="fadeout" disableDotsControls={true} disableButtonsControls={true} autoPlay={true} autoPlayInterval={3000} infinite={true}>
            <img src={template1} alt="template" width="100%" height="580px" />
            <img src={template2} alt="template" width="100%" height="580px" />
            <img src={template3} alt="template" width="100%" height="580px" />
            <img src={template4} alt="template" width="100%" height="580px" />
            <img src={template5} alt="template" width="100%" height="580px" />
          </AliceCarousel>
        </div>
     </div>
     <div className='made-by-container'>
        <div className='made-by-title'>
          A Product By Alumni Of 
        </div>
        <div className='company-container'>
          <img alt="flipkart" src={flipkart} width="80px" height="auto" />
          <img alt="uber" src={uber} width="80px" height="auto" />
          <img alt="paytm" src={paytm} width="80px" height="auto" />
          <img alt="swiggy" src={swiggy} width="80px" height="auto" />
          <img alt="amazon" src={amazon} width="80px" height="auto" />
          <img alt="olx" src={olx} width="80px" height="auto" />
        </div>
     </div>
     <div className='process-container'>
        <div className='title'>How It Works</div>
        <div className='subtitle'>3 Steps. 5 Minutes.</div>
        <div className='steps-container'>
          <div className='step'>
            <div className='step-count'>1</div>
            <div>
              <div className='step-title'>Import from Linkedin</div>
              <div className='step-subtitle'>Or start from scratch</div>
            </div>
          </div>
          <div className='step'>
            <div className='step-count'>2</div>
            <div>
              <div className='step-title'>Choose a template</div>
              <div className='step-subtitle'>5 Hiring manager approved templates</div>
            </div>
          </div>
          <div className='step'>
            <div className='step-count'>3</div>
            <div>
              <div className='step-title'>Edit and share</div>
              <div className='step-subtitle'>Download resume in PDF and DOC</div>
            </div>
          </div>
        </div>
        <div className='action-cta'>
          <button>Build My Resume</button>
        </div>
     </div>
     <div className='templates-container'>
      <div className='template-title'>Templates That Actually Work</div>
      <div className='template-subtitle'>Apply With Confidence</div>
      <div className='template-text-container'>
        <div className='template-text'>Templates designed in collaboration with 60+ Hiring Managers</div>
      </div>
      <div className={`templates ${templateClass[selectedTemplate]}`}>
        <div className='nav-container'>
          <div className={`${selectedTemplate === 'classic' ? 'nav-item selected' : 'nav-item'}`} onClick={() => setSelected('classic')}>Classic</div>
          <div className={`${selectedTemplate === 'modern' ? 'nav-item selected' : 'nav-item'}`} onClick={() => setSelected('modern')}>Modern</div>
          <div className={`${selectedTemplate === 'bold' ? 'nav-item selected' : 'nav-item'}`} onClick={() => setSelected('bold')}>Bold</div>
          <div className={`${selectedTemplate === 'pro' ? 'nav-item selected' : 'nav-item'}`} onClick={() => setSelected('pro')}>Professional</div>
          <div className={`${selectedTemplate === 'creative' ? 'nav-item selected' : 'nav-item'}`} onClick={() => setSelected('creative')}>Creative</div>
          <div className='template-cta'>Use This Template</div>
        </div>
        <div className='image-container'>
          {/* <div className='template-tagline'>Nothing flashy, just your best pitch with <span>finalCV</span></div> */}
          <div className='template-image'>
            <img src={currentTemplate[selectedTemplate]} alt="template" />
          </div>
        </div>
      </div>
     </div>
     <div className='features-container'>
        <div className='title'>
          Resume Builder
        </div>
        <div className='subtitle'>
          Dead Simple
        </div>
        <div className='features1'>
          <div className='feature'>
              <div className='infographic'><img style={{height: '40px', width: 'auto'}} src={imp} alt="imp" /></div>
              <div className='feature-title'>Linkedin Import</div>
              <div className='feature-desc'>Get started effortlessly by importing all basic information from Linkedin directly</div>
          </div>
          <div className='feature'>
              <div className='infographic'><img style={{height: '40px', width: 'auto'}} src={ats} alt="ats" /></div>
              <div className='feature-title'>ATS Compliant</div>
              <div className='feature-desc'>Every resume template is customised for ATS and checks out all best practices</div>
          </div>
          <div className='feature'>
              <div className='infographic'><img style={{height: '40px', width: 'auto'}} src={ai} alt="ai" /></div>
              <div className='feature-title'>Edit with AI</div>
              <div className='feature-desc'>Detail your experience, skill set and summaries with best in class AI prompts</div>
          </div>
        </div>
        <div className='features1'>
          <div className='feature'>
              <div className='infographic'><img style={{height: '40px', width: 'auto'}} src={cover} alt="cover" /></div>
              <div className='feature-title'>One Click Cover Letter</div>
              <div className='feature-desc'>Generate your professional cover letter in one click for your desired job</div>
          </div>
          <div className='feature'>
              <div className='infographic'><img style={{height: '40px', width: 'auto'}} src={job} alt="job" /></div>
              <div className='feature-title'>Tailored For Every Job</div>
              <div className='feature-desc'>Just paste the job description and get a matching resume instantly</div>
          </div>
          <div className='feature'>
              <div className='infographic'><img style={{height: '40px', width: 'auto'}} src={format} alt="format" /></div>
              <div className='feature-title'>Auto Formatting</div>
              <div className='feature-desc'>Those spaces, margins and paddings are already neatly taken care of</div>
          </div>
        </div>
     </div>
     <div className='referral-container'>
      <div className='title'>That's Not All</div>
      <div className='subtitle'>Interview With Top Companies</div>
      <div className='referral'>
        <div className='left'>
          <div className='left-title'>
            <MdOutlineContentPasteSearch style={{fontSize: '5rem', marginRight: '16px'}} />
            <div>You finalCV is viewed by Recruiters</div>
            
          </div>
          <div className='left-subtitle'>We automatically share your resume for relevant roles with top companies</div>
          <div className='left-cta'>Build Now</div>
        </div>
         <div className='right'>
            <div className='fang'>
              <div className='logo-container'>
                <img src={amz} alt="amz" width="60px" height="auto" />
              </div>
              <div className='logo-container'>
                <img src={meta} alt="meta" width="70px" height="auto" />
              </div>
              <div className='logo-container'>
                <img src={google} alt="google" width="60px" height="auto" />
              </div>
              <div className='logo-container'>
                <img src={microsoft} alt="microsoft" width="60px" height="auto" />
              </div>
              <div className='fang-text'>+3 more</div>
            </div>
            <div className='unicorns'>
              <div className='logo-container'>
                <img src={paytm} alt="paytm" width="60px" height="auto" />
              </div>
              <div className='logo-container'>
                <img src={swiggy} alt="swiggy" width="70px" height="auto" />
              </div>
              <div className='logo-container'>
                <img src={phonepe} alt="phonepe" width="70px" height="auto" />
              </div>
              <div className='logo-container'>
                <img src={groww} alt="groww" width="70px" height="auto" />
              </div>
              <div className='logo-container'>
                <img src={cars} alt="cars" width="70px" height="auto" />
              </div>
              <div className='logo-container'>
                <img src={acko} alt="acko" width="70px" height="auto" />
              </div>
              <div className='unicorns-text'>+20 more</div>
            </div>
            <div className='startups'>
              <div className='logo-container'>
                <img src={ycom} alt="ycom" width="60%" height="auto" />
              </div>              
              <div className='startup-text'>+50 Startups</div>
            </div>
        </div>
      </div>
     </div>
    </div>
  );
}

export default App;
