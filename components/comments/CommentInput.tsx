"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Send, Bold, Italic, Smile } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

interface CommentInputProps {
  onSubmit: (content: string, mentions: string[]) => Promise<void>;
  initialValue?: string;
  initialMentions?: string[];
  onCancel?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  users?: User[];
}

const EMOJI_LIST = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"];

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  initialValue = "",
  initialMentions = [],
  onCancel,
  isLoading = false,
  placeholder = "Add a comment...",
  users = [],
}) => {
  const [content, setContent] = useState(initialValue);
  const [mentions, setMentions] = useState<string[]>(initialMentions);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionPosition, setMentionPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const mentionPickerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const contentRef = useRef(content);
  const mentionPositionRef = useRef(0);

  // Only initialize from props once, or when explicitly editing (initialValue changes from empty to non-empty)
  useEffect(() => {
    if (!isInitializedRef.current) {
      setContent(initialValue);
      contentRef.current = initialValue;
      setMentions(initialMentions);
      isInitializedRef.current = true;
    } else if (initialValue && initialValue !== content && content === "") {
      // Only update if we're switching to edit mode (content is empty and initialValue is provided)
      setContent(initialValue);
      contentRef.current = initialValue;
      setMentions(initialMentions);
    }
  }, [initialValue, initialMentions]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    // Sync ref with state
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (mentionPickerRef.current && !mentionPickerRef.current.contains(event.target as Node)) {
        setShowMentionPicker(false);
      }
    };

    if (showEmojiPicker || showMentionPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker, showMentionPicker]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    await onSubmit(content.trim(), mentions);
    setContent("");
    setMentions([]);
    setShowEmojiPicker(false);
    setShowMentionPicker(false);
    isInitializedRef.current = false; // Reset so next time it initializes properly
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);

    setContent(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleBold = () => {
    insertText("**", "**");
  };

  const handleItalic = () => {
    insertText("*", "*");
  };

  const handleEmojiClick = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = content.substring(0, start) + emoji + content.substring(start);
    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleMentionSelect = useCallback((user: User) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const currentContent = contentRef.current;
    const currentMentionPos = mentionPositionRef.current;
    const beforeAt = currentContent.substring(0, currentMentionPos);
    const afterCursor = currentContent.substring(textarea.selectionStart);
    // Insert only @Name in the textarea (clean display)
    const mentionText = `@${user.name}`;
    
    const newContent = beforeAt + mentionText + " " + afterCursor;
    setContent(newContent);
    contentRef.current = newContent;
    
    // Add to mentions array for backend (this is what matters for tracking mentions)
    setMentions((prev) => {
      if (!prev.includes(user._id)) {
        return [...prev, user._id];
      }
      return prev;
    });
    
    setShowMentionPicker(false);
    setMentionQuery("");
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = currentMentionPos + mentionText.length + 1;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    // Always update content first and ref
    setContent(value);
    contentRef.current = value;

    // Then check for "@" mention trigger only if users are available
    if (users.length > 0) {
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");
      
      if (lastAtIndex !== -1) {
        // Check if there's a space, newline, or closing bracket after @ (meaning mention is complete)
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
        const hasSpaceOrNewlineOrBracket = /[\s\n\]]/.test(textAfterAt);
        
        // Also check if we're inside an existing mention pattern @[...]
        const textBeforeAt = textBeforeCursor.substring(0, lastAtIndex);
        const isInsideMention = textBeforeAt.includes("@[") && !textBeforeAt.substring(textBeforeAt.lastIndexOf("@[")).includes("]");
        
        if (!hasSpaceOrNewlineOrBracket && !isInsideMention && textAfterAt.length < 50) {
          // Show mention picker
          const query = textAfterAt.toLowerCase();
          setMentionQuery(query);
          setMentionPosition(lastAtIndex);
          mentionPositionRef.current = lastAtIndex;
          setShowMentionPicker(true);
        } else {
          setShowMentionPicker(false);
        }
      } else {
        setShowMentionPicker(false);
      }
    } else {
      setShowMentionPicker(false);
    }
  };

  // Memoize filtered users to prevent unnecessary recalculations and rerenders
  const filteredUsers = useMemo(() => {
    if (!mentionQuery) return users.slice(0, 10); // Limit to 10 users when no query
    const query = mentionQuery.toLowerCase();
    return users
      .filter((user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
      .slice(0, 10); // Limit results to 10
  }, [users, mentionQuery]);

  // Memoize user list items to prevent Avatar rerenders
  const userListItems = useMemo(() => {
    return filteredUsers.map((user) => (
      <button
        key={user._id}
        type="button"
        onClick={() => handleMentionSelect(user)}
        className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-surface transition-colors"
      >
        <Avatar src={user.profileImage} name={user.name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
          <p className="text-xs text-text-secondary truncate">{user.email}</p>
        </div>
      </button>
    ));
  }, [filteredUsers, handleMentionSelect]);

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
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
        <span>@${name.trim()}</span>
      </span>`;
    });
    // Then handle new format @Name (plain mentions without brackets)
    // Match @ followed by name (starts with letter, can contain letters, numbers, spaces)
    // Stop at: space+lowercase (new word), punctuation, end, newline, or another @
    result = result.replace(/@([A-Za-z][A-Za-z0-9]+(?:\s+[A-Z][A-Za-z0-9]*)*)(?=\s+[a-z]|[.,!?;:]|$|\n|@)/g, (match, name) => {
      const trimmedName = name.trim();
      if (trimmedName) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <div className="flex items-start gap-2 p-3 border border-border rounded-lg bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={(e) => {
              if (showMentionPicker) {
                if (e.key === "Escape") {
                  e.preventDefault();
                  setShowMentionPicker(false);
                } else if (e.key === "Enter" && filteredUsers.length > 0) {
                  // Only prevent default if we want to select first user
                  // For now, let Enter work normally
                }
                // Could add keyboard navigation here
              }
            }}
            placeholder={placeholder}
            rows={3}
            className="flex-1 resize-none border-none outline-none text-sm text-text-primary placeholder:text-text-secondary bg-transparent"
            disabled={isLoading}
          />
        </div>

        {/* Mention Picker */}
        {showMentionPicker && users.length > 0 && (
          <div
            ref={mentionPickerRef}
            className="absolute bottom-full left-0 mb-2 w-64 max-h-48 bg-white border border-border rounded-lg shadow-xl overflow-y-auto z-50 pointer-events-auto"
            style={{ marginBottom: "8px" }}
          >
            {filteredUsers.length > 0 ? (
              userListItems
            ) : (
              <div className="px-3 py-2 text-sm text-text-secondary">No users found</div>
            )}
          </div>
        )}

        {/* Formatting toolbar */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleBold}
              disabled={isLoading}
              className="p-1.5 rounded hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleItalic}
              disabled={isLoading}
              className="p-1.5 rounded hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={isLoading}
                className="p-1.5 rounded hover:bg-surface transition-colors text-text-secondary hover:text-text-primary"
                title="Emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 w-64 h-48 bg-white border border-border rounded-lg shadow-xl p-3 overflow-y-auto z-50">
                  <div className="grid grid-cols-8 gap-1">
                    {EMOJI_LIST.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className="p-1 text-lg hover:bg-surface rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-xs text-text-secondary ml-2">
              Use <strong>**bold**</strong>, <em>*italic*</em>, and <strong>@</strong> to mention users
            </span>
          </div>
        </div>

        {/* Preview */}
        {content && (
          <div className="mt-2 p-2 bg-surface rounded text-sm text-text-primary border border-border">
            <div dangerouslySetInnerHTML={renderContent(content)} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" size="sm" isLoading={isLoading} disabled={!content.trim()}>
          <Send className="h-4 w-4 mr-1" />
          {initialValue ? "Update" : "Comment"}
        </Button>
      </div>
    </form>
  );
};

