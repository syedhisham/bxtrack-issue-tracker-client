"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Sync cookie from localStorage for middleware (if token exists but cookie doesn't)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      
      if (token) {
        // Check if cookie exists
        const cookies = document.cookie.split(";");
        const hasTokenCookie = cookies.some((cookie) => cookie.trim().startsWith("token="));
        
        if (!hasTokenCookie) {
          // Set cookie for middleware to read
          const isSecure = window.location.protocol === "https:";
          const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
          document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? "; Secure" : ""}`;
        }
      }
    }
    
    checkAuth();
    if (!isAuthenticated && typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/sign-in");
      }
    }
  }, [isAuthenticated, checkAuth, router]);

  // Close sidebar on desktop by default, handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isAuthenticated) {
    return null; // Will redirect via middleware
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};
