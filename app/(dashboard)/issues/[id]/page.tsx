"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { issueAPI } from "@/lib/api";
import { Issue } from "@/types/issue";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Card } from "@/components/ui/Card";
import { IssueDetail } from "@/components/issues/IssueDetail";

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchIssue(params.id as string);
    }
  }, [params.id]);

  const fetchIssue = async (id: string) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await issueAPI.getIssueById(id);
      setIssue(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (updatedIssue: Issue) => {
    setIssue(updatedIssue);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/issues">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Issues
          </Button>
        </Link>
      </div>

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
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => fetchIssue(params.id as string)}>
                Try Again
              </Button>
              <Link href="/issues">
                <Button variant="primary">Back to Issues</Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : issue ? (
        <IssueDetail issue={issue} onUpdate={handleUpdate} />
      ) : null}
    </div>
  );
}
