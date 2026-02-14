"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        loaded: (ph) => {
            if (process.env.NODE_ENV === "development") ph.debug();
        },
    });
}

export function PHProvider({ children }: { children: React.ReactNode }) {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export function PostHogPageview() {
    useEffect(() => {
        const handleRouteChange = () => {
            posthog.capture("$pageview");
        };
        window.addEventListener("popstate", handleRouteChange);
        return () => window.removeEventListener("popstate", handleRouteChange);
    }, []);

    return null;
}
