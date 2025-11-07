import axios, { AxiosError } from "axios";
import type { LoginResponse, User } from "@/types/user";
import type {
  Issue,
  CreateIssueDto,
  UpdateIssueDto,
  IssueFilters,
  IssueSummary,
  PaginatedIssues,
} from "@/types/issue";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For cookie support
});

// Request interceptor - Add token to headers
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError<{ success: boolean; message: string }>) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and cookie, then redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Clear cookie for middleware
      if (typeof document !== "undefined") {
        document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      }
      
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string): Promise<LoginResponse> => {
    const response = await api.post<{ success: boolean; message?: string; data: LoginResponse["data"] }>(
      "/auth/login",
      { email }
    );
    return response.data as LoginResponse;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getUsers: async (): Promise<User[]> => {
    const response = await api.get<{ success: boolean; data: User[] }>("/users/all-users");
    return response.data.data;
  },
};

// Issue API
export const issueAPI = {
  getIssues: async (filters?: IssueFilters): Promise<PaginatedIssues> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.assignee) params.append("assignee", filters.assignee);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get<{ success: boolean; data: PaginatedIssues }>(
      `/issues${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data.data;
  },

  getIssueById: async (id: string): Promise<Issue> => {
    const response = await api.get<{ success: boolean; data: Issue }>(`/issues/${id}`);
    return response.data.data;
  },

  createIssue: async (data: CreateIssueDto): Promise<Issue> => {
    const response = await api.post<{ success: boolean; message?: string; data: Issue }>("/issues", data);
    return response.data.data;
  },

  updateIssue: async (id: string, data: UpdateIssueDto): Promise<Issue> => {
    const response = await api.patch<{ success: boolean; message?: string; data: Issue }>(
      `/issues/${id}`,
      data
    );
    return response.data.data;
  },

  getIssueSummary: async (assigneePage?: number, assigneeLimit?: number): Promise<IssueSummary> => {
    const params = new URLSearchParams();
    if (assigneePage) params.append("assigneePage", assigneePage.toString());
    if (assigneeLimit) params.append("assigneeLimit", assigneeLimit.toString());

    const response = await api.get<{ success: boolean; data: IssueSummary }>(
      `/issues/summary${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data.data;
  },

  getMyIssues: async (filters?: Omit<IssueFilters, "assignee">): Promise<PaginatedIssues> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await api.get<{ success: boolean; data: PaginatedIssues }>(
      `/issues/my-issues${params.toString() ? `?${params.toString()}` : ""}`
    );
    return response.data.data;
  },
};

export default api;
