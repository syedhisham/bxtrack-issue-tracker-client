"use client";

import React from "react";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { Issue } from "@/types/issue";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface IssueTableProps {
  issues: Issue[];
}

export const IssueTable: React.FC<IssueTableProps> = ({ issues }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Title</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Priority</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Assignee</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-primary">Created</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr
              key={issue._id}
              className="border-b border-border hover:bg-surface transition-colors cursor-pointer"
            >
              <td className="py-4 px-4">
                <Link href={`/issues/${issue._id}`} className="block">
                  <span className="font-medium text-text-primary hover:text-primary">
                    {issue.title}
                  </span>
                </Link>
              </td>
              <td className="py-4 px-4">
                <Badge variant="status" value={issue.status} />
              </td>
              <td className="py-4 px-4">
                <Badge variant="priority" value={issue.priority} />
              </td>
              <td className="py-4 px-4">
                {issue.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar src={issue.assignee.profileImage} name={issue.assignee.name} size="sm" />
                    <span className="text-sm text-text-primary">{issue.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-text-secondary">Unassigned</span>
                )}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-1 text-sm text-text-secondary">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(issue.createdAt)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
