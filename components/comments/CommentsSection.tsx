"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { Comment } from "@/types/comment";
import { commentAPI, authAPI } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import type { User } from "@/types/user";

interface CommentsSectionProps {
  issueId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ issueId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await authAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await commentAPI.getComments(issueId, currentPage, limit);
      setComments(data.comments);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [issueId, currentPage]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreateComment = async (content: string, mentions: string[]) => {
    setIsSubmitting(true);
    try {
      const newComment = await commentAPI.createComment({
        content,
        issue: issueId,
        mentions: mentions.length > 0 ? mentions : undefined,
      });
      // Refresh comments to show the new one
      await fetchComments();
      // Reset to first page if we're not already there
      if (currentPage !== 1) {
        setCurrentPage(1);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((comment) => (comment._id === updatedComment._id ? updatedComment : comment))
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    // If we deleted the last comment on the page and it's not the first page, go to previous page
    if (comments.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      fetchComments();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Comments</h2>
          {total > 0 && (
            <span className="text-sm text-text-secondary">({total})</span>
          )}
        </div>

        {/* Comment Input */}
        <CommentInput onSubmit={handleCreateComment} isLoading={isSubmitting} users={users} />

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-error/20">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Comments List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-text-secondary">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                <div className="text-sm text-text-secondary">
                  Showing {comments.length > 0 ? (currentPage - 1) * limit + 1 : 0} to{" "}
                  {Math.min(currentPage * limit, total)} of {total} comments
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

