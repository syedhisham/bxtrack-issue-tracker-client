import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FBFBFB",
        foreground: "#171717",
        primary: "#C4D9FF",
        secondary: "#C5BAFF",
        surface: "#E8F9FF",
        "text-primary": "#1a1a1a",
        "text-secondary": "#6b7280",
        border: "#e5e7eb",
        error: "#ef4444",
        success: "#10b981",
      },
    },
  },
  plugins: [],
};

export default config;

