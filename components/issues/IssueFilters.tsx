"use client";

import React from "react";
import { X } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Priority, Status, IssueFilters as IssueFiltersType } from "@/types/issue";

interface IssueFiltersProps {
  filters: IssueFiltersType;
  onFilterChange: (filters: IssueFiltersType) => void;
}

export const IssueFilters: React.FC<IssueFiltersProps> = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: Status.OPEN, label: Status.OPEN },
    { value: Status.IN_PROGRESS, label: Status.IN_PROGRESS },
    { value: Status.RESOLVED, label: Status.RESOLVED },
  ];

  const priorityOptions = [
    { value: "", label: "All Priority" },
    { value: Priority.LOW, label: Priority.LOW },
    { value: Priority.MEDIUM, label: Priority.MEDIUM },
    { value: Priority.HIGH, label: Priority.HIGH },
  ];

  const hasActiveFilters = filters.status || filters.priority || filters.assignee;

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value ? (value as Status) : undefined,
    });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({
      ...filters,
      priority: value ? (value as Priority) : undefined,
    });
  };

  const handleAssigneeChange = (value: string) => {
    onFilterChange({
      ...filters,
      assignee: value || undefined,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="flex flex-wrap items-end gap-4 mb-6">
      <div className="flex-1 min-w-[150px]">
        <Select
          label="Status"
          options={statusOptions}
          value={filters.status || ""}
          onChange={(e) => handleStatusChange(e.target.value)}
        />
      </div>
      <div className="flex-1 min-w-[150px]">
        <Select
          label="Priority"
          options={priorityOptions}
          value={filters.priority || ""}
          onChange={(e) => handlePriorityChange(e.target.value)}
        />
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" size="md" onClick={clearFilters} className="mb-0">
          <X className="h-4 w-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};
