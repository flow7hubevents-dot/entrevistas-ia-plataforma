"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 w-10 h-10" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-zinc-900/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-900/10 dark:hover:bg-white/10 transition-all duration-300 active:scale-90"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-500 animate-[rotate_1s_ease-out]" />
            ) : (
                <Moon className="w-5 h-5 text-blue-600 animate-[rotate_1s_ease-out]" />
            )}
        </button>
    );
}
