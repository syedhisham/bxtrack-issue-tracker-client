import React from "react";
import { cn } from "@/lib/utils";
import { Priority, Status } from "@/types/issue";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "priority" | "status" | "default";
  value: Priority | Status | string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "default", value, className, ...props }) => {
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return "bg-red-100 text-red-800 border-red-200";
      case Priority.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case Priority.LOW:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.OPEN:
        return "bg-primary text-text-primary border-primary";
      case Status.IN_PROGRESS:
        return "bg-secondary text-text-primary border-secondary";
      case Status.RESOLVED:
        return "bg-surface text-text-primary border-surface";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getColorClass = () => {
    if (variant === "priority") {
      return getPriorityColor(value as Priority);
    }
    if (variant === "status") {
      return getStatusColor(value as Status);
    }
    return "bg-surface text-text-primary border-primary";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getColorClass(),
        className
      )}
      {...props}
    >
      {value}
    </span>
  );
};
