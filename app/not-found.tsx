import React from "react";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { IllustrationContainer } from "@/components/ui/IllustrationContainer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Image Section - Hidden on mobile, visible on md and above */}
      <IllustrationContainer imageSrc="/assets/not-found.svg" imageAlt="404 illustration" />

      {/* Content Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <Card className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary mb-6">
          <FileQuestion className="h-10 w-10 text-text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold text-text-primary mb-3">Page Not Found</h2>
        <p className="text-sm text-text-secondary mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/issues">
            <Button variant="primary">Go to Issues</Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
        </div>
      </Card>
      </div>
    </div>
  );
}
