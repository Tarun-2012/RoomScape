"use client";

import {
  Home,
  History,
  X,
  LogIn,
  LogOut,
  Moon,
  Sun,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (page: string) => void;
  selected: string;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSelect,
  selected,
  userName,
}) => {
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 15 }}
          className="fixed top-0 left-0 h-full w-72 bg-[var(--card)]/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-r border-white/20 dark:border-gray-800 rounded-r-3xl z-50 flex flex-col overflow-hidden"
        >
          {/* Gradient glow accent */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10 pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/30 dark:bg-gray-800/60 hover:scale-110 hover:bg-white/50 dark:hover:bg-gray-700/70 transition-all text-primary shadow-sm"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>

          {/* Profile Section */}
          <div className="relative z-10 p-8 flex flex-col items-center border-b border-gray-200/30 dark:border-gray-700/40">
            {user?.photoURL ? (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={user.photoURL}
                alt="User Avatar"
                className="w-20 h-20 rounded-full shadow-lg mb-3 ring-2 ring-accent/40"
              />
            ) : (
              <UserCircle className="w-20 h-20 text-primary mb-3" />
            )}
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {user?.displayName || userName || "Guest User"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email || "No email linked"}
            </p>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 px-4 mt-5 relative z-10 space-y-3">
            {[
              {
                href: "/home",
                id: "home",
                label: "Home",
                icon: <Home size={20} />,
              },
              {
                href: "/history",
                id: "history",
                label: "History",
                icon: <History size={20} />,
              },
            ].map((item) => (
              <Link key={item.id} href={item.href}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className={`flex items-center gap-4 px-5 py-3 w-full text-left rounded-xl font-medium transition-all ${
                    selected === item.id
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-[1.03]"
                      : "text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.button>
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-gray-200/30 dark:border-gray-700/40 relative z-10 space-y-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="flex items-center gap-4 px-5 py-3 w-full rounded-xl transition-all hover:bg-black/5 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-5 h-5" /> <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5" /> <span>Light Mode</span>
                </>
              )}
            </motion.button>

            {/* Login / Logout */}
            {user ? (
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 10px rgba(239,68,68,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-4 px-5 py-3 w-full rounded-xl bg-gradient-to-r from-red-500/90 to-red-400/80 text-white shadow-md hover:shadow-lg transition-all"
              >
                <LogOut className="w-5 h-5" /> <span>Logout</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 10px rgba(34,197,94,0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={login}
                className="flex items-center gap-4 px-5 py-3 w-full rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg transition-all"
              >
                <LogIn className="w-5 h-5" /> <span>Sign in with Google</span>
              </motion.button>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
