"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PiHandWavingDuotone } from "react-icons/pi";
import logo from "./logo.svg";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = new URLSearchParams(window.location.search); // Updated

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
      const callbackUrl = searchParams.get("callbackUrl"); // Get the callbackUrl
      if (callbackUrl && callbackUrl.startsWith("/")) {
        router.push(callbackUrl); // Redirect to the original URL with the query parameters intact
      } else {
        router.push("/select-templates"); // Fallback to a default page
      }
    }
  };

  return (
    <div
      style={{ background: "linear-gradient(135deg, black, #555555)" }}
      className="flex min-h-screen bg-gradient-to-br from-purple-100"
    >
      <div className="m-auto bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
        <Image
          alt="logo"
          src={logo}
          width={140}
          style={{ position: "fixed", bottom: "2rem", left: "4rem" }}
        />
        <div className="p-8 md:w-1/2">
          <div
            className="hello"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PiHandWavingDuotone
              style={{ width: "40px", height: "40px", fill: "#C68641" }}
            />
            <div
              style={{
                color: "slategray",
                fontSize: "1.6rem",
                fontWeight: "700",
                textAlign: "center",
                marginLeft: "12px",
              }}
            >
              Hi There!
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="username"
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white placeholder-opacity-75 bg-transparent"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white placeholder-opacity-75 bg-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign In
            </button>
          </form>
          <div className="mt-4 text-center">
            {/* <p className="text-gray-600">Or sign in with</p> */}
            <div className="flex justify-center mt-2 space-x-4">
              <button
                onClick={() => signIn("google")}
                style={{
                  width: "80%",
                  fontWeight: "600",
                  fontSize: "1.2rem",
                  borderRadius: "8px",
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
        <div
          style={{ backgroundColor: "#2B3EFA" }}
          className="md:w-1/2 bg-gradient-to-br from-purple-400 text-white rounded-r-xl p-8 hidden md:block"
        >
          <h2 className="text-2xl font-bold mb-4">
            Build your impressive Resume..
          </h2>
          <p style={{ fontWeight: "500", opacity: "0.8" }}>
            Simple and ATS friendly like Google Docs, elegant like Canva and
            powerful like GPT-4o
          </p>
        </div>
      </div>
    </div>
  );
}
