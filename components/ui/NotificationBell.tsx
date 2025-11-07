"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { cn, formatDateTime } from "@/lib/utils";
import { notificationAPI } from "@/lib/api";
import type { Notification } from "@/types/notification";

interface NotificationBellProps {
  className?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Fetch unread count on mount and periodically
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await notificationAPI.getNotifications(1, 5); // Fetch latest 5 notifications
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationAPI.getNotifications(1, 1); // Just to get unread count
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    router.push("/notifications");
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      try {
        await notificationAPI.markAsRead(notification._id);
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    if (notification.link) {
      setIsOpen(false);
      router.push(notification.link);
    }
  };

  // Map backend notification type to frontend display type
  const getDisplayType = (type: string): "mention" | "assignment" | "comment" | "update" => {
    if (type === "mentioned") return "mention";
    if (type === "issue_assigned") return "assignment";
    if (type === "comment_added") return "comment";
    return "update";
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-text-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-error rounded-full flex items-center justify-center">
            <span className="text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-border z-50 max-h-[500px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Close notifications"
              >
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-text-secondary mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="h-12 w-12 text-text-secondary mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-text-secondary">No notifications yet</p>
                </div>
              ) : (
                <div className="py-2">
                  {notifications.map((notification) => (
                    <button
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-surface transition-colors border-b border-border last:border-b-0",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-text-secondary line-clamp-2 mb-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSeeAll}
                  className="w-full"
                >
                  See all notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

