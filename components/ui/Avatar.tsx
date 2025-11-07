import React from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, name, size = "md", className }) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden bg-surface", sizes[size], className)}>
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          fill
          className="object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-primary flex items-center justify-center text-text-primary font-medium",
        sizes[size],
        className
      )}
    >
      {name ? (
        getInitials(name)
      ) : (
        <UserIcon className={cn(size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6")} />
      )}
    </div>
  );
};
