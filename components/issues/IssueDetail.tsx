"use client";

import React, { useState, useEffect } from "react";
import { Calendar, User, Edit2 } from "lucide-react";
import { Issue, UpdateIssueDto, Priority, Status } from "@/types/issue";
import { User as UserType } from "@/types/user";
import { authAPI, issueAPI } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Select } from "@/components/ui/Select";
import { UserSelect } from "@/components/ui/UserSelect";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";

interface IssueDetailProps {
  issue: Issue;
  onUpdate: (updatedIssue: Issue) => void;
}

export const IssueDetail: React.FC<IssueDetailProps> = ({ issue, onUpdate }) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  const [status, setStatus] = useState<Status>(issue.status);
  const [priority, setPriority] = useState<Priority>(issue.priority);
  const [assignee, setAssignee] = useState<string | null>(issue.assignee?._id || null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sync state when issue prop changes
  useEffect(() => {
    setStatus(issue.status);
    setPriority(issue.priority);
    setAssignee(issue.assignee?._id || null);
  }, [issue]);

  const fetchUsers = async () => {
    try {
      const data = await authAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleStatusUpdate = async () => {
    if (status === issue.status) {
      setIsEditingStatus(false);
      return;
    }

    setIsUpdating(true);
    try {
      const updatedIssue = await issueAPI.updateIssue(issue._id, { status });
      onUpdate(updatedIssue);
      setIsEditingStatus(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      setStatus(issue.status); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityUpdate = async () => {
    if (priority === issue.priority) {
      setIsEditingPriority(false);
      return;
    }

    setIsUpdating(true);
    try {
      const updatedIssue = await issueAPI.updateIssue(issue._id, { priority });
      onUpdate(updatedIssue);
      setIsEditingPriority(false);
    } catch (error) {
      console.error("Failed to update priority:", error);
      setPriority(issue.priority); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssigneeUpdate = async () => {
    const currentAssigneeId = issue.assignee?._id || null;
    if (assignee === currentAssigneeId) {
      setIsEditingAssignee(false);
      return;
    }

    setIsUpdating(true);
    try {
      const updatedIssue = await issueAPI.updateIssue(issue._id, { assignee });
      onUpdate(updatedIssue);
      setIsEditingAssignee(false);
    } catch (error) {
      console.error("Failed to update assignee:", error);
      setAssignee(currentAssigneeId); // Revert on error
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions = [
    { value: Status.OPEN, label: Status.OPEN },
    { value: Status.IN_PROGRESS, label: Status.IN_PROGRESS },
    { value: Status.RESOLVED, label: Status.RESOLVED },
  ];

  const priorityOptions = [
    { value: Priority.LOW, label: Priority.LOW },
    { value: Priority.MEDIUM, label: Priority.MEDIUM },
    { value: Priority.HIGH, label: Priority.HIGH },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{issue.title}</h1>
          <div className="flex gap-2 flex-shrink-0">
            <Badge variant="status" value={issue.status} />
            <Badge variant="priority" value={issue.priority} />
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <h2 className="text-lg font-semibold text-text-primary mb-3">Description</h2>
        <p className="text-text-secondary whitespace-pre-wrap">{issue.description}</p>
      </Card>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Status</h3>
            {!isEditingStatus && (
              <button
                onClick={() => setIsEditingStatus(true)}
                className="p-1 rounded hover:bg-surface transition-colors"
                disabled={isUpdating}
              >
                <Edit2 className="h-4 w-4 text-text-secondary" />
              </button>
            )}
          </div>
          {isEditingStatus ? (
            <div className="space-y-3">
              <Select
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                disabled={isUpdating}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleStatusUpdate}
                  isLoading={isUpdating}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setStatus(issue.status);
                    setIsEditingStatus(false);
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Badge variant="status" value={issue.status} />
          )}
        </Card>

        {/* Priority */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Priority</h3>
            {!isEditingPriority && (
              <button
                onClick={() => setIsEditingPriority(true)}
                className="p-1 rounded hover:bg-surface transition-colors"
                disabled={isUpdating}
              >
                <Edit2 className="h-4 w-4 text-text-secondary" />
              </button>
            )}
          </div>
          {isEditingPriority ? (
            <div className="space-y-3">
              <Select
                options={priorityOptions}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                disabled={isUpdating}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handlePriorityUpdate}
                  isLoading={isUpdating}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPriority(issue.priority);
                    setIsEditingPriority(false);
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Badge variant="priority" value={issue.priority} />
          )}
        </Card>

        {/* Assignee */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Assignee</h3>
            {!isEditingAssignee && (
              <button
                onClick={() => setIsEditingAssignee(true)}
                className="p-1 rounded hover:bg-surface transition-colors"
                disabled={isUpdating}
              >
                <Edit2 className="h-4 w-4 text-text-secondary" />
              </button>
            )}
          </div>
          {isEditingAssignee ? (
            <div className="space-y-3">
              <UserSelect
                users={users}
                value={assignee}
                onChange={setAssignee}
                disabled={isUpdating}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleAssigneeUpdate}
                  isLoading={isUpdating}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAssignee(issue.assignee?._id || null);
                    setIsEditingAssignee(false);
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {issue.assignee ? (
                <>
                  <Avatar src={issue.assignee.profileImage} name={issue.assignee.name} size="md" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{issue.assignee.name}</p>
                    <p className="text-xs text-text-secondary">{issue.assignee.email}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-text-secondary">
                  <User className="h-5 w-5" />
                  <span className="text-sm">Unassigned</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Created By */}
        <Card>
          <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Created By</h3>
          {issue.createdBy && (
            <div className="flex items-center gap-3">
              <Avatar src={issue.createdBy.profileImage} name={issue.createdBy.name} size="md" />
              <div>
                <p className="text-sm font-medium text-text-primary">{issue.createdBy.name}</p>
                <p className="text-xs text-text-secondary">{issue.createdBy.email}</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Timestamps */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="text-xs text-text-secondary">Created</p>
              <p className="text-sm font-medium text-text-primary">{formatDateTime(issue.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-text-secondary" />
            <div>
              <p className="text-xs text-text-secondary">Last Updated</p>
              <p className="text-sm font-medium text-text-primary">{formatDateTime(issue.updatedAt)}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
