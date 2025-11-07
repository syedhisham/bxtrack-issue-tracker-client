"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { issueAPI } from "@/lib/api";
import { CreateIssueDto } from "@/types/issue";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IssueForm } from "@/components/issues/IssueForm";

export default function CreateIssuePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (data: CreateIssueDto) => {
    setIsLoading(true);
    setError("");
    try {
      const issue = await issueAPI.createIssue(data);
      router.push(`/issues/${issue._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create issue. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/issues">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Create New Issue</h1>
          <p className="text-sm text-text-secondary mt-1">Fill in the details to create a new issue</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-error/20">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}
        <IssueForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/issues")}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
