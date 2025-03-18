"use client";
import { useState } from "react";

const Main = () => {
  const [model, setModel] = useState("Professional");
  const [roomType, setRoomType] = useState("Living Room");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false); // New State to Track Loading

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateDesign = () => {
    setIsGenerating(true);
    setGeneratedImage(null); // Clear previous image

    // Simulate an API call with a delay
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedImage("Generated design will appear here."); // Placeholder Text
    }, 2000); // Simulates API delay (2 seconds)
  };

  return (
    <div className="flex-1 p-10 bg-[#F5EBDC] text-[#3E2723]">
      <h2 className="text-3xl font-bold text-[#4CAF50] mb-3">🌟 Upload a Room Photo</h2>
      <p className="text-[#5D4037] mb-6">Enhance the appearance of your room with AI-powered interior design.</p>

      {/* Dropdowns */}
      <div className="flex gap-4">
        <select
          className="p-3 bg-[#D7CCC8] text-[#3E2723] rounded-lg shadow-lg border border-[#795548]"
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
          className="p-3 bg-[#D7CCC8] text-[#3E2723] rounded-lg shadow-lg border border-[#795548]"
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

      {/* Upload Input */}
      <div className="mt-6">
        <input
          type="file"
          className="p-3 bg-[#D7CCC8] text-[#3E2723] rounded-lg border border-[#795548] w-full"
          onChange={handleFileUpload}
        />
      </div>

      {/* Image Display */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        {uploadedImage && (
          <div className="border border-[#5D4037] p-3 rounded-lg relative shadow-lg">
            <span className="absolute top-2 right-2 text-[#D84315] cursor-pointer">🗑</span>
            <img src={uploadedImage} alt="Uploaded" className="w-full rounded-lg" />
          </div>
        )}

        {isGenerating ? (
          <div className="border border-[#5D4037] p-3 rounded-lg flex items-center justify-center text-[#795548] text-lg italic">
            Generating...
          </div>
        ) : (
          generatedImage && (
            <div className="border border-[#5D4037] p-3 rounded-lg text-[#795548] flex items-center justify-center">
              {generatedImage}
            </div>
          )
        )}
      </div>

      {/* Button */}
      <button
        onClick={generateDesign}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#FFD54F] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
      >
        🎨 Design This Room
      </button>
    </div>
  );
};

export default Main;
