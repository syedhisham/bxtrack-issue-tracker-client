"use client";

import { useState, useEffect } from "react";
import { Plus, User } from "lucide-react";
import Link from "next/link";
import { issueAPI } from "@/lib/api";
import { Issue, IssueFilters as IssueFiltersType } from "@/types/issue";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { IssueFilters } from "@/components/issues/IssueFilters";
import { IssueTable } from "@/components/issues/IssueTable";
import { IssueCard } from "@/components/issues/IssueCard";

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Omit<IssueFiltersType, "assignee">>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchIssues();
  }, [filters, currentPage]);

  const fetchIssues = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await issueAPI.getMyIssues({
        ...filters,
        page: currentPage,
        limit: 10,
      });
      setIssues(data.issues);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch your issues. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters: IssueFiltersType) => {
    // Remove assignee from filters as this page only shows user's issues
    const { assignee, ...restFilters } = newFilters;
    setFilters(restFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Issues</h1>
          <p className="text-sm text-text-secondary mt-1">
            View and manage all issues assigned to you
          </p>
        </div>
        <Link href="/issues/new">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4 mr-2" />
            Create Issue
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <IssueFilters filters={filters} onFilterChange={handleFilterChange} />
      </Card>

      {/* Content */}
      {isLoading ? (
        <Card>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      ) : error ? (
        <Card>
          <div className="p-6 text-center">
            <p className="text-error mb-4">{error}</p>
            <Button variant="outline" onClick={fetchIssues}>
              Try Again
            </Button>
          </div>
        </Card>
      ) : issues.length === 0 ? (
        <Card>
          <EmptyState
            icon={User}
            title="No issues assigned to you"
            description={
              Object.keys(filters).length > 0
                ? "Try adjusting your filters to see more issues."
                : "You don't have any issues assigned to you yet."
            }
            action={
              <Link href="/issues/new">
                <Button variant="primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Issue
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          {/* Desktop: Table view */}
          <Card className="hidden lg:block">
            <IssueTable issues={issues} />
          </Card>

          {/* Mobile: Card view */}
          <div className="lg:hidden space-y-4">
            {issues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                <div className="text-sm text-text-secondary">
                  Showing {issues.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{" "}
                  {Math.min(currentPage * 10, total)} of {total} issues
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

