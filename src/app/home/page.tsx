"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Smile, Home } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import { useAuth } from "@/context/AuthContext";
import BackgroundFX from "../components/BackgroundFX"; // 🌈 animated gradient background

export default function HomePage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState("home");
  const [displayName, setDisplayName] = useState("Guest");

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName.split(" ")[0]);
    } else {
      const skipped = localStorage.getItem("skipLogin");
      setDisplayName(skipped ? "Guest" : "User");
    }
  }, [user]);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)] transition-colors duration-700">
      {/* 🌈 Dynamic floating background */}
      <BackgroundFX />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={setSelectedPage}
        selected={selectedPage}
        userName={displayName}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 relative z-10 overflow-y-auto">
        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center mb-10"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:scale-105 transition-all"
          >
            <Home size={22} />
          </button>

          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent drop-shadow-md">
            Interior Designer AI Dashboard
          </h1>

          <Smile className="text-primary-dark w-7 h-7 hidden md:block animate-pulse" />
        </motion.div>

        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="rounded-3xl card p-8 md:p-10 text-center max-w-4xl mx-auto relative overflow-hidden backdrop-blur-lg"
        >
          {/* Glowing shapes inside card */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-accent/10 to-transparent blur-2xl opacity-40 animate-pulse"></div>

          <div className="flex justify-center mb-6">
            <Sparkles className="text-accent w-10 h-10 animate-spin-slow" />
          </div>

          <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent">
            Welcome, {displayName}! 🌿
          </h2>

          <p className="text-[var(--muted)] text-lg max-w-2xl mx-auto leading-relaxed">
            Step into your personal AI design studio.  
            Upload a photo of your room and watch our intelligent designer craft  
            <strong className="text-primary-dark dark:text-accent"> 3 unique, professional layouts</strong> in seconds.
          </p>

          <motion.button
            whileHover={{ scale: 1.07, boxShadow: "0 0 20px rgba(96,165,250,0.4)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setSelectedPage("home")}
            className="mt-8 btn btn-primary text-lg font-semibold"
          >
            🎨 Start Designing
          </motion.button>
        </motion.div>

        {/* Dynamic Content Below */}
        <motion.div
          key={selectedPage}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-16"
        >
          {selectedPage === "home" && <Main />}
        </motion.div>
      </div>
    </div>
  );
}
