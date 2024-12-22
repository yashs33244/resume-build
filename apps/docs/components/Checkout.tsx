"use client";
import React, { useState } from "react";
import "./Checkout.scss";
import { TbUserScreen } from "react-icons/tb";
import { FaUsersViewfinder } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { AiOutlineSafety } from "react-icons/ai";
import { useUserStatus } from "../hooks/useUserStatus";
import { useSubscription } from "../hooks/useSubscription";
import { useFetchResumeData } from "../hooks/useFetchResumeData";

export default function Checkout() {
  const [selectedPack, setSelectedPack] = useState<"30" | "90">("90");
  const { user } = useUserStatus();
  const { rdata } = useFetchResumeData();
  const { handleSubscription, loading, error } = useSubscription({
    userId: user?.id || "",
    resumeData: rdata,
  });

  const handlePackSelection = (pack: "30" | "90") => {
    setSelectedPack(pack);
  };

  const handlePayment = async () => {
    // Trigger the payment process
    await handleSubscription(selectedPack);
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
              <div className="price">₹249</div>
              <div className="pack-info">Value for Money</div>
            </div>
            <div
              onClick={() => handlePackSelection("90")}
              className={`pack-90 ${selectedPack === "90" ? "selected" : ""}`}
            >
              <div className="pack-type">Value</div>
              <div className="timeline">90 Days</div>
              <div className="price">₹599</div>
              <div className="pack-info">Ideal for Job Hunting</div>
            </div>
          </div>
          <div className="payment-cta">
            <button
              onClick={handlePayment}
              disabled={loading}
              className={loading ? "loading" : ""}
            >
              {loading ? "Processing..." : "Pay and Download"}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="side-note">
            One time payment with 7-day money back guarantee
          </div>
        </div>
      </div>
    </div>
  );
}
