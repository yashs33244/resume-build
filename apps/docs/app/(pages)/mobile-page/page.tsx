import Image from "next/image";
import logo from "./logo.svg";
import feat1 from "./feat1.png";
import feat2 from "./feat2.png";
import feat3 from "./feat3.png";
import banner from "./banner.svg";
import "./mobile.scss";

export default function Page() {
  return (
    <div className="mobile-container">
      <div className="logo">
        <Image src={logo} alt="logo" />
      </div>
      <div className="headline">Resume making is serious business</div>
      <div className="tagline">Visit <span className="site-link">www.finalcv.com</span> on your computer to get started</div>
      <div className="features">
        <Image src={feat1} alt="feat" />
        <Image src={feat2} alt="feat" />
        <Image src={feat3} alt="feat" />
      </div>
      <div className="banner">
        <Image src={banner} alt="banner" />
      </div>
    </div>
  )
}
