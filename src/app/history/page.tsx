"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Eye } from "lucide-react";

interface HistoryItem {
  id: string;
  originalImage: string;
  generatedImages: string[];
  model: string;
  roomType: string;
  createdAt?: { seconds: number };
}

export default function HistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // ✅ Fetch user-specific history
  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, "user_history"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HistoryItem[];
        setHistory(data);
      } catch (err) {
        console.error("🔥 Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  // ✅ Delete a history entry
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this design history?")) return;
    try {
      await deleteDoc(doc(db, "user_history", id));
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Error deleting history:", err);
    }
  };

  // ✅ Helper: format timestamp
  const formatDate = (seconds?: number) => {
    if (!seconds) return "Unknown time";
    const date = new Date(seconds * 1000);
    return date.toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 text-lg">
        Loading history...
      </div>
    );

  if (!history.length)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p className="text-xl text-gray-300 font-medium mb-3">
          No design history found yet!
        </p>
        <button
          onClick={() => router.push("/home")}
          className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow hover:scale-105 transition-all"
        >
          ← Back to Home
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-8 md:p-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-accent">
          🕒 Your Design History
        </h1>
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* Main list */}
      <div className="space-y-8">
        {history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-5 bg-gray-800/60 border border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Original Image */}
              <img
                src={item.originalImage}
                alt="Original"
                className="w-full md:w-64 h-48 object-cover rounded-lg shadow-lg border border-gray-600"
              />

              {/* Info & thumbnails */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {item.model}
                  </span>
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    {item.roomType}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {formatDate(item.createdAt?.seconds)}
                  </span>
                </div>

                {/* Generated Thumbnails */}
                <div className="flex flex-wrap gap-3">
                  {item.generatedImages.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Generated ${idx + 1}`}
                      className="w-28 h-20 rounded-lg object-cover cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium transition-all"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-full text-sm font-medium transition-all"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-gray-900 rounded-xl p-6 max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-accent">
              {selectedItem.model} • {selectedItem.roomType}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedItem.generatedImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Full View ${idx + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform"
                />
              ))}
            </div>
            <button
              onClick={() => setSelectedItem(null)}
              className="mt-6 px-5 py-2 bg-red-500 hover:bg-red-600 rounded-full text-white font-medium transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
