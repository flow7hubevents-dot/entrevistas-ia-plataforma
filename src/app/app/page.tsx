"use client";

import { Video, Trophy, Calendar, Clock } from "lucide-react";
import Link from "next/link";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
    const [userName, setUserName] = useState("Juan");
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.full_name) {
                setUserName(user.user_metadata.full_name);
            } else if (user?.email) {
                setUserName(user.email.split('@')[0]);
            }
        };
        getUser();
    }, []);

    const stats = [
        { label: "Entrevistas realizadas", value: "12", icon: Video, color: "text-blue-400" },
        { label: "Puntuación media", value: "85%", icon: Trophy, color: "text-emerald-400" },
        { label: "Horas de práctica", value: "24h", icon: Clock, color: "text-purple-400" },
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">¡Bienvenido de nuevo, {userName}!</h2>
                <p className="text-zinc-400 text-lg">Aquí tienes un resumen de tu progreso esta semana.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-zinc-400 font-medium">{stat.label}</span>
                        </div>
                        <div className="text-4xl font-bold">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Quick Action Card */}
                <div className="bg-gradient-to-br from-blue-600/20 to-emerald-600/20 border border-white/10 p-8 rounded-3xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">¿Listo para practicar?</h3>
                        <p className="text-zinc-300">Inicia una nueva simulación de entrevista con nuestra IA para mejorar tus habilidades de comunicación.</p>
                    </div>
                    <Link
                        href="/app/entrevistas"
                        className="mt-8 bg-white text-black font-bold py-4 px-8 rounded-xl text-center hover:bg-zinc-200 transition-colors w-full"
                    >
                        Comenzar nueva entrevista
                    </Link>
                </div>

                {/* Recent Activity placeholder */}
                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white">Actividad Reciente</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                                        <Video className="w-5 h-5 text-zinc-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Entrevista Tech Lead</p>
                                        <p className="text-xs text-zinc-500">Hace 2 días • 15 min</p>
                                    </div>
                                </div>
                                <div className="text-emerald-400 font-bold">8.2/10</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
