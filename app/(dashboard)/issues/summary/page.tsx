"use client";

import { useState, useEffect, useCallback } from "react";
import { ChartColumnBig, Users, AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { issueAPI } from "@/lib/api";
import { IssueSummary, Status, Priority } from "@/types/issue";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";

export default function SummaryPage() {
  const [summary, setSummary] = useState<IssueSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [assigneePage, setAssigneePage] = useState(1);
  const assigneeLimit = 5;

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await issueAPI.getIssueSummary(assigneePage, assigneeLimit);
      setSummary(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [assigneePage, assigneeLimit]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleAssigneePageChange = (page: number) => {
    setAssigneePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case Status.OPEN:
        return <AlertCircle className="h-5 w-5" />;
      case Status.IN_PROGRESS:
        return <Clock className="h-5 w-5" />;
      case Status.RESOLVED:
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    return <TrendingUp className="h-5 w-5" />;
  };

  const calculatePercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Summary</h1>
            <p className="text-sm text-text-secondary mt-1">
              Overview of all issues and their distribution
            </p>
          </div>
        </div>
        <Card>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Summary</h1>
            <p className="text-sm text-text-secondary mt-1">
              Overview of all issues and their distribution
            </p>
          </div>
        </div>
        <Card>
          <div className="p-6 text-center">
            <p className="text-error mb-4">{error}</p>
            <Button variant="outline" onClick={fetchSummary}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Summary</h1>
          <p className="text-sm text-text-secondary mt-1">
            Overview of all issues and their distribution
          </p>
        </div>
      </div>

      {/* Total Issues Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary mb-1">Total Issues</p>
            <p className="text-3xl font-bold text-text-primary">{summary.total}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
            <ChartColumnBig className="h-8 w-8 text-text-primary" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Status Breakdown</h2>
              <p className="text-xs text-text-secondary">Distribution by status</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(summary.byStatus).map(([status, count]) => {
              const percentage = calculatePercentage(count, summary.total);
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status as Status)}
                      <span className="text-sm font-medium text-text-primary">{status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">{count}</span>
                      <span className="text-xs text-text-secondary">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Priority Breakdown</h2>
              <p className="text-xs text-text-secondary">Distribution by priority</p>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(summary.byPriority).map(([priority, count]) => {
              const percentage = calculatePercentage(count, summary.total);
              return (
                <div key={priority} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(priority as Priority)}
                      <Badge variant="priority" value={priority as Priority} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">{count}</span>
                      <span className="text-xs text-text-secondary">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Assignee Breakdown */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center">
            <Users className="h-5 w-5 text-text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Assignee Breakdown</h2>
            <p className="text-xs text-text-secondary">Issues assigned to team members</p>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          {summary.byAssignee.map((item, index) => {
            const percentage = calculatePercentage(item.count, summary.total);
            return (
              <div
                key={item.assigneeId || `unassigned-${index}`}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface hover:bg-secondary/50 transition-colors"
              >
                <Avatar
                  src={item.profileImage || undefined}
                  name={item.assigneeName || "Unassigned"}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {item.assigneeName || "Unassigned"}
                  </p>
                  {item.email && (
                    <p className="text-xs text-text-secondary truncate">{item.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">{item.count}</p>
                    <p className="text-xs text-text-secondary">{percentage}%</p>
                  </div>
                  <div className="w-24 bg-white rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {summary.assigneePagination && summary.assigneePagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div className="text-sm text-text-secondary">
              Showing{" "}
              {summary.byAssignee.length > 0
                ? (summary.assigneePagination.page - 1) * summary.assigneePagination.limit + 1
                : 0}{" "}
              to{" "}
              {Math.min(
                summary.assigneePagination.page * summary.assigneePagination.limit,
                summary.assigneePagination.total
              )}{" "}
              of {summary.assigneePagination.total} assignees
            </div>
            <Pagination
              currentPage={summary.assigneePagination.page}
              totalPages={summary.assigneePagination.totalPages}
              onPageChange={handleAssigneePageChange}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

