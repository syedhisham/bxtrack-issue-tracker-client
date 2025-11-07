"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to sign-in or issues based on auth state
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/issues");
    } else {
      router.push("/sign-in");
    }
  }, [router]);

  return null;
}
