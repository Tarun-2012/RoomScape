"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    const skip = localStorage.getItem("skipLogin");

    // ⏳ Wait a moment before redirect (to show splash)
    const timer = setTimeout(() => {
      if (user || skip === "true") {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
      setIsRedirecting(false);
    }, 1200); // 1.2s splash delay

    return () => clearTimeout(timer);
  }, [user, router]);

  if (!isRedirecting) return null;

  // 🌈 Beautiful splash / loading UI
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#FDF6E3] via-[#FCEABB] to-[#F8E1A1] text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#4CAF50] via-[#8BC34A] to-[#CDDC39] bg-clip-text text-transparent"
      >
        Interior Designer AI
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-gray-600 max-w-lg mb-8"
      >
        Crafting your personalized AI design experience...
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-12 border-4 border-[#8BC34A] border-t-transparent rounded-full animate-spin"
      ></motion.div>
    </div>
  );
}
