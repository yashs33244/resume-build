import React from "react";
import Link from "next/link";
import ResumeCard from "./FrontPageResume"; // Make sure to import the ResumeCard component
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FileIcon,
  SparkleIcon,
  StarIcon,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-100 to-purple-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Let's build your CV together
            </h1>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Surname"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Mobile"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="text-center font-bold text-gray-500">OR</div>
              <input
                type="text"
                placeholder="Paste your LinkedIn URL here for autofill"
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-between mt-4">
                <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full">
                  Back
                </button>
                <Link href="/editor">
                  <button className="px-6 py-2 bg-gray-800 text-white rounded-full">
                    Continue
                  </button>
                </Link>
              </div>
            </form>
          </div>
          <div className="w-full md:w-1/2 pl-0 md:pl-8">
            <ResumeCard />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Build your cv_final with us
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: FileIcon, title: "State of the art templates" },
              { icon: SparkleIcon, title: "AI assisted journey" },
              { icon: StarIcon, title: "ATS friendly CV's" },
            ].map(({ icon: Icon, title }, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 w-64 flex flex-col items-center"
              >
                <Icon className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-center font-semibold">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
