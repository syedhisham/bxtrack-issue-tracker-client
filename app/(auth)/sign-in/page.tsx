"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { IllustrationContainer } from "@/components/ui/IllustrationContainer";
import { SeededUsersModal } from "@/components/auth/modals/SeededUsersModal";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/issues");
    }
  }, [isAuthenticated, router]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await login(email);
      router.push("/issues");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Login failed. Please check your email and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Image Section - Hidden on mobile, visible on md and above */}
      <IllustrationContainer imageSrc="/assets/auth-image.svg" />

      {/* Form Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
              <LogIn className="h-8 w-8 text-text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h1>
            <p className="text-sm text-text-secondary">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={isLoading}
              autoFocus
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-error/20">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-xs text-center text-text-secondary">
              Use any email from the seeded users to sign in
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="w-full text-xs"
            >
              <Users className="h-4 w-4 mr-2" />
              View Seeded Users
            </Button>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-surface border border-border">
            <p className="text-xs text-text-secondary text-center">
              <span className="font-medium">Note:</span> The backend service may take up to a minute to respond on the first request after inactivity. This is due to{" "}
              <a
                href="https://render.com/docs/free"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Render's free tier spin-down behavior
              </a>
              . Subsequent requests will be faster.
            </p>
          </div>
        </Card>
      </div>

      {/* Seeded Users Modal */}
      <SeededUsersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={(selectedEmail) => {
          setEmail(selectedEmail);
          setError("");
        }}
      />
    </div>
  );
}
