"use client";

import React from "react";
import { useProfileSession } from "../hooks/useProfileSession"; // Adjust the import path as needed

export default function ProfileWrapper() {
  const { status, user, isOpen, setIsOpen, handleSignIn, handleSignOut } =
    useProfileSession();

  if (status === "loading") {
    return <div className="text-gray-600">Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <button
        onClick={handleSignIn}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
      >
        <img
          src={user?.image || "https://via.placeholder.com/40"}
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-gray-300"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">
              {user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500">
              {user?.email || "user@example.com"}
            </p>
          </div>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              // Handle view profile action
            }}
          >
            View Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              // Handle settings action
            }}
          >
            Settings
          </button>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
