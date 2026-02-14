"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Check,
    Zap,
    Crown,
    Rocket,
    ShieldCheck,
    Star,
    Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    const handleUpgrade = async (plan: string) => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        setLoading(plan);
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    userEmail: user.email,
                    planId: plan,
                }),
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert("Error al iniciar el pago: " + (data.error || "Desconocido"));
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        } finally {
            setLoading(null);
        }
    };

    const plans = [
        {
            name: "Free",
            id: "free",
            price: "$0",
            description: "Ideal para probar la IA",
            features: [
                "3 entrevistas al mes",
                "Avatar Rive básico",
                "Feedback instantáneo",
                "Historial limitado"
            ],
            icon: Rocket,
            color: "bg-zinc-800",
            buttonText: "Plan Actual"
        },
        {
            name: "Pro",
            id: "pro",
            price: "$19",
            period: "/mes",
            description: "Para los que buscan empleo en serio",
            features: [
                "Entrevistas ilimitadas",
                "Voces avanzadas de IA",
                "Evaluaciones detalladas",
                "Soporte prioritario",
                "Análisis de KPIs"
            ],
            icon: Zap,
            color: "bg-blue-600",
            bestSeller: true,
            buttonText: "Mejorar a Pro"
        },
        {
            name: "Premium",
            id: "premium",
            price: "$49",
            period: "/mes",
            description: "Nivel experto para ejecutivos",
            features: [
                "Todo lo del Plan Pro",
                "IA personalizada por sector",
                "Simulación de comités",
                "Sesiones grabadas",
                "Consultoría humana 1:1"
            ],
            icon: Crown,
            color: "bg-emerald-600",
            buttonText: "Ser Premium"
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] p-8 md:p-16 space-y-12 max-w-7xl mx-auto">
            <div className="text-center space-y-4 max-w-2xl mx-auto animate-[fadeIn_0.5s_ease-out]">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-4">
                    <Star className="w-3 h-3 fill-current" />
                    Precios Transparentes
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight">Potencia tu carrera profesional</h1>
                <p className="text-zinc-500 text-lg font-medium">Practica sin límites con los planes más avanzados de IA corporativa.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <div
                        key={i}
                        className={`relative flex flex-col bg-zinc-900/40 backdrop-blur-2xl border ${plan.bestSeller ? 'border-blue-500/50 scale-105 z-10' : 'border-white/5'} p-10 rounded-[2.5rem] shadow-2xl transition-all hover:translate-y-[-8px] animate-[bubbleIn_0.4s_ease-out] [animation-delay:${i * 0.1}s]`}
                    >
                        {plan.bestSeller && (
                            <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                <Sparkles className="w-3 h-3" />
                                Más Popular
                            </div>
                        )}

                        <div className="space-y-6 flex-1">
                            <div className="flex items-center justify-between">
                                <div className={`p-4 rounded-3xl ${plan.color} bg-opacity-10 text-white`}>
                                    <plan.icon className={`w-8 h-8 ${plan.id !== 'free' ? 'text-' + plan.color.split('-')[1] + '-400' : ''}`} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                                <p className="text-zinc-500 text-sm mt-1">{plan.description}</p>
                            </div>

                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-white">{plan.price}</span>
                                {plan.period && <span className="text-zinc-500 font-bold">{plan.period}</span>}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                                        <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                                            <Check className={`w-3 h-3 ${plan.id !== 'free' ? 'text-' + plan.color.split('-')[1] + '-400' : 'text-zinc-500'}`} />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => plan.id !== 'free' && handleUpgrade(plan.id)}
                            disabled={plan.id === 'free' || loading !== null}
                            className={`w-full mt-10 py-5 rounded-3xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 ${plan.id === 'free'
                                    ? 'bg-zinc-800 text-zinc-500 cursor-default'
                                    : plan.bestSeller
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20'
                                        : 'bg-white text-black hover:bg-zinc-200 shadow-xl'
                                }`}
                        >
                            {loading === plan.id ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900/20 border border-white/5 p-12 rounded-[3rem] mt-16 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        Garantía de Satisfacción
                    </h4>
                    <p className="text-zinc-500 font-medium">Si no estás satisfecho con tu primera entrevista Pro, te devolvemos el dinero en 24h.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <div className="text-xl font-black text-white">99.9%</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Uptime IA</div>
                    </div>
                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <div className="text-xl font-black text-white">24/7</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Soporte</div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
