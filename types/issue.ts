// Issue type definitions matching backend

export enum Priority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export enum Status {
  OPEN = "Open",
  IN_PROGRESS = "In Progress",
  RESOLVED = "Resolved",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Issue {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee: User | null;
  createdBy: User | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIssueDto {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  assignee?: string | null;
}

export interface UpdateIssueDto {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: Status;
  assignee?: string | null;
}

export interface IssueFilters {
  status?: Status;
  priority?: Priority;
  assignee?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedIssues {
  issues: Issue[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IssueSummary {
  total: number;
  byStatus: {
    [key in Status]: number;
  };
  byPriority: {
    [key in Priority]: number;
  };
  byAssignee: Array<{
    assigneeId: string | null;
    assigneeName: string | null;
    profileImage: string | null;
    email: string | null;
    count: number;
  }>;
  assigneePagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

