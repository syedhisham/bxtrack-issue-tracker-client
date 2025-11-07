export type NotificationType =
  | "issue_created"
  | "issue_assigned"
  | "issue_updated"
  | "status_changed"
  | "priority_changed"
  | "comment_added"
  | "mentioned";

export interface Notification {
  _id: string;
  recipientId: string;
  title: string;
  description: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount: number;
}

