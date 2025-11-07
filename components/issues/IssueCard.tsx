"use client";

import React from "react";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { Issue } from "@/types/issue";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <Link href={`/issues/${issue._id}`}>
      <Card hover className="cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary line-clamp-2 flex-1">{issue.title}</h3>
          <div className="flex gap-2 ml-2">
            <Badge variant="status" value={issue.status} />
            <Badge variant="priority" value={issue.priority} />
          </div>
        </div>

        <p className="text-sm text-text-secondary line-clamp-2 mb-4">{issue.description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2 sm:gap-4">
            {issue.assignee ? (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-text-secondary" />
                <Avatar src={issue.assignee.profileImage} name={issue.assignee.name} size="sm" />
                <span className="text-sm text-text-secondary truncate">{issue.assignee.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">Unassigned</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(issue.createdAt)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
