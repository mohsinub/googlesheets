"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="p-4 flex justify-between items-center bg-gray-200 dark:bg-gray-800">
      <h1 className="text-xl font-bold">My App</h1>
        <a href="/list">List</a>
        <Link href="/list">
          Lists
        </Link>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </header>
  );
}
