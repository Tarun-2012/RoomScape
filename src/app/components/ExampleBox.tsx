// src/components/ExampleBox.tsx
"use client";

export default function ExampleBox() {
  return (
    <div className="p-6 rounded-lg bg-white text-black dark:bg-gray-900 dark:text-gray-100 shadow-md transition-colors duration-300">
      <h2 className="text-lg font-semibold">This box changes with theme</h2>
      <p className="text-sm">
        Toggle between light and dark mode to see the effect.
      </p>
    </div>
  );
}
