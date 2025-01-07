"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import PrivacyAndPolicy from "../../components/SettingsComponents/PrivacyAndPolicySection";
import EditProfileSection from "../../components/SettingsComponents/EditProfileSection";
import AccountSetting from "../../components/SettingsComponents/AccountSetting";
import ItemHistorySection from "../../components/SettingsComponents/ItemHistorySection";

interface SettingListProps {
  closeMenu: () => void;
  setActiveComponent: (component: string) => void;
}

const SettingList: React.FC<SettingListProps> = ({
  closeMenu,
  setActiveComponent,
}) => {
  const settings = [
    { name: "Edit Profile", component: "EditProfile" },
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
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <div className="w-64 h-full bg-white p-4 shadow-lg md:shadow-none md:border-r border-gray-300 md:h-screen">
      <div className="text-center mb-6 hidden md:block">
        <div className="w-20 h-20 rounded-full bg-gray-400 mx-auto"></div>
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

const DeleteAccount = () => <div className="p-6">Delete Account Component</div>;

const AccountPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("EditProfile");
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const components: Record<string, React.ReactNode> = {
    EditProfile: <EditProfileSection />,
    AccountSetting: <AccountSetting />,
    ItemsHistory: <ItemHistorySection />,
    PrivacyPolicy: <PrivacyAndPolicy />,
    Logout: <Logout />,
    DeleteAccount: <DeleteAccount />,
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="p-4 md:hidden flex justify-between items-center bg-white border-b shadow">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-400"></div>
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
