import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-border p-6",
        hover && "hover:shadow-md hover:border-primary transition-all duration-150",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
