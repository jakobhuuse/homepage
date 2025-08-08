"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (!theme || theme === "system") {
      setTheme(systemTheme || "light");
    }
  }, [theme, systemTheme, setTheme]);

  // Prevent rendering until mounted to avoid hydration mismatch
  if (!mounted) return null;

  // Determine current mode
  const currentTheme = theme === "system" ? systemTheme || "light" : theme;

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all ${
          currentTheme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          currentTheme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
