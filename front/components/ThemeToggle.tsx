"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      {mounted ? (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="group cursor-pointer  flex items-center justify-center p-2 transition-all transform "
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun size={20} className="transition-transform duration-300 rotate-0 group-hover:rotate-90" />
          ) : (
            <Moon size={20} className="transition-transform duration-300 rotate-0 group-hover:-rotate-12" />
          )}
        </button>
      ) : (
        <div className="w-5 h-5 opacity-0" />
      )}
    </div>
  );
};

export default ThemeToggle;
