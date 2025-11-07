"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";
import type { User } from "@/types/user";

interface UserSelectProps {
  label?: string;
  error?: string;
  users: User[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const UserSelect: React.FC<UserSelectProps> = ({
  label,
  error,
  users,
  value,
  onChange,
  placeholder = "Select an assignee",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedUser = value ? users.find((u) => u._id === value) : null;

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

  const handleSelect = (userId: string | null) => {
    onChange(userId);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>
      )}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 bg-white text-left flex items-center justify-between",
            error
              ? "border-error focus:ring-error"
              : "border-border hover:border-primary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedUser ? (
              <>
                <Avatar src={selectedUser.profileImage} name={selectedUser.name} size="sm" />
                <span className="text-text-primary truncate">{selectedUser.name}</span>
              </>
            ) : (
              <span className="text-text-secondary">{placeholder}</span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-text-secondary flex-shrink-0 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 pb-2 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
            {/* Unassigned option */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={cn(
                "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-surface transition-colors",
                !selectedUser && "bg-surface"
              )}
            >
              <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-text-secondary">—</span>
              </div>
              <span className="text-text-primary">Unassigned</span>
            </button>

            {/* User options */}
            {users.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => handleSelect(user._id)}
                className={cn(
                  "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-surface transition-colors",
                  selectedUser?._id === user._id && "bg-surface"
                )}
              >
                <Avatar src={user.profileImage} name={user.name} size="sm" />
                <span className="text-text-primary truncate">{user.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};

