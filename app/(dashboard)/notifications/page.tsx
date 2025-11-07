"use client";

import React, { useState, useEffect } from "react";
import { Bell, MessageSquare, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { notificationAPI } from "@/lib/api";
import type { Notification } from "@/types/notification";
import { cn } from "@/lib/utils";

// Map backend notification type to frontend display type
const getDisplayType = (type: string): "mention" | "assignment" | "comment" | "update" => {
  if (type === "mentioned") return "mention";
  if (type === "issue_assigned") return "assignment";
  if (type === "comment_added") return "comment";
  return "update";
};

const getNotificationIcon = (type?: string) => {
  const displayType = type ? getDisplayType(type) : undefined;
  switch (displayType) {
    case "mention":
      return <UserPlus className="h-5 w-5 text-primary" />;
    case "assignment":
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case "comment":
      return <MessageSquare className="h-5 w-5 text-primary" />;
    case "update":
      return <AlertCircle className="h-5 w-5 text-text-secondary" />;
    default:
      return <Bell className="h-5 w-5 text-text-secondary" />;
  }
};

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border border-border transition-all duration-150 hover:shadow-md hover:border-primary",
        !notification.read && "bg-primary/5 border-primary/30"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="rounded-full bg-surface p-2">{getNotificationIcon(notification.type)}</div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-text-primary truncate">
                {notification.title}
              </h4>
              {!notification.read && (
                <span className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
              )}
            </div>
            {notification.type && (
              <Badge
                variant="default"
                value={getDisplayType(notification.type).charAt(0).toUpperCase() + getDisplayType(notification.type).slice(1)}
              />
            )}
          </div>
          <p className="text-sm text-text-secondary mb-2 line-clamp-2">{notification.description}</p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-secondary">{formatDateTime(notification.createdAt)}</p>
            {notification.read && (
              <span className="text-xs text-text-secondary">Read</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await notificationAPI.getNotifications(currentPage, itemsPerPage);
      setNotifications(data.notifications);
      setTotalPages(data.totalPages);
      setTotal(data.total);
      setUnreadCount(data.unreadCount);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.read) {
      await handleMarkAsRead(notification._id);
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="text-sm text-text-secondary mt-1">
            Stay updated with all your activity and mentions
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </span>
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="p-6 text-center">
            <p className="text-error mb-4">{error}</p>
            <button
              onClick={fetchNotifications}
              className="px-4 py-2 bg-primary text-text-primary rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="You'll see notifications here when someone mentions you, assigns you to an issue, or comments on your issues."
          />
        </Card>
      ) : (
        <>
          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                <div className="text-sm text-text-secondary">
                  Showing {notifications.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                  {Math.min(currentPage * itemsPerPage, total)} of {total} notifications
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

