"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, X } from "lucide-react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const Main = () => {
  const [model, setModel] = useState("Professional");
  const [roomType, setRoomType] = useState("Living Room");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Upload to Cloudinary
  const uploadToCloudinary = async (base64Image: string) => {
    try {
      setGeneratedImages([]);
      setIsGenerating(false);

      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });

      const data = await res.json();
      console.log("☁️ Cloudinary Upload:", data);

      if (data?.url) {
        setUploadedImage(data.url);
      } else {
        alert("Upload failed. Check console.");
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed. Please try again.");
    }
  };

  // Handle file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGeneratedImages([]);
    setIsGenerating(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      uploadToCloudinary(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setGeneratedImages([]);
    setIsGenerating(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      uploadToCloudinary(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Generate AI Designs (RoomGPT)
  const generateDesign = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      const res = await fetch("/api/design/roomgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage,
          style: model,
          roomType,
        }),
      });

      const data = await res.json();
      console.log("🎨 RoomGPT Response:", data);

      if (Array.isArray(data?.images)) {
        setGeneratedImages(data.images);

        // Save history to Firestore
        try {
          await addDoc(collection(db, "user_history"), {
            userId: user?.uid || "guest",
            originalImage: uploadedImage,
            generatedImages: data.images,
            model,
            roomType,
            createdAt: serverTimestamp(),
          });

          console.log("✅ Saved to Firestore");
        } catch (err) {
          console.error("⚠️ Firestore Save Error:", err);
        }
      } else {
        alert("No images returned. Check Replicate API.");
      }
    } catch (err) {
      console.error("❌ Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Scroll carousel
  const scrollByCard = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;

    const delta = (el.clientWidth - 48) * (direction === "right" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-beige-light to-accent-light dark:from-gray-900 dark:to-gray-800 p-6 md:p-12 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent">
          ✨ Interior Designer AI
        </h1>
        <p className="mt-3 text-lg md:text-xl text-brown-light dark:text-gray-300">
          Upload your room and generate{" "}
          <span className="text-primary font-semibold">3 stunning AI designs</span>.
        </p>
      </motion.div>

      {/* Upload Box */}
      <motion.div
        className={`border-2 border-dashed rounded-2xl p-10 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-xl flex flex-col items-center transition ${
          isDragging ? "border-primary shadow-primary/50" : "border-brown-light"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!uploadedImage ? (
          <>
            <Upload className="w-14 h-14 text-primary animate-bounce mb-3" />
            <p className="text-lg font-medium text-brown dark:text-gray-200 mb-3">
              Drag & Drop or Click to Upload
            </p>

            <input
              id="fileUpload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />

            <label
              htmlFor="fileUpload"
              className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:scale-105 cursor-pointer transition-transform"
            >
              Browse Files
            </label>
          </>
        ) : (
          <div className="w-full max-w-3xl">
            <Image
              src={uploadedImage}
              alt="Uploaded room"
              width={1200}
              height={800}
              className="rounded-xl shadow-lg object-cover w-full"
            />

            <button
              onClick={() => {
                setUploadedImage(null);
                setGeneratedImages([]);
              }}
              className="mt-4 px-5 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600"
            >
              ❌ Remove
            </button>
          </div>
        )}
      </motion.div>

      {/* Options */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="p-3 bg-white/80 dark:bg-gray-800 border border-brown-light dark:border-gray-600 rounded-xl shadow hover:scale-105 transition"
        >
          <option>Professional</option>
          <option>Modern</option>
          <option>Minimalist</option>
          <option>Rustic</option>
          <option>Bohemian</option>
        </select>

        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="p-3 bg-white/80 dark:bg-gray-800 border border-brown-light dark:border-gray-600 rounded-xl shadow hover:scale-105 transition"
        >
          <option>Living Room</option>
          <option>Bedroom</option>
          <option>Kitchen</option>
          <option>Office</option>
          <option>Bathroom</option>
        </select>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={generateDesign}
          disabled={isGenerating}
          className={`flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl ${
            isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-accent text-white hover:scale-110"
          }`}
        >
          <Sparkles className="w-6 h-6" />
          {isGenerating ? "🎨 Generating..." : "🎨 Design This Room"}
        </button>
      </div>

      {/* Carousel for Generated Images */}
      {generatedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-12 max-w-6xl mx-auto"
        >
          <div
            ref={carouselRef}
            className="overflow-x-auto snap-x snap-mandatory rounded-xl px-3"
          >
            <div className="flex gap-6 py-2">
              {generatedImages.map((url, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="snap-center shrink-0 w-[85vw] md:w-[550px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4"
                >
                  <Image
                    src={url}
                    alt={`Generated design ${idx + 1}`}
                    width={900}
                    height={600}
                    className="w-full h-[320px] md:h-[380px] object-cover rounded-xl shadow-md cursor-pointer"
                    onClick={() => setLightboxImage(url)}
                  />

                  <div className="flex gap-4 mt-4 justify-center">
                    <button className="px-5 py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dark">
                      Select
                    </button>

                    <button
                      onClick={() => setLightboxImage(url)}
                      className="px-5 py-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600"
                    >
                      View
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            className="hidden md:flex items-center justify-center absolute top-1/2 -left-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark"
            onClick={() => scrollByCard("left")}
          >
            ◀
          </button>

          <button
            className="hidden md:flex items-center justify-center absolute top-1/2 -right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark"
            onClick={() => scrollByCard("right")}
          >
            ▶
          </button>
        </motion.div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <Image
                src={lightboxImage}
                alt="Large View"
                width={1400}
                height={1000}
                className="rounded-xl shadow-2xl max-h-[80vh] object-contain"
              />
            </motion.div>

            <button
              className="absolute top-6 right-6 bg-red-600 px-3 py-2 rounded-full shadow-xl"
              onClick={() => setLightboxImage(null)}
            >
              <X size={22} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;
