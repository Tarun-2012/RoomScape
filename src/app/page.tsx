"use client";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import HistoryPage from "./components/HistoryPage";
import { Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelect={setSelectedPage}
        selected={selectedPage}
      />

      {/* Backdrop overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content full screen */}
      <div className="flex-1 p-4">
        {/* Top nav with menu button */}
        <button
          className="p-2 bg-[#4CAF50] text-white rounded-md shadow-md mb-4"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        {selectedPage === "home" && <Main />}
        {selectedPage === "history" && <HistoryPage />}
      </div>
    </div>
  );
}
