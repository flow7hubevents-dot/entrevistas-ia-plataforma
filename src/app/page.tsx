"use client";

import Link from "next/link";
import {
    Rocket,
    ShieldCheck,
    Zap,
    MessageSquare,
    BarChart3,
    ChevronRight,
    Star,
    CheckCircle2,
    Sparkles,
    MousePointer2
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Script from "next/script";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingPage() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "¿Cómo funciona la IA de entrevistas?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Nuestra IA analiza tu lenguaje, tono y contenido técnico en tiempo real utilizando modelos avanzados como Gemini Pro."
                }
            },
            {
                "@type": "Question",
                "name": "¿Puedo descargar mis resultados?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, cada sesión genera un informe detallado en PDF con feedback accionable y KPIs de rendimiento."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-zinc-900 dark:text-white selection:bg-blue-500/30 overflow-x-hidden transition-colors duration-500">
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Script id="hotjar">
                {`
                    (function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:0,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                `}
            </Script>

            {/* Navigation */}
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/5 px-6 md:px-12 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20 text-white">AI</div>
                    <span className="text-xl font-black tracking-tighter uppercase outfit-font">EntrevistasPro</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    <a href="#features" className="hover:text-blue-500 transition-colors">Funciones</a>
                    <a href="#how-it-works" className="hover:text-blue-500 transition-colors">Método</a>
                    <a href="#pricing" className="hover:text-blue-500 transition-colors">Precios</a>
                </nav>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user ? (
                        <Link href="/app" className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg">
                            DASHBOARD
                        </Link>
                    ) : (
                        <Link href="/auth/register" className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                            EMPEZAR AHORA
                        </Link>
                    )}
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section className="relative pt-48 pb-32 px-6 md:px-12 flex flex-col items-center text-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 opacity-50"></div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-[fadeIn_0.5s_ease-out]">
                        <Sparkles className="w-3 h-3 fill-current" />
                        Next-Gen Artificial Intelligence
                    </div>

                    <h1 className="text-5xl md:text-[7rem] font-black tracking-tighter leading-[0.85] max-w-5xl mb-12 animate-[fadeIn_0.6s_ease-out_0.1s_both] uppercase outfit-font text-zinc-950 dark:text-white">
                        La IA que te prepara para el <span className="text-blue-600">Éxito Real.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mb-12 animate-[fadeIn_0.7s_ease-out_0.2s_both] leading-relaxed">
                        Entrevistas simuladas con análisis emocional, técnico y lingüístico. Recibe feedback instantáneo y domina tus nervios antes del día D.
                    </p>

                    <nav className="flex flex-col md:flex-row items-center gap-4 animate-[fadeIn_0.8s_ease-out_0.3s_both]">
                        <Link href="/auth/register" className="px-10 py-5 bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-blue-500 transition-all active:scale-95 shadow-2xl flex items-center gap-3 group">
                            EMPEZAR ENTRENAMIENTO
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/auth/login" className="px-10 py-5 bg-transparent border border-zinc-200 dark:border-white/10 text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-zinc-50 dark:hover:bg-white/5 transition-all flex items-center gap-2">
                            VER DEMO IA
                        </Link>
                    </nav>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Sincronía Vocal", desc: "TTS Avanzado que simula la entonación de un entrevistador real.", icon: MessageSquare, color: "text-blue-600" },
                            { title: "Deep Analysis", desc: "Reportes PDF detallados con puntos fuertes y áreas de mejora.", icon: ShieldCheck, color: "text-emerald-600" },
                            { title: "Live Insights", desc: "Visualización de tu progreso mediante KPIs y gráficas de tendencia.", icon: BarChart3, color: "text-purple-600" },
                            { title: "God Mode Admins", desc: "Herramientas de control total para empresas y reclutadores.", icon: Zap, color: "text-yellow-600" }
                        ].map((feature, i) => (
                            <div key={i} className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 p-10 rounded-[3rem] space-y-6 hover:shadow-2xl transition-all group border-b-4 border-b-transparent hover:border-b-blue-600">
                                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-900 dark:text-white">{feature.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing */}
                <section id="pricing" className="py-32 px-6 md:px-12 bg-zinc-50 dark:bg-white/5 border-y border-zinc-200 dark:border-white/5">
                    <div className="max-w-7xl mx-auto text-center space-y-16">
                        <header className="space-y-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase outfit-font text-zinc-900 dark:text-white">Escala tu potencial.</h2>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Elige un plan de entrenamiento</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { name: "Free", price: "$0", best: false },
                                { name: "Pro", price: "$19", best: true },
                                { name: "Enterprise", price: "$99", best: false }
                            ].map((plan, i) => (
                                <div key={i} className={`p-12 rounded-[3.5rem] border ${plan.best ? 'border-blue-600 bg-white dark:bg-blue-600/5 shadow-2xl' : 'border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/40'} flex flex-col items-center gap-6`}>
                                    <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">{plan.name}</h4>
                                    <div className="text-6xl font-black outfit-font text-zinc-900 dark:text-white">{plan.price}</div>
                                    <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${plan.best ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-zinc-900 dark:bg-white text-white dark:text-black'}`}>
                                        Seleccionar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-24 px-6 md:px-12 bg-white dark:bg-[#050505] border-t border-zinc-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center font-black text-xs text-white dark:text-black uppercase">AI</div>
                        <span className="text-xl font-black uppercase outfit-font text-zinc-900 dark:text-white">EntrevistasPro</span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <a href="#" className="hover:text-blue-500">Términos</a>
                        <a href="#" className="hover:text-blue-500">Privacidad</a>
                        <a href="#" className="hover:text-blue-500">Soporte</a>
                    </div>
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        © 2026 AI EntrevistasPro Ecosystem.
                    </div>
                </div>
            </footer>
        </div>
    );
}
