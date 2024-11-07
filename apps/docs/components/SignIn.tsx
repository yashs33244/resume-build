"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PiHandWavingDuotone } from "react-icons/pi";
import logo from "./logo.svg";
import Image from "next/image";
import { FaCheck } from "react-icons/fa6";
import vector1 from "./vector1.svg";
import vector2 from "./vector2.svg";
import vector3 from "./vector3.svg";
import "./Signin.scss";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      // Redirect to select-templates page on successful sign-in
      router.push("/dashboard");
    }
  };

  return (
    <div className="signin-container">
      <div className="logo">
        <Image src={logo} alt="logo" width={120} height={120} />
      </div>
      <div className="signin-box">
        <div className="benefits">
          <div className="benefit">
            <div className="check">
              <FaCheck />
            </div>
            <div className="text">Simple Like Canva</div>
            <div className="infographic">
              <Image src={vector2} alt="vector" />
            </div>
          </div>
          <div className="benefit">
            <div className="check">
              <FaCheck />
            </div>
            <div className="text">ATS friendly like Docs</div>
            <div className="infographic">
              <Image src={vector3} alt="vector" />
            </div>
          </div>
          <div className="benefit">
            <div className="check">
              <FaCheck />
            </div>
            <div className="text">As smart as GPT</div>
            <div className="infographic">
              <Image src={vector1} alt="vector" />
            </div>
          </div>
        </div>
        <div className="google-container">
          <div className="title">Login to continue</div>
          <div className="mt-4 text-center">
            {/* <p className="text-gray-600">Or sign in with</p> */}
            <div className="flex justify-center mt-2 space-x-4">
              <button
                onClick={() => signIn("google", { redirect: true })}
                style={{
                  width: "72%",
                  fontWeight: "600",
                  fontSize: "1.2rem",
                  borderRadius: "40px",
                  padding: "16px",
                }}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Image
                  src="/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
