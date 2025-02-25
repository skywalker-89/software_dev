"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const FacebookAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const processFacebookLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userData = urlParams.get("user");

      if (token && userData) {
        const user = JSON.parse(decodeURIComponent(userData));

        // Store user & token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("✅ Facebook Login Success - Saved User:", user); // Debugging Log

        // Redirect to Home Page
        router.push("/");
      }
    };

    processFacebookLogin();
  }, []);

  return <div>Logging in with Facebook... Redirecting...</div>;
};

export default FacebookAuthRedirect;
