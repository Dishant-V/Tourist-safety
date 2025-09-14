import * as React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("relative flex items-center", className)}>
      {/* Toggle Container */}
      <div className="relative w-20 h-10 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-500 rounded-full p-1 transition-all duration-500 shadow-lg">
        
        {/* Background Elements */}
        <div className="absolute inset-1 rounded-full overflow-hidden">
          {/* Light Mode Background */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-sky-300 to-blue-200 transition-opacity duration-500",
            theme === "dark" ? "opacity-0" : "opacity-100"
          )}>
            {/* Sun */}
            <div className="absolute top-1 left-2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg">
              <div className="absolute inset-0.5 bg-yellow-300 rounded-full"></div>
            </div>
            {/* Clouds */}
            <div className="absolute top-2 right-3 w-3 h-2 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-1.5 right-1 w-2 h-1.5 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-3 right-5 w-2 h-1 bg-white rounded-full opacity-70"></div>
          </div>

          {/* Dark Mode Background */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-600 transition-opacity duration-500",
            theme === "dark" ? "opacity-100" : "opacity-0"
          )}>
            {/* Moon */}
            <div className="absolute top-1 right-2 w-6 h-6 bg-gray-100 rounded-full shadow-lg">
              <div className="absolute top-1 left-1 w-2 h-2 bg-slate-600 rounded-full"></div>
              <div className="absolute top-2.5 left-2 w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="absolute top-0.5 left-3 w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
            </div>
            {/* Stars */}
            <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute top-3 left-4 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute top-2 left-6 w-0.5 h-0.5 bg-white rounded-full"></div>
            <div className="absolute top-4 left-1 w-0.5 h-0.5 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className={cn(
            "relative w-8 h-8 bg-white dark:bg-slate-200 rounded-full shadow-lg transition-all duration-500 transform flex items-center justify-center",
            theme === "dark" ? "translate-x-10" : "translate-x-0",
            "hover:scale-110 active:scale-95"
          )}
        >
          <div className="relative">
            <Sun className={cn(
              "h-4 w-4 text-yellow-600 transition-all duration-300 absolute inset-0",
              theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
            )} />
            <Moon className={cn(
              "h-4 w-4 text-slate-700 transition-all duration-300 absolute inset-0",
              theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
            )} />
          </div>
        </button>
      </div>

      {/* Labels */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs font-medium">
        <span className={cn(
          "transition-colors duration-300",
          theme === "light" ? "text-primary" : "text-muted-foreground"
        )}>
          Light mode
        </span>
        <span className={cn(
          "transition-colors duration-300",
          theme === "dark" ? "text-primary" : "text-muted-foreground"
        )}>
          Dark mode
        </span>
      </div>
    </div>
  );
}