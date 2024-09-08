"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
      router.push("/select-templates");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="m-auto bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl">
        <div className="p-8 md:w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-slate-500">
            Let's build your CV together
          </h2>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <p className="text-gray-600">Or sign in with</p>
            <div className="flex justify-center mt-2 space-x-4">
              <button
                onClick={() => signIn("google")}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Image
                  src="/google.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Google
              </button>
              <button
                onClick={() => signIn("linkedin")}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Image
                  src="/linkedin.png"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                LinkedIn
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 bg-gradient-to-br from-purple-400 to-blue-500 text-white rounded-r-xl p-8 hidden md:block">
          <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
          <p>
            Sign in to access your CV builder and continue crafting your
            professional journey.
          </p>
        </div>
      </div>
    </div>
  );
}
