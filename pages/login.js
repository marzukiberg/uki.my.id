import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        if (data.authenticated) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret }),
      });
      const data = await response.json();
      if (response.ok && data.authenticated) {
        // Redirect or set user session
        console.log("Authentication successful!");
        // Example: Redirect to a dashboard page
        router.push("/dashboard"); // Redirect to dashboard after successful login
      } else {
        setError(data.message || "Authentication failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during authentication.");
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="relative flex min-h-[500px] w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg">
          {/* Left Section - Welcome Message */}
          <div className="relative hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white md:flex">
            {/* Abstract shapes - simplified for Tailwind */}
            <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-blue-500 opacity-20"></div>
            <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-blue-700 opacity-20"></div>
            <div className="z-10 text-center">
              <h1 className="mb-4 text-4xl font-bold">WELCOME</h1>
              <h2 className="mb-4 text-xl font-semibold">YOUR HEADLINE NAME</h2>
              <p className="text-sm leading-relaxed">
                Welcome to the secure login portal. Please enter your secret key
                to proceed.
              </p>
            </div>
          </div>

          {/* Right Section - Login Form */}
          <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2">
            <div className="w-full max-w-md">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">Sign in</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    className="mb-2 block text-sm font-semibold text-gray-700"
                    htmlFor="secret"
                  >
                    Secret Key
                  </label>
                  <input
                    className="w-full appearance-none rounded-md border px-4 py-3 leading-tight text-gray-700 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    id="secret"
                    type="password"
                    placeholder="Enter your secret key"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="mb-4 text-xs italic text-red-500">{error}</p>
                )}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    className="focus:shadow-outline w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 font-bold text-white transition-all duration-200 hover:from-blue-600 hover:to-blue-800 focus:outline-none"
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
