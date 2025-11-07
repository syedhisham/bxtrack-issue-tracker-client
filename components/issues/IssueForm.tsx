"use client";

import React, { useState, useEffect } from "react";
import { Priority, Status, CreateIssueDto } from "@/types/issue";
import { User } from "@/types/user";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { UserSelect } from "@/components/ui/UserSelect";
import { Card } from "@/components/ui/Card";

interface IssueFormProps {
  initialData?: Partial<CreateIssueDto>;
  onSubmit: (data: CreateIssueDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export const IssueForm: React.FC<IssueFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Create Issue",
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState<Priority>(initialData?.priority || Priority.MEDIUM);
  const [status, setStatus] = useState<Status>(initialData?.status || Status.OPEN);
  const [assignee, setAssignee] = useState<string | null>(initialData?.assignee || null);
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await authAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignee: assignee || null,
    });
  };

  const priorityOptions = [
    { value: Priority.LOW, label: Priority.LOW },
    { value: Priority.MEDIUM, label: Priority.MEDIUM },
    { value: Priority.HIGH, label: Priority.HIGH },
  ];

  const statusOptions = [
    { value: Status.OPEN, label: Status.OPEN },
    { value: Status.IN_PROGRESS, label: Status.IN_PROGRESS },
    { value: Status.RESOLVED, label: Status.RESOLVED },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        placeholder="Enter issue title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors({ ...errors, title: "" });
        }}
        error={errors.title}
        disabled={isLoading}
        required
      />

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Description</label>
        <textarea
          placeholder="Enter issue description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description) setErrors({ ...errors, description: "" });
          }}
          rows={6}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 resize-none ${
            errors.description
              ? "border-error focus:ring-error"
              : "border-border hover:border-primary"
          }`}
          disabled={isLoading}
          required
        />
        {errors.description && <p className="mt-1 text-sm text-error">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          disabled={isLoading}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          disabled={isLoading}
        />
      </div>

      <UserSelect
        label="Assignee"
        users={users}
        value={assignee}
        onChange={setAssignee}
        placeholder="Select an assignee"
        disabled={isLoading || isLoadingUsers}
      />

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
