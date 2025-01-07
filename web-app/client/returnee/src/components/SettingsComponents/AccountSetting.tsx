"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { IdentificationIcon } from "@heroicons/react/24/outline";

const AccountSetting: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);

  // Handle Password and Email Updates
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      setImages([...images, ...acceptedFiles]);
    },
  });

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

      {/* Email Field */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Password Field */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium mb-2">New Password</label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* ID Card / Passport Image Upload */}
      <div className="mb-4 w-full">
        <label className="block text-sm font-medium mb-2">
          Id Verification
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <IdentificationIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-600">
              <span className="text-blue-500 font-medium">
                Select Id Card or Passport here
              </span>
            </p>
          </div>
        </div>
        {images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Uploaded Images:</h3>
            <ul className="grid grid-cols-2 gap-4">
              {images.map((file, index) => (
                <li key={index} className="relative group">
                  <div className="relative w-full h-32">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-gray-800 text-white rounded-full p-1 hover:bg-red-500 focus:outline-none"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Verify Button */}
        <div className="mt-4 flex justify-end">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none">
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSetting;
