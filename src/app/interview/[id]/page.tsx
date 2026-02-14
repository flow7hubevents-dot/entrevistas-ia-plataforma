"use client";

import RiveAvatar from "@/components/interview/RiveAvatar";
import { useEffect, useRef, useState } from "react";
import { getRandomMoods } from "@/types/moods";

export default function InterviewPage({ params }: { params: { id: string } }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [moods, setMoods] = useState<string[]>([]);

    const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    // Activar cámara y generar moods
    useEffect(() => {
        async function enableCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraReady(true);
                }
            } catch (err) {
                console.error("Error enabling camera:", err);
            }
        }

        enableCamera();
        setMoods(getRandomMoods());
    }, []);

    // Pregunta inicial automática del entrevistador
    async function startInterview() {
        if (hasStarted) return;
        setHasStarted(true);
        setIsLoading(true);

        try {
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message:
                        "Inicia la entrevista con tu primera pregunta para el candidato. No expliques que eres una IA, solo actúa como un entrevistador profesional.",
                    moods: moods,
                }),
            });

            const data = await res.json();

            setMessages([
                {
                    from: "ai",
                    text: data.reply,
                },
            ]);
        } catch (err) {
            console.error("Error iniciando entrevista:", err);
        } finally {
            setIsLoading(false);
        }
    }

    // Enviar respuesta del candidato
    async function sendMessage() {
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    moods: moods,
                }),
            });

            const data = await res.json();

            setMessages((prev) => [...prev, { from: "ai", text: data.reply }]);
        } catch (err) {
            console.error("Error enviando mensaje:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full h-screen bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white flex flex-col items-center justify-center relative overflow-hidden">

            {/* Avatar principal */}
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-[700px] h-[70vh]">
                    <RiveAvatar />
                </div>
            </div>

            {/* Webcam del usuario */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute bottom-6 right-6 w-40 h-28 rounded-xl border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)] object-cover opacity-0 translate-y-3 animate-[fadeInUp_0.6s_ease-out_forwards]"
            />

            {/* Chat */}
            <div className="absolute bottom-24 w-full flex flex-col items-center">
                <div className="w-full max-w-[600px] bg-black/40 p-4 rounded-xl mb-3 max-h-60 overflow-y-auto">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`mb-2 ${msg.from === "user" ? "text-blue-300 text-right" : "text-green-300 text-left"
                                }`}
                        >
                            <strong>{msg.from === "user" ? "Tú:" : "Entrevistador:"}</strong> {msg.text}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="text-green-300 text-left italic">
                            Entrevistador está pensando...
                        </div>
                    )}

                    {!hasStarted && (
                        <div className="text-center text-sm text-white/70">
                            Pulsa <strong>“Empezar entrevista”</strong> para que el entrevistador lance la primera pregunta.
                        </div>
                    )}
                </div>

                <div className="w-full max-w-[600px] flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white disabled:opacity-40"
                        placeholder={
                            hasStarted
                                ? "Escribe tu respuesta..."
                                : "Pulsa primero 'Empezar entrevista'..."
                        }
                        disabled={!hasStarted || isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-40"
                        disabled={!hasStarted || isLoading}
                    >
                        Enviar
                    </button>
                </div>
            </div>

            {/* Controles inferiores */}
            <div className="absolute bottom-0 w-full h-20 bg-black/40 backdrop-blur-md flex items-center justify-center gap-6">
                <button
                    onClick={startInterview}
                    className="px-4 py-2 bg-emerald-600 rounded-lg disabled:opacity-40"
                    disabled={hasStarted || isLoading}
                >
                    Empezar entrevista
                </button>
                <button className="px-4 py-2 bg-white/10 rounded-lg">Mute</button>
                <button className="px-4 py-2 bg-red-600 rounded-lg">Finalizar</button>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
