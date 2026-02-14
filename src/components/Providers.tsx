"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { PHProvider, PostHogPageview } from "./PostHogProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <PHProvider>
                <PostHogPageview />
                {children}
            </PHProvider>
        </ThemeProvider>
    );
}
