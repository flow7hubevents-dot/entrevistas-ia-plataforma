"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
    BarChart3,
    TrendingUp,
    Target,
    Clock,
    BrainCircuit,
    Sparkles,
    ShieldCheck,
    AlertCircle,
    Zap,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Optimización: Carga diferida de secciones pesadas
const AIInsightsDetail = dynamic(() => import("./AIInsightsDetail"), {
    loading: () => <Skeleton className="h-[400px] w-full rounded-[3rem]" />
});

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const [evals, setEvals] = useState<any[]>([]);
    const [insights, setInsights] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', user.id)
                .single();

            if (!profile || (profile.plan !== 'pro' && profile.plan !== 'premium')) {
                setAuthorized(false);
                setLoading(false);
                return;
            }

            setAuthorized(true);

            // Caching: Intentar leer de sessionStorage primero
            const cachedInsights = sessionStorage.getItem(`insights_${user.id}`);
            if (cachedInsights) {
                setInsights(JSON.parse(cachedInsights));
            }

            const [evalsRes, insightsRes] = await Promise.all([
                supabase.from('evaluaciones').select('*').order('created_at', { ascending: true }),
                fetch('/api/analiticas/insights').then(res => res.json())
            ]);

            if (evalsRes.data) setEvals(evalsRes.data);
            if (insightsRes && !insightsRes.error) {
                setInsights(insightsRes);
                sessionStorage.setItem(`insights_${user.id}`, JSON.stringify(insightsRes));
            }

            setLoading(false);
        }
        init();
    }, []);

    const averageScore = useMemo(() => {
        if (evals.length === 0) return "0";
        return (evals.reduce((acc, curr) => acc + curr.puntuacion_global, 0) / evals.length).toFixed(1);
    }, [evals]);

    if (loading) {
        return (
            <div className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto">
                <div className="space-y-4">
                    <Skeleton className="h-12 w-96 rounded-2xl" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-[2rem]" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Skeleton className="lg:col-span-2 h-80 rounded-[2.5rem]" />
                    <Skeleton className="h-80 rounded-[2.5rem]" />
                </div>
            </div>
        );
    }

    if (!authorized) {
        return (
            <div className="p-12 max-w-4xl mx-auto text-center space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <div className="w-24 h-24 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-blue-500">
                    <ShieldCheck className="w-12 h-12" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight">Módulo de Analíticas <span className="text-blue-500">Exclusivo PRO</span></h2>
                    <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium">Desbloquea tendencias generadas por IA y seguimiento de progreso detallado.</p>
                </div>
                <Link href="/app/upgrade" className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-2xl active:scale-95">
                    <Zap className="w-5 h-5 fill-current" />
                    Actualizar ahora
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
                        <BrainCircuit className="w-4 h-4" />
                        AI Enhanced Analytics
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Panel de Rendimiento</h1>
                </div>
                {insights && (
                    <div className="bg-zinc-900/40 border border-white/5 px-6 py-4 rounded-2xl flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">Nivel Proyectado</p>
                            <div className="text-white font-black text-lg">{insights.prediccionNivelFuturo}</div>
                        </div>
                        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                )}
            </header>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Puntuación Media", value: averageScore, icon: Target, color: "text-blue-500", trend: insights?.kpis?.mejoraPuntuacion || "+0%" },
                    { label: "Sesiones (Mes)", value: evals.length, icon: BarChart3, color: "text-emerald-500", trend: "+12%" },
                    { label: "Habilidad Top", value: "Técnica", icon: Sparkles, color: "text-purple-500", trend: "Estable" },
                    { label: "Velocidad Respuesta", value: "3.2s", icon: Clock, color: "text-yellow-500", trend: "-0.5s" }
                ].map((kpi, i) => (
                    <div key={i} className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2rem] space-y-4 hover:border-white/10 transition-colors group">
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${kpi.color}`}>
                                <kpi.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black px-2 py-1 bg-white/5 rounded-md text-zinc-500 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                {kpi.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">{kpi.label}</p>
                            <h4 className="text-3xl font-black text-white">{kpi.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Evolución de Puntuación</h3>
                    <div className="h-64 flex items-end justify-between gap-1 relative pt-12">
                        <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-20 pointer-events-none">
                            {[100, 75, 50, 25, 0].map(val => (
                                <div key={val} className="border-t border-white/20 w-full flex items-center text-[8px] font-bold text-zinc-400">{val}</div>
                            ))}
                        </div>
                        {evals.length > 1 ? (
                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d={`M 0 100 ${evals.map((e, i) => `L ${(i / (evals.length - 1)) * 100} ${100 - e.puntuacion_global}`).join(' ')} L 100 100 Z`}
                                    fill="url(#lineGrad)" className="animate-[fadeSlideUp_1s_ease-out]"
                                />
                                <path
                                    d={evals.map((e, i) => `${i === 0 ? 'M' : 'L'} ${(i / (evals.length - 1)) * 100} ${100 - e.puntuacion_global}`).join(' ')}
                                    fill="none" stroke="#3b82f6" strokeWidth="2" className="animate-[growLine_1.5s_ease-out]"
                                />
                            </svg>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-sm font-medium">Realiza más sesiones para ver tu progreso</div>
                        )}
                    </div>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 p-10 rounded-[2.5rem] space-y-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Balance de Skills</h3>
                    <div className="space-y-6">
                        {[
                            { label: "Comunicación", value: evalAverage(evals, 'comunicacion'), color: "bg-blue-500" },
                            { label: "Conocimiento Técnico", value: evalAverage(evals, 'tecnica'), color: "bg-emerald-500" },
                            { label: "Resolución Prob.", value: evalAverage(evals, 'resolucion'), color: "bg-purple-500" }
                        ].map((skill, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-black text-zinc-500 uppercase tracking-widest">
                                    <span>{skill.label}</span>
                                    <span>{skill.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${skill.color} transition-all duration-1000 ease-out`} style={{ width: `${skill.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {insights && <AIInsightsDetail insights={insights} />}

            <style jsx global>{`
                @keyframes growLine { from { stroke-dasharray: 500; stroke-dashoffset: 500; } to { stroke-dasharray: 500; stroke-dashoffset: 0; } }
            `}</style>
        </div>
    );
}

function evalAverage(arr: any[], key: string) {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, curr) => acc + (curr[key] || 0), 0);
    return Math.round(sum / arr.length);
}
