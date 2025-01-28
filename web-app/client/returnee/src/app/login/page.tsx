"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:1111/auth/login", {
        emailOrPhone,
        password,
      });

      console.log("Login successful", response.data);

      // Store token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // const user = response.data.user;
      console.log("user", response.data.user);
      // console.log("First Name:", user.first_name);
      // console.log("Last Name:", user.last_name);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error", error);
        setErrorMessage(error.response?.data?.message || "Login failed");
      } else {
        console.error("Unexpected error", error);
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  // 🔹 Google Login Function
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:1111/auth/google"; // Redirect to backend Google OAuth
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <h1 className="text-3xl font-bold mb-4 text-PrimaryColor">Returnee</h1>
        <h2 className="text-xl font-semibold mb-6">Log in to your Account</h2>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="p-3 border rounded-lg shadow-sm flex items-center justify-center gap-2 bg-white hover:bg-gray-100"
            >
              <FcGoogle className="h-6 w-6" />
              Continue with Google
            </button>
            <button
              type="button"
              className="p-3 border rounded-lg shadow-sm flex items-center justify-center gap-2 bg-white hover:bg-gray-100"
            >
              <FaFacebook className="h-6 w-6 text-blue-600" />
              Continue with Facebook
            </button>

            <div className="text-center text-gray-500">
              or continue with email or phone number
            </div>

            <input
              type="text"
              placeholder="Email or Phone Number"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-PrimaryColor"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-PrimaryColor"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a
                href="#"
                className="text-AccentColor hover:text-AccentColorHover"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="p-3 bg-PrimaryColor text-white rounded-lg hover:bg-green-700"
            >
              Log in
            </button>
          </div>
        </form>

        {/* Navigate to Register Page */}
        <div className="mt-4 text-gray-500">
          Don’t have an account?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-AccentColor hover:text-AccentColorHover"
          >
            Create an account
          </button>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className="hidden md:flex w-1/2 relative">
        <Image
          src="/assets/loginPagePic4.jpg"
          alt="Login Page Image"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
