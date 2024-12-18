"use client";

import React, { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md relative">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
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
        <div className="hidden lg:flex space-x-6 text-gray-800">
          <a href="#" className="hover:text-PrimaryColor">
            Home
          </a>
          <a href="#" className="hover:text-PrimaryColor">
            About
          </a>
          <a href="#" className="hover:text-PrimaryColor">
            Services
          </a>
          <a href="#" className="hover:text-PrimaryColor">
            Contact
          </a>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white lg:hidden shadow-md z-50">
            <div className="flex flex-col space-y-4 p-4 text-gray-800">
              <a href="#" className="hover:text-PrimaryColor">
                Home
              </a>
              <a href="#" className="hover:text-PrimaryColor">
                About
              </a>
              <a href="#" className="hover:text-PrimaryColor">
                Services
              </a>
              <a href="#" className="hover:text-PrimaryColor">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
