// User type definitions matching backend

export interface User {
  _id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

