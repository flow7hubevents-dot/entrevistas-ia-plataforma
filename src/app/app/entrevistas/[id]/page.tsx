"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { getRandomMoods } from "@/types/moods";
import {
    Mic,
    MicOff,
    Video as VideoIcon,
    X,
    Send,
    Volume2,
    VolumeX,
    Play,
    AlertCircle,
    Maximize2,
    Minimize2,
    Users,
    Zap,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Optimización: Carga diferida del componente Rive pesado
const RiveAvatar = dynamic(() => import("@/components/interview/RiveAvatar"), {
    ssr: false,
    loading: () => <Skeleton className="w-[300px] h-[300px] rounded-full mx-auto" />
});

export default function InterviewPage({ params }: { params: { id: string } }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [moods, setMoods] = useState<string[]>([]);
    const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [showEndModal, setShowEndModal] = useState(false);
    const [webcamPosition, setWebcamPosition] = useState<'bottom' | 'top'>('bottom');
    const [selectedInterviewer, setSelectedInterviewer] = useState<any>(null);
    const [isEvaluating, setIsEvaluating] = useState(false);

    useEffect(() => {
        const enableCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 360, frameRate: 24 }, // Optimización resolución
                    audio: true
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraReady(true);
                }
            } catch (err) {
                console.error("Camera error:", err);
            }
        };

        enableCamera();
        setMoods(getRandomMoods());
        const stored = localStorage.getItem("selected_interviewer");
        if (stored) setSelectedInterviewer(JSON.parse(stored));
    }, []);

    const speak = useCallback((text: string) => {
        if (!voiceEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => v.name.includes(selectedInterviewer?.voz || 'Google')) || voices[0];
        if (preferred) utterance.voice = preferred;
        window.speechSynthesis.speak(utterance);
    }, [voiceEnabled, selectedInterviewer]);

    const startInterview = async () => {
        if (hasStarted) return;
        setHasStarted(true);
        setIsLoading(true);
        try {
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: "Inicia la entrevista.",
                    moods,
                    personality: selectedInterviewer?.personalidad_prompt
                }),
            });
            const data = await res.json();
            setMessages([{ from: "ai", text: data.reply }]);
            speak(data.reply);

            import("posthog-js").then(ph => ph.default.capture("entrevista_iniciada", {
                interviewer: selectedInterviewer?.nombre,
                id: params.id
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const msg = input;
        setMessages(prev => [...prev, { from: "user", text: msg }]);
        setInput("");
        setIsLoading(true);
        try {
            const res = await fetch("/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg, moods, personality: selectedInterviewer?.personalidad_prompt }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { from: "ai", text: data.reply }]);
            speak(data.reply);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalize = async () => {
        setIsEvaluating(true);
        setShowEndModal(false);
        try {
            const res = await fetch("/api/evaluacion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages, moods, id: params.id }),
            });
            const evalData = await res.json();
            localStorage.setItem(`evaluation_${params.id}`, JSON.stringify(evalData));

            import("posthog-js").then(ph => ph.default.capture("entrevista_finalizada", {
                id: params.id,
                score: evalData.puntuacionGlobal
            }));

            // EMAIL INTEGRATION: Enviar resumen por email
            fetch("/api/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: "migue@example.com", // Aquí iría el email real del usuario
                    type: "evaluacion",
                    data: { id: params.id, puntuacion: evalData.puntuacionGlobal, resumen: evalData.resumenEjecutivo }
                })
            }).catch(e => console.error("Email error:", e));

            window.location.href = `/app/entrevistas/${params.id}/evaluacion`;
        } catch (err) {
            window.location.href = "/app/entrevistas";
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050505]">
            {isEvaluating && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center space-y-6">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">Generando Informe Final...</h2>
                </div>
            )}

            <div className="flex-1 flex items-center justify-center w-full relative z-0">
                <div className="w-full max-w-[600px] h-[60vh] animate-[scaleIn_0.8s_ease-out]">
                    <RiveAvatar />
                </div>
            </div>

            {/* Webcam Floating */}
            <div className={`absolute ${webcamPosition === 'bottom' ? 'bottom-28' : 'top-20'} right-8 z-30 transition-all duration-500`}>
                <div className="w-48 h-32 rounded-3xl border border-white/10 overflow-hidden bg-black shadow-2xl">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover grayscale opacity-60" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="absolute bottom-4 w-full max-w-2xl px-4 z-20 flex flex-col space-y-4">
                <div ref={chatRef} className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 p-6 rounded-[2.5rem] h-64 overflow-y-auto space-y-4">
                    {!hasStarted ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <button onClick={startInterview} className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-4 animate-pulse">
                                <Play className="w-8 h-8 text-emerald-500 fill-current" />
                            </button>
                            <p className="text-white font-black uppercase text-sm">{selectedInterviewer?.nombre || 'IA'} LISTO PARA COMENZAR</p>
                        </div>
                    ) : (
                        messages.map((m, i) => (
                            <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-5 py-3 rounded-2xl max-w-[90%] text-sm ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-emerald-400 font-medium'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex gap-3">
                    <textarea
                        className="flex-1 bg-zinc-900 border border-white/5 p-5 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="Tu respuesta..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={!hasStarted || isLoading}
                    />
                    <button onClick={sendMessage} className="w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center flex shadow-xl" disabled={!input.trim()}>
                        <Send className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Control Bar */}
            <div className="absolute bottom-0 w-full h-20 border-t border-white/5 bg-black/50 backdrop-blur-md flex items-center justify-between px-10">
                <div className="flex gap-4">
                    <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-3 rounded-xl ${voiceEnabled ? 'bg-blue-600/10 text-blue-500' : 'bg-zinc-800 text-zinc-600'}`}>
                        <Volume2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-xl ${isMuted ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-zinc-600'}`}>
                        <MicOff className="w-5 h-5" />
                    </button>
                </div>
                {hasStarted && (
                    <button onClick={handleFinalize} className="px-8 py-3 bg-red-600 text-white font-black rounded-xl text-[10px] uppercase">
                        Finalizar Sesión
                    </button>
                )}
            </div>

            <style jsx global>{`
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
    );
}
