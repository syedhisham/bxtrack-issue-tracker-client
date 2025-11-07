"use client";

import React, { useState, useEffect } from "react";
import { Edit2, Trash2, MoreVertical } from "lucide-react";
import { Comment } from "@/types/comment";
import { Avatar } from "@/components/ui/Avatar";
import { formatDateTime } from "@/lib/utils";
import { CommentInput } from "./CommentInput";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { commentAPI, authAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

interface CommentItemProps {
  comment: Comment;
  onUpdate: (updatedComment: Comment) => void;
  onDelete: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuthStore();
  const isOwner = user?._id === comment.createdBy._id;

  useEffect(() => {
    if (isEditing) {
      fetchUsers();
    }
  }, [isEditing]);

  const fetchUsers = async () => {
    try {
      const data = await authAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const renderContent = (text: string) => {
    // Parse markdown-like syntax for bold and italic, and mentions
    let result = text;
    
    // Escape HTML to prevent XSS
    result = result
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    // Parse mentions: @[profileImage]Name (old format) or @Name (new format)
    // First handle old format @[profileImage]Name
    result = result.replace(/@\[([^\]]*)\]([^\s\n@]+(?:\s+[^\s\n@]+)*)/g, (match, profileImage, name) => {
      const trimmedName = name.trim();
      // Display only @Name without the profile image in the text
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
        <span>@${trimmedName}</span>
      </span>`;
    });
    // Then handle new format @Name (plain mentions without brackets)
    // Match @ followed by name (starts with letter, can contain letters, numbers, spaces)
    // Stop at: space+lowercase (new word), punctuation, end, newline, or another @
    result = result.replace(/@([A-Za-z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]*)*)(?=\s+[a-z]|[.,!?;:]|$|\n|@)/g, (match, name) => {
      const trimmedName = name.trim();
      if (trimmedName) {
        // Check if this user is in the mentions array
        const mentionedUser = comment.mentions.find((u) => u.name === trimmedName);
        return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
          <span>@${trimmedName}</span>
        </span>`;
      }
      return match;
    });
    
    // Bold: **text** (process first to avoid conflicts)
    result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Italic: *text* (single asterisks not part of double asterisks)
    // Match single * that are not preceded or followed by another *
    result = result.replace(/([^*]|^)\*([^*]+?)\*([^*]|$)/g, '$1<em class="italic">$2</em>$3');
    
    return { __html: result };
  };

  const handleUpdate = async (content: string, mentions: string[]) => {
    try {
      const updatedComment = await commentAPI.updateComment(comment._id, { content, mentions });
      onUpdate(updatedComment);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setIsDeleting(true);
    try {
      await commentAPI.deleteComment(comment._id);
      onDelete(comment._id);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-surface rounded-lg border border-border">
        <CommentInput
          initialValue={comment.content}
          initialMentions={comment.mentions.map((u) => u._id)}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          placeholder="Edit your comment..."
          users={users}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-3 p-4 bg-white rounded-lg border border-border hover:border-primary/50 transition-colors">
      <Avatar src={comment.createdBy.profileImage} name={comment.createdBy.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-text-primary">{comment.createdBy.name}</p>
              <span className="text-xs text-text-secondary">
                {formatDateTime(comment.createdAt)}
                {new Date(comment.updatedAt).getTime() !== new Date(comment.createdAt).getTime() && " (edited)"}
              </span>
            </div>
          </div>
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
                disabled={isDeleting}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 w-32 bg-white border border-border rounded-lg shadow-xl z-20">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-surface transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full px-3 py-2 text-left text-sm text-error hover:bg-surface transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div
          className="text-sm text-text-primary whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={renderContent(comment.content)}
        />
        {/* Mentions */}
        {comment.mentions && comment.mentions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-secondary">Mentioned:</span>
              {comment.mentions.map((mentionedUser) => (
                <div
                  key={mentionedUser._id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary text-text-primary text-xs"
                >
                  <Avatar src={mentionedUser.profileImage} name={mentionedUser.name} size="sm" />
                  <span className="font-medium">{mentionedUser.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

