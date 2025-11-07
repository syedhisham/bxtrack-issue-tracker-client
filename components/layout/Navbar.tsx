"use client";

import React, { useState } from "react";
import { Menu, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/sign-in";
  };

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6 text-text-primary" />
        </button>

        {/* Center: Logo/Title (hidden on mobile, shown on desktop) */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold text-text-primary">Issue Tracker</h1>
        </div>

        {/* Right: User menu */}
        {user && (
          <div className="flex items-center gap-2 ml-auto">
            {/* Notification Bell */}
            <NotificationBell />

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface transition-colors"
              >
                <Avatar src={user.profileImage} name={user.name} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-text-primary">
                  {user.name}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-text-secondary transition-transform",
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-20">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">{user.name}</p>
                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-surface transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
