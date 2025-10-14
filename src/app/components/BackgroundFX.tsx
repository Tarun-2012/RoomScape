"use client";
import { motion } from "framer-motion";

export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0.3, scale: 0.95 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-[-15%] left-[-10%] w-[35rem] h-[35rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.25), transparent 70%)" }}
      />
      <motion.div
        initial={{ opacity: 0.4, scale: 1 }}
        animate={{ opacity: 0.9, scale: 1.05 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-[-20%] right-[-15%] w-[40rem] h-[40rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(96,165,250,0.25), transparent 70%)" }}
      />
    </div>
  );
}
