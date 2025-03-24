"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import PrivacyAndPolicy from "../../components/SettingsComponents/PrivacyAndPolicySection";
import AccountSetting from "../../components/SettingsComponents/AccountSetting";
import ItemHistorySection from "../../components/SettingsComponents/ItemHistorySection";
import Image from "next/image";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast"; // ✅ Import toast

const API_URL = `http://${process.env.id}:1111/auth/me`;

interface SettingListProps {
  closeMenu: () => void;
  setActiveComponent: (component: string) => void;
}

const SettingList: React.FC<SettingListProps> = ({
  closeMenu,
  setActiveComponent,
}) => {
  const settings = [
    { name: "Account Verification", component: "AccountSetting" },
    { name: "Items History", component: "ItemsHistory" },
    { name: "Privacy & Policy", component: "PrivacyPolicy" },
    { name: "Logout", component: "Logout" },
  ];

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_picture: "",
    verified: "", // Add verificationStatus here
    id: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      console.log("This is the token", token);

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        console.log(data.user);
        setUser(data.user);

        // Save user data to local storage
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  const [isUploading, setIsUploading] = useState(false); // Track upload state

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token"); // Ensure token is included

    const formData = new FormData();
    formData.append("id", user.id); // Send user ID
    formData.append("firstName", user.first_name);
    formData.append("lastName", user.last_name);
    formData.append("image", file); // Append the image file

    setIsUploading(true); // ✅ Start Loading

    try {
      const response = await fetch(
        `http://${process.env.id}:1111/auth/upload-profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token
          },
          body: formData, // Send formData instead of JSON
        }
      );
      toast.success("Profile Picture Updated!");

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      // ✅ Update the state with the new profile picture URL
      setUser((prevUser) => ({
        ...prevUser,
        profile_picture: data.profile_picture, // Update with new image URL
      }));

      // ✅ Update localStorage with new profile picture URL
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, profile_picture: data.profile_picture })
      );
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setIsUploading(false); // ✅ Stop Loading
    }
  };

  return (
    <div className="w-64 h-full bg-white p-4 shadow-lg md:shadow-none md:border-r border-gray-300 md:h-screen">
      <div className="text-center mb-6 hidden md:block">
        {/* Profile Picture */}
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden group border-2 border-gray-100">
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-400 animate-pulse">
              <svg
                className="h-8 w-8 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : user.profile_picture ? (
            <Image
              src={`${user.profile_picture}?t=${new Date().getTime()}`}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-400"></div>
          )}
          {/* Click Overlay (instead of hover for mobile) */}
          <label
            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity cursor-pointer ${
              isUploading
                ? "cursor-not-allowed"
                : "opacity-0 group-hover:opacity-100"
            }`}
            htmlFor="fileInput"
          >
            <p className="text-white text-sm font-medium">
              {isUploading ? "Uploading..." : "Edit"}
            </p>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading} // ✅ Disable input while uploading
          />
        </div>

        <h4 className="mt-2 text-lg font-semibold">
          {user.first_name} {user.last_name}
        </h4>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      {settings.map((item, index) => (
        <div
          key={index}
          className={`p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-100 ${
            item.name === "Logout" ? "text-red-500" : ""
          }`}
          onClick={() => {
            setActiveComponent(item.component);
            closeMenu();
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

const Logout: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // 🔥 Remove token from Cookies
    Cookies.remove("token");
    router.push("/login");
  }, [router]);
  return null;
};

const AccountPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("AccountSetting");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_picture: "",
    verified: "", // Add verificationStatus here
    id: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.user);

        // Save user data to local storage
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  const [isUploading, setIsUploading] = useState(false); // Track upload state
  const [isClicked, setIsClicked] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token"); // Ensure token is included

    const formData = new FormData();
    formData.append("id", user.id); // Send user ID
    formData.append("firstName", user.first_name);
    formData.append("lastName", user.last_name);
    formData.append("image", file); // Append the image file

    try {
      setIsUploading(true);
      const response = await fetch(
        `http://${process.env.id}:1111/auth/upload-profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token
          },
          body: formData, // Send formData instead of JSON
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log("Profile picture updated:", data);

      // ✅ Update the state with the new profile picture URL
      setUser((prevUser) => ({
        ...prevUser,
        profile_picture: data.profile_picture, // Update with new image URL
      }));

      // ✅ Update localStorage with new profile picture URL
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, profile_picture: data.profile_picture })
      );
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    } finally {
      setIsUploading(false); // ✅ Stop Loading
    }
  };

  const components: Record<string, React.ReactNode> = {
    AccountSetting: <AccountSetting user={user} setUser={setUser} />,
    ItemsHistory: <ItemHistorySection />,
    PrivacyPolicy: <PrivacyAndPolicy />,
    Logout: <Logout />,
  };

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="bottom-right" />
      <Navbar />
      {/* 🔹 Mobile Profile Section */}
      <div className="p-4 md:hidden flex justify-between items-center bg-white border-b shadow">
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          <div
            className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 group mx-auto border-2 border-gray-100"
            onClick={() => {
              setIsClicked(true); // ✅ Set clicked state
              document.getElementById("fileInput")?.click();
              setTimeout(() => setIsClicked(false), 200); // ✅ Reset after 200ms
            }}
          >
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-400 animate-pulse">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            ) : user.profile_picture ? (
              <Image
                src={`${user.profile_picture}?t=${new Date().getTime()}`}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-400"></div>
            )}

            {/* Clickable Overlay (Mobile Tap) */}
            <label
              className={`absolute inset-0 bg-black ${
                isClicked ? "bg-opacity-50" : "bg-opacity-0"
              } flex items-center justify-center transition-opacity cursor-pointer ${
                isUploading ? "cursor-not-allowed" : ""
              }`}
              htmlFor="fileInput"
            ></label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading} // ✅ Disable while uploading
            />
          </div>
          <h4 className="text-lg font-semibold">
            {user.first_name} {user.last_name}
          </h4>
        </div>
        <button
          className="p-2 rounded-md border border-gray-300 hover:bg-gray-100"
          onClick={toggleMenu}
        >
          ☰
        </button>
      </div>

      <div className="flex flex-1">
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-50 bg-white md:w-64 shadow-lg md:shadow-none`}
        >
          <SettingList
            closeMenu={closeMenu}
            setActiveComponent={setActiveComponent}
          />
        </div>

        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
            onClick={closeMenu}
          ></div>
        )}

        <div className="flex-1 p-6">{components[activeComponent]}</div>
      </div>
    </div>
  );
};

export default AccountPage;
