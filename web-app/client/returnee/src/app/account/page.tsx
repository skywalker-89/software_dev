"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import PrivacyAndPolicy from "../../components/SettingsComponents/PrivacyAndPolicySection";
import AccountSetting from "../../components/SettingsComponents/AccountSetting";
import ItemHistorySection from "../../components/SettingsComponents/ItemHistorySection";
import Image from "next/image";

const API_URL = "http://localhost:1111/auth/me";

interface SettingListProps {
  closeMenu: () => void;
  setActiveComponent: (component: string) => void;
}

const SettingList: React.FC<SettingListProps> = ({
  closeMenu,
  setActiveComponent,
}) => {
  const settings = [
    { name: "Account Setting", component: "AccountSetting" },
    { name: "Items History", component: "ItemsHistory" },
    { name: "Privacy & Policy", component: "PrivacyPolicy" },
    { name: "Logout", component: "Logout" },
    { name: "Delete Account", component: "DeleteAccount" },
  ];

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profilePicture: "",
    verified: "", // Add verificationStatus here
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfilePicture = reader.result as string;
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: newProfilePicture,
        }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, profilePicture: newProfilePicture })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-64 h-full bg-white p-4 shadow-lg md:shadow-none md:border-r border-gray-300 md:h-screen">
      <div className="text-center mb-6 hidden md:block">
        {/* Profile Picture */}
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden group">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-400"></div>
          )}

          {/* Hover Overlay */}
          <label
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            htmlFor="fileInput"
          >
            <p className="text-white text-sm font-medium">Edit</p>
          </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
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
            item.name === "Logout" || item.name === "Delete Account"
              ? "text-red-500"
              : ""
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
    profilePicture: "",
    verified: "", // Add verificationStatus here
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

  // ✅ Updated handleFileChange to maintain user state
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfilePicture = reader.result as string;
        setUser((prevUser) => ({
          ...prevUser,
          profilePicture: newProfilePicture,
        }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, profilePicture: newProfilePicture })
        );
      };
      reader.readAsDataURL(file);
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
      <Navbar />
      {/* 🔹 Mobile Profile Section */}
      <div className="p-4 md:hidden flex justify-between items-center bg-white border-b shadow">
        <div className="flex items-center space-x-4">
          {/* 🔹 Profile Picture in Mobile Navbar */}
          <label className="relative w-10 h-10 rounded-full bg-gray-400 overflow-hidden cursor-pointer">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
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
