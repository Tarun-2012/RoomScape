"use client"; 

import React, { useState } from "react";

const DesignForm = ({ onSubmit }: { onSubmit: (input: string) => void }) => {
  const [input, setInput] = useState("");

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
        onClick={() => onSubmit(input)}
      >
        Generate Design
      </button>
    </div>
  );
};

export default DesignForm;
