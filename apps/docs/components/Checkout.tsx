"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Checkout.scss";
import { TbUserScreen } from "react-icons/tb";
import { FaUsersViewfinder } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { AiOutlineSafety } from "react-icons/ai";

export default function Checkout() {
  const [selectedPack, setSelectedPack] = useState("90");

  const handlePackSelection = (pack: any) => {
    setSelectedPack(pack);
  };

  return (
    <div className="checkout-container">
      <div className="content-container">
        <div className="left">
          <div className="heading">Download your final CV</div>
          <div className="info-box">
            <div className="info-line first">
              <FiEdit />
              <div>Unlimited edits and resume downloads</div>
            </div>
            <div className="info-line">
              <FaUsersViewfinder />
              <div>Free resume review from hiring managers</div>
            </div>
            <div className="info-line">
              <TbUserScreen />
              <div>Get referrals and interview in top companies</div>
            </div>
          </div>
          <div className="social-proofing">
            <div className="resume-numbers">
              <div className="info-head">
                <HiOutlineDocumentDownload style={{ color: "#329D5D" }} />
                <div>86,251+</div>
              </div>
              <div className="info-detail">Resumes Downloaded</div>
            </div>
            <div className="money-back">
              <div className="info-head">
                <AiOutlineSafety style={{ color: "#329D5D" }} />
                <div>100%</div>
              </div>
              <div className="info-detail">Moneyback Guarentee</div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="payment-packs">
            <div
              onClick={() => handlePackSelection("30")}
              className={`pack-30 ${selectedPack === "30" ? "selected" : ""}`}
            >
              <div className="pack-type">Popular</div>
              <div className="timeline">30 Days</div>
              <div className="price">₹199</div>
              <div className="pack-info">Good for Trial</div>
            </div>
            <div
              onClick={() => handlePackSelection("90")}
              className={`pack-90 ${selectedPack === "90" ? "selected" : ""}`}
            >
              <div className="pack-type">Value</div>
              <div className="timeline">90 Days</div>
              <div className="price">₹499</div>
              <div className="pack-info">Best for Job Hunting</div>
            </div>
          </div>
          <div className="payment-cta">Pay and Download</div>
          <div className="side-note">
            One time payment with 7-day money back guarentee
          </div>
        </div>
      </div>
    </div>
  );
}
