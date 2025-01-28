"use client";

import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:1111/auth/register", {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });

      console.log("Registration successful", response.data);
      setSuccessMessage("Account registered successfully! Redirecting...");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Registration error", error);
        setErrorMessage(error.response?.data?.message || "Registration failed");
      } else {
        console.error("Unexpected error", error);
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = "http://localhost:1111/auth/google";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side - Register Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-4 text-PrimaryColor">Returnee</h1>
        <h2 className="text-xl font-semibold mb-6">Create your Account</h2>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-sm mb-4">{successMessage}</div>
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
              or sign up with email
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-PrimaryColor"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-PrimaryColor"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <input
              type="tel"
              placeholder="Phone Number"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-PrimaryColor"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-PrimaryColor"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-PrimaryColor"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-PrimaryColor"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              I agree to the Terms and Conditions
            </label>

            <button
              type="submit"
              className="p-3 bg-PrimaryColor text-white rounded-lg hover:bg-green-700"
            >
              Register
            </button>
          </div>
        </form>

        <div className="mt-4 text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-AccentColor hover:text-AccentColorHover"
          >
            Log in
          </a>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className="hidden md:flex w-1/2 relative">
        <Image
          src="/assets/loginPagePic5.jpg"
          alt="Register Page Image"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
