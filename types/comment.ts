import { User } from "./user";

export interface Comment {
  _id: string;
  content: string;
  issue: string;
  createdBy: User;
  mentions: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentDto {
  content: string;
  issue: string;
  mentions?: string[];
}

export interface UpdateCommentDto {
  content: string;
  mentions?: string[];
}

export interface PaginatedComments {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

