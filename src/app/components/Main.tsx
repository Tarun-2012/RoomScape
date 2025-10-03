"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, X } from "lucide-react";

const Main = () => {
  const [model, setModel] = useState("Professional");
  const [roomType, setRoomType] = useState("Living Room");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  // Upload image to Cloudinary via API
  const uploadToCloudinary = async (base64Image: string) => {
    try {
      const res = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });
      const data = await res.json();
      console.log("☁️ Cloudinary Upload:", data);

      if (data?.url) {
        setUploadedImage(data.url); // ✅ hosted Cloudinary URL
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

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      uploadToCloudinary(base64Image);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      uploadToCloudinary(base64Image);
    };
    reader.readAsDataURL(file);
  };

  // Generate AI designs (calls /api/design/roomgpt)
  const generateDesign = async () => {
    if (!uploadedImage) return;
    setIsGenerating(true);
    setGeneratedImages([]);

    try {
      const res = await fetch("/api/design/roomgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: uploadedImage, // Cloudinary URL
          style: model,
          roomType,
        }),
      });

      const data = await res.json();
      console.log("🎨 Replicate Response:", data);

      if (Array.isArray(data?.images) && data.images.length > 0) {
        setGeneratedImages(data.images);
      } else {
        alert("No designs generated. Please check Replicate API.");
      }
    } catch (err) {
      console.error("❌ Generate error:", err);
      alert("Failed to generate designs. Check logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Scroll carousel
  const scrollByCard = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const delta = (dir === "right" ? 1 : -1) * (el.clientWidth - 48);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-beige-light to-accent-light dark:from-gray-900 dark:to-gray-800 p-6 md:p-12 relative overflow-hidden">
      {/* Floating BG Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary-dark bg-clip-text text-transparent">
          ✨ Interior Designer AI
        </h1>
        <p className="mt-3 text-lg md:text-xl text-brown-light dark:text-gray-300">
          Upload your room and explore{" "}
          <span className="font-semibold text-primary">3 stunning AI designs</span> instantly
        </p>
      </motion.div>

      {/* Upload Box */}
      <motion.div
        className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-xl transition-all duration-300 ${
          isDragging ? "border-primary shadow-primary/50" : "border-brown-light"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!uploadedImage ? (
          <>
            <Upload className="w-14 h-14 text-primary animate-bounce mb-4" />
            <p className="text-lg font-medium text-brown dark:text-gray-200 mb-3">
              Drag & Drop or Click to Upload
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileUpload"
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
            <img
              src={uploadedImage}
              alt="Uploaded Room"
              className="rounded-xl shadow-lg w-full object-cover"
            />
            <button
              onClick={() => setUploadedImage(null)}
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
          className="p-3 bg-white/80 dark:bg-gray-800 border border-brown-light dark:border-gray-600 rounded-xl shadow hover:scale-105 transition"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option>Professional</option>
          <option>Modern</option>
          <option>Minimalist</option>
          <option>Rustic</option>
          <option>Bohemian</option>
        </select>
        <select
          className="p-3 bg-white/80 dark:bg-gray-800 border border-brown-light dark:border-gray-600 rounded-xl shadow hover:scale-105 transition"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
        >
          <option>Living Room</option>
          <option>Bedroom</option>
          <option>Kitchen</option>
          <option>Office</option>
          <option>Bathroom</option>
        </select>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center mt-8">
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

      {/* Carousel */}
      {generatedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-12 max-w-6xl mx-auto"
        >
          <div
            ref={carouselRef}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory rounded-xl px-3"
          >
            <div className="flex gap-6 py-2">
              {generatedImages.map((url, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="snap-center shrink-0 w-[85vw] md:w-[550px] bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4"
                >
                  <img
                    src={url}
                    alt={`Generated design ${idx + 1}`}
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
            className="hidden md:flex items-center justify-center absolute top-1/2 -left-6 -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark"
            onClick={() => scrollByCard("left")}
          >
            ◀
          </button>
          <button
            className="hidden md:flex items-center justify-center absolute top-1/2 -right-6 -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark"
            onClick={() => scrollByCard("right")}
          >
            ▶
          </button>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.img
              src={lightboxImage}
              alt="Enlarged Design"
              className="max-w-4xl max-h-[80vh] rounded-lg shadow-2xl"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            />
            <button
              type="button"
              className="absolute top-6 right-6 text-white bg-red-600 px-3 py-2 rounded-full shadow-lg hover:bg-red-700"
              onClick={() => setLightboxImage(null)}
            >
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Main;
