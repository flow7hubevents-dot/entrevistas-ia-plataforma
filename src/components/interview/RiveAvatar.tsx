"use client";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export default function RiveAvatar() {
    const { rive, RiveComponent } = useRive({
        src: "/assets/avatar.riv",
        autoplay: true,
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
    });

    return (
        <div className="w-full h-full">
            <RiveComponent />
        </div>
    );
}
