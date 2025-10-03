"use client";
import { Home, History, X, LogIn, LogOut, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (page: string) => void;
  selected: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSelect,
  selected,
}) => {
  const { user, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          className="fixed top-0 left-0 h-full w-72 bg-white/60 dark:bg-gray-900/70 backdrop-blur-lg shadow-2xl z-50 rounded-r-2xl flex flex-col"
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-primary hover:scale-110 transition-transform"
            onClick={onClose}
          >
            <X size={26} />
          </button>

          {/* Logo / Title */}
          <div className="p-8">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent">
              🌿 Interior Designer
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-3">
            <button
              className={`flex items-center gap-4 px-5 py-3 w-full text-left rounded-xl transition-all ${
                selected === "home"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105"
                  : "hover:bg-brown-light/20 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                onSelect("home");
                onClose();
              }}
            >
              <Home className="w-6 h-6" />
              <span className="text-lg font-medium">Home</span>
            </button>

            <button
              className={`flex items-center gap-4 px-5 py-3 w-full text-left rounded-xl transition-all ${
                selected === "history"
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-105"
                  : "hover:bg-brown-light/20 dark:hover:bg-gray-700"
              }`}
              onClick={() => {
                onSelect("history");
                onClose();
              }}
            >
              <History className="w-6 h-6" />
              <span className="text-lg font-medium">History</span>
            </button>
          </nav>

          {/* Bottom Section */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-4 px-5 py-3 w-full rounded-xl hover:bg-brown-light/20 dark:hover:bg-gray-700 transition-all"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-6 h-6" /> <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-6 h-6" /> <span>Light Mode</span>
                </>
              )}
            </button>

            {/* Auth */}
            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-4 px-5 py-3 w-full rounded-xl hover:bg-brown-light/20 dark:hover:bg-gray-700 transition-all"
              >
                <LogOut className="w-6 h-6" /> <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-4 px-5 py-3 w-full rounded-xl hover:bg-brown-light/20 dark:hover:bg-gray-700 transition-all"
              >
                <LogIn className="w-6 h-6" /> <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
