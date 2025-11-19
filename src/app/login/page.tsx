"use client";
export const dynamic = "force-dynamic";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BackgroundFX from "../components/BackgroundFX";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function LoginRoute() {
  const { user, login, skip, isLoading } = useAuth();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <main className="grid place-items-center min-h-screen bg-gradient-to-br from-[#fdf6e3] to-[#fceabb]">
        <p className="text-gray-600 text-lg animate-pulse">
          Initializing authentication...
        </p>
      </main>
    );
  }

  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <BackgroundFX />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Interior Designer AI
          </span>
        </h1>
        <p className="muted mb-6">
          Sign in to generate <strong>3 stunning</strong> layouts for any room.
        </p>

        <button onClick={login} className="btn btn-primary w-full justify-center">
          Continue with Google
        </button>

        <button
          onClick={() => {
            skip();
            router.replace("/home");
          }}
          className="btn btn-ghost w-full justify-center mt-3"
        >
          Skip for now
        </button>

        <div className="mt-6 text-sm">
          <button
            onClick={toggleTheme}
            className="underline opacity-80 hover:opacity-100"
          >
            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>
      </motion.section>
    </main>
  );
}
