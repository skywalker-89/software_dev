"use client"; // ✅ Required for client-side state

import React from "react";
import "./globals.css";
import { VisibleItemsProvider } from "../context/VisibleItemsContext"; // ✅ Import the context

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans">
        {" "}
        <VisibleItemsProvider>
          {" "}
          {/* ✅ Wrap the entire app */}
          {children}
        </VisibleItemsProvider>
      </body>
    </html>
  );
}
