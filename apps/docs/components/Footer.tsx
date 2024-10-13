import Link from "next/link";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa6";
import { AiOutlineMail } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";
import logo from "./logo.svg";
import "./footer.scss";
export default function Footer() {
  return (
    <footer className="bg-muted-dark md:py-12 w-full flex justify-around">
        <div className="branding">
          <div className="logo">
            <Image alt="logo" src={logo} width={100} height={100} />
          </div>
          <div className="copyright">© Copyright 2024 - finalCV</div>
        </div> 
        <div className="company">
          <div className="heading">Company</div>  
          <div className="link">About Us</div>        
          <div className="link">
            <FaLinkedin />
            <div style={{marginLeft: '8px'}}>LinkedIn</div>
          </div>                    
        </div>
        <div className="contact">
          <div className="heading">Contact Us</div>
          <div className="link">
            <AiOutlineMail />
            <div style={{marginLeft: '8px'}}>hello@finalcv.com</div>
          </div>
          <div className="link">
            <BsTelephone />
            <div style={{marginLeft: '8px'}}>+91 8630845133</div>
          </div>               
        </div>
        <div className="support">
          <div className="heading">Support</div>          
          <div className="link">Privacy</div>
          <div className="link">Terms of Service</div>          
        </div>              
    </footer>
  );
}
