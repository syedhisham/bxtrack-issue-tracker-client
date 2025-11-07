"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList, Plus, X, LogOut, AtSign, ChartColumnBig } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: "Summary", href: "/issues/summary", icon: ChartColumnBig },
    { name: "Issues", href: "/issues", icon: LayoutList },
    { name: "My Issues", href: "/issues/my-issues", icon: AtSign },
    { name: "Create Issue", href: "/issues/new", icon: Plus },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/sign-in";
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">Issue Tracker</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-surface transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-text-primary" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              // For "Issues", only match exact path or issue detail pages, not create/new pages
              let isActive = false;
              if (item.href === "/issues") {
                // Active for /issues or /issues/[id], but not /issues/new or /issues/my-issues or /issues/summary
                isActive =
                  pathname === "/issues" ||
                  (pathname.startsWith("/issues/") &&
                    !pathname.startsWith("/issues/new") &&
                    !pathname.startsWith("/issues/my-issues") &&
                    !pathname.startsWith("/issues/summary") &&
                    !!pathname.match(/^\/issues\/[^/]+$/)); // Only match /issues/[id] format
              } else if (item.href === "/issues/my-issues") {
                // Active for /issues/my-issues
                isActive = pathname === "/issues/my-issues";
              } else if (item.href === "/issues/summary") {
                // Active for /issues/summary
                isActive = pathname === "/issues/summary";
              } else {
                // For other routes, use standard matching
                isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile when navigating
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-150",
                    isActive
                      ? "bg-secondary text-text-primary font-medium"
                      : "text-text-secondary hover:bg-surface hover:text-text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          {user && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
                <Avatar src={user.profileImage} name={user.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                  <p className="text-xs text-text-secondary truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
