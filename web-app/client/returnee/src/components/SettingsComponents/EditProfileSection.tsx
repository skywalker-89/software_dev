"use client";
import React, { useState } from "react";
import Image from "next/image";

const EditProfileSection: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Edit Profile Picture</h1>
      <label htmlFor="file-input" className="cursor-pointer">
        {/* Profile Picture Preview */}
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border">
          {preview ? (
            <div className="w-full h-full relative">
              <Image
                src={preview}
                alt="Profile Preview"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          ) : (
            <span className="text-gray-400">Edit</span>
          )}
        </div>
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default EditProfileSection;
