"use client";

import React, { useState } from "react";

interface DesignFormProps {
  onSubmit: (images: string[]) => void; // now passes 3 images back
}

const DesignForm: React.FC<DesignFormProps> = ({ onSubmit }) => {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/design/roomgpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: null,         // optional if using text only
          roomType: "Living Room", // you could make this dynamic
          style: input,        // send the description as style/prompt
        }),
      });

      const data = await res.json();
      console.log("🧠 API Response:", data);

      if (data.images && Array.isArray(data.images)) {
        onSubmit(data.images);
      } else {
        onSubmit([]);
      }
    } catch (err) {
      console.error("❌ Error generating designs:", err);
      onSubmit([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Enter Room Description</h2>
      <textarea
        className="w-full p-2 border rounded-lg"
        placeholder="Describe your interior design preferences..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={handleSubmit}
        disabled={isGenerating}
      >
        {isGenerating ? "⏳ Generating..." : "Generate 3 Designs"}
      </button>
    </div>
  );
};

export default DesignForm;
