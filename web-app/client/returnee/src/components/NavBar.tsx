"use client";

import React, { useState } from "react";
import Link from "next/link"; // Import Link for navigation

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white ">
      <div className="px-2 flex justify-between items-center h-16">
        {/* Logo - Aligned Left */}
        <div className="text-2xl font-bold text-gray-800">Returnee</div>

        {/* Hamburger Button for Mobile */}
        <button
          className="block lg:hidden text-gray-800 focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-grow items-center justify-end space-x-6 text-gray-800">
          <Link href="/" className="hover:text-PrimaryColor">
            Home
          </Link>
          <Link href="/report-lost-item" className="hover:text-PrimaryColor">
            Report a lost item
          </Link>
          <Link href="/post-found-item" className="hover:text-PrimaryColor">
            Post a found item
          </Link>
          <Link href="/chat" className="hover:text-PrimaryColor">
            Chat
          </Link>
          <Link href="/account" className="ml-auto hover:text-PrimaryColor">
            Account
          </Link>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white lg:hidden shadow-md z-50">
            <div className="flex flex-col space-y-4 p-4 text-gray-800">
              <Link href="/" className="hover:text-PrimaryColor">
                Home
              </Link>
              <Link
                href="/report-lost-item"
                className="hover:text-PrimaryColor"
              >
                Report a lost item
              </Link>
              <Link href="/post-found-item" className="hover:text-PrimaryColor">
                Post a found item
              </Link>
              <Link href="/chat" className="hover:text-PrimaryColor">
                Chat
              </Link>
              <Link href="/account" className="hover:text-PrimaryColor">
                Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
