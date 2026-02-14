"use client";

import { useEffect, useState } from "react";
import {
    Trophy,
    MessageSquare,
    Cpu,
    Lightbulb,
    CheckCircle2,
    XCircle,
    FileText,
    Download,
    ArrowLeft,
    Loader2
} from "lucide-react";
import Link from "next/link";

interface EvaluationData {
    puntuacionGlobal: number;
    comunicacion: number;
    conocimientosTecnicos: number;
    resolucionProblemas: number;
    puntosFuertes: string[];
    puntosDebiles: string[];
    recomendaciones: string;
    resumenEjecutivo: string;
}

export default function EvaluationPage({ params }: { params: { id: string } }) {
    const [data, setData] = useState<EvaluationData | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem(`evaluation_${params.id}`);
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, [params.id]);

    const handleDownloadPDF = async () => {
        if (!data) return;
        setIsDownloading(true);
        try {
            const response = await fetch("/api/evaluacion/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: params.id,
                    puntuacion_global: data.puntuacionGlobal,
                    comunicacion: data.comunicacion,
                    tecnica: data.conocimientosTecnicos,
                    resumen: data.resumenEjecutivo,
                    puntos_fuertes: data.puntosFuertes.join(", "),
                    puntos_debiles: data.puntosDebiles.join(", "),
                    recomendaciones: data.recomendaciones
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `evaluacion-${params.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();

                import("posthog-js").then(ph => ph.default.capture("pdf_descargado", {
                    id: params.id,
                    score: data.puntuacionGlobal
                }));
            }
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (!data) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <div className="w-full max-w-6xl space-y-12">
                    <div className="h-8 w-64 bg-zinc-900 rounded-lg animate-pulse"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="h-64 bg-zinc-900 rounded-[2.5rem] animate-pulse"></div>
                        <div className="lg:col-span-2 h-64 bg-zinc-900 rounded-[2.5rem] animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="h-48 bg-zinc-900 rounded-[2.5rem] animate-pulse"></div>
                        <div className="h-48 bg-zinc-900 rounded-[2.5rem] animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    const radialCharts = [
        { label: "Comunicación", value: data.comunicacion, icon: MessageSquare, color: "stroke-blue-500", text: "text-blue-500" },
        { label: "Técnico", value: data.conocimientosTecnicos, icon: Cpu, color: "stroke-emerald-500", text: "text-emerald-500" },
        { label: "Lógica", value: data.resolucionProblemas, icon: Lightbulb, color: "stroke-purple-500", text: "text-purple-500" },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 space-y-10 max-w-6xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <Link href="/app/entrevistas" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Volver a mis entrevistas
                    </Link>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent uppercase tracking-tighter">
                        Resultado de Evaluación
                    </h1>
                    <p className="text-zinc-500 font-medium">Análisis generado por IA basado en tu desempeño en la sesión #{params.id}.</p>
                </div>
                <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-8 py-4 bg-white text-black font-black uppercase text-xs rounded-2xl hover:bg-zinc-200 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                    {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    {isDownloading ? "Generando..." : "Descargar PDF"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-zinc-900/40 border border-white/5 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors pointer-events-none"></div>
                    <div className="relative">
                        <Trophy className="w-16 h-16 text-yellow-500 mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
                        <div className="text-8xl font-black tracking-tighter">{data.puntuacionGlobal}</div>
                        <div className="text-zinc-600 font-black uppercase tracking-widest text-[10px] mt-2">Score Global / 100</div>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                        Has demostrado un rendimiento {data.puntuacionGlobal > 80 ? 'excepcional' : data.puntuacionGlobal > 60 ? 'sólido' : 'con gran margen de mejora'} en esta sesión técnica.
                    </p>
                </div>

                <div className="lg:col-span-2 bg-zinc-900/20 border border-white/5 p-8 rounded-[3rem] grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {radialCharts.map((chart, i) => (
                        <div key={i} className="flex flex-col items-center space-y-4">
                            <div className="relative w-36 h-36">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                                    <circle
                                        cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="8" fill="transparent"
                                        strokeDasharray={402} strokeDashoffset={402 - (402 * chart.value) / 100}
                                        className={`${chart.color} transition-all duration-1000 ease-out`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <chart.icon className={`w-5 h-5 ${chart.text} opacity-30 mb-1`} />
                                    <span className="text-2xl font-black">{chart.value}%</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{chart.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-10 rounded-[3rem] space-y-8">
                    <h3 className="text-sm font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" />
                        Fortalezas Detectadas
                    </h3>
                    <ul className="space-y-5">
                        {data.puntosFuertes.map((point, i) => (
                            <li key={i} className="flex gap-4 text-zinc-400 font-medium">
                                <span className="w-6 h-6 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-500 text-[10px] font-black mt-0.5 border border-emerald-500/20">
                                    {i + 1}
                                </span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-red-500/5 border border-red-500/10 p-10 rounded-[3rem] space-y-8">
                    <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-3">
                        <XCircle className="w-5 h-5" />
                        Áreas Críticas de Mejora
                    </h3>
                    <ul className="space-y-5">
                        {data.puntosDebiles.map((point, i) => (
                            <li key={i} className="flex gap-4 text-zinc-400 font-medium">
                                <span className="w-6 h-6 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0 text-red-500 text-[10px] font-black mt-0.5 border border-red-500/20">
                                    {i + 1}
                                </span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 p-12 rounded-[3.5rem] space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Análisis Ejecutivo de la IA</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-xl font-medium italic border-l-4 border-blue-500/50 pl-8 py-2">
                    "{data.resumenEjecutivo}"
                </p>
                <div className="pt-8 border-t border-white/5">
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Recomendación Estratégica</h4>
                    <p className="text-zinc-500 text-sm font-bold leading-relaxed">{data.recomendaciones}</p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
