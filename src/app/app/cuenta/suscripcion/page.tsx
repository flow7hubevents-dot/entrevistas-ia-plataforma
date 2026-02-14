"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Zap,
    Crown,
    Rocket,
    Settings,
    CreditCard,
    ExternalLink,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const currentPlan = profile?.plan || "free";

    const plansInfo: Record<string, any> = {
        free: { icon: Rocket, name: "Free", color: "from-zinc-500 to-zinc-700", desc: "Plan básico de prueba" },
        pro: { icon: Zap, name: "Pro", color: "from-blue-500 to-indigo-600", desc: "Plan profesional de práctica intensa" },
        premium: { icon: Crown, name: "Premium", color: "from-emerald-500 to-teal-600", desc: "Máximo rendimiento corporativo" },
    };

    const plan = plansInfo[currentPlan];

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white">Suscripción</h2>
                    <p className="text-zinc-500 font-medium tracking-tight">Gestiona tu plan y el acceso a las funciones premium.</p>
                </div>
                <Link
                    href="/upgrade"
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-white font-bold transition-all active:scale-95 flex items-center gap-2"
                >
                    Ver todos los planes
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </header>

            {/* Current Plan Card */}
            <div className={`bg-gradient-to-br ${plan.color} p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10`}>
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-white/10 rotate-12 blur-3xl pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-8 text-white">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
                        <plan.icon className="w-12 h-12" />
                    </div>
                    <div>
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                            Plan Activo
                        </div>
                        <h3 className="text-4xl font-black tracking-tight">{plan.name}</h3>
                        <p className="text-white/80 font-medium mt-1">{plan.desc}</p>
                    </div>
                </div>

                <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
                    {currentPlan === 'free' ? (
                        <Link href="/upgrade" className="px-8 py-4 bg-white text-black font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-center">
                            Mejorar a Pro ahora
                        </Link>
                    ) : (
                        <button className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-black rounded-2xl hover:bg-white/30 transition-all">
                            Gestionar en Stripe
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white tracking-tight">Facturación</h4>
                            <p className="text-zinc-500 text-sm mt-1">Revisa tus facturas anteriores y actualiza tus datos de pago.</p>
                        </div>
                    </div>
                    <Link href="/cuenta/facturacion" className="mt-8 text-blue-400 font-bold flex items-center gap-2 hover:underline">
                        Gestionar facturas
                        <ExternalLink className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                            <Settings className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-white tracking-tight">Atención al Cliente</h4>
                            <p className="text-zinc-500 text-sm mt-1">¿Tienes problemas con tu suscripción? Nuestro equipo está aquí.</p>
                        </div>
                    </div>
                    <button className="mt-8 text-emerald-400 font-bold flex items-center gap-2 hover:underline text-left">
                        Contactar soporte
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
