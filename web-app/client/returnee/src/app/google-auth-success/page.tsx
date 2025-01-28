"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const GoogleAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const processGoogleLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userData = urlParams.get("user");

      if (token && userData) {
        const user = JSON.parse(decodeURIComponent(userData));

        // Store user & token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Saved User in localStorage:", user); // Debugging Log

        // Redirect to Home Page
        router.push("/");
      }
    };

    processGoogleLogin();
  }, []);

  return <div>Logging in with Google... Redirecting...</div>;
};

export default GoogleAuthRedirect;
