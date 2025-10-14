"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  // ✅ FIX: Run redirect only after render using useEffect
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleSkip = () => {
    localStorage.setItem("skipLogin", "true");
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-beige-light to-accent-light dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent">
        🌿 Welcome to Interior Designer AI
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-10 text-center max-w-md">
        Sign in to save your room designs and access your design history, or skip to try it out.
      </p>

      <div className="flex flex-col gap-4 w-60">
        <button
          onClick={login}
          className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
        >
          Sign in with Google
        </button>

        <button
          onClick={handleSkip}
          className="px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
