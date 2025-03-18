"use client";
import { useState } from "react";
import { Home, History } from "lucide-react";

const Sidebar = () => {
  const [selected, setSelected] = useState("home");

  return (
    <aside className="w-72 h-screen bg-[#3E2723] text-[#F5EBDC] flex flex-col p-6">
      <h1 className="text-2xl font-extrabold text-[#FFD54F] mb-8">🌿 Interior Designer</h1>

      <nav className="space-y-3">
        <button
          className={`flex items-center gap-3 p-3 w-full text-left rounded-md ${
            selected === "home" ? "bg-[#4CAF50] text-white shadow-lg" : "hover:bg-[#5D4037]"
          }`}
          onClick={() => setSelected("home")}
        >
          <Home className="w-5 h-5" /> <span className="font-medium">Home</span>
        </button>

        <button
          className={`flex items-center gap-3 p-3 w-full text-left rounded-md ${
            selected === "history" ? "bg-[#4CAF50] text-white shadow-lg" : "hover:bg-[#5D4037]"
          }`}
          onClick={() => setSelected("history")}
        >
          <History className="w-5 h-5" /> <span className="font-medium">History</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
