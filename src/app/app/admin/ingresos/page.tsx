"use client";

import { useEffect, useState } from "react";
import {
    CreditCard,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    BarChart3,
    Calendar,
    Layers,
    CheckCircle2
} from "lucide-react";

export default function AdminRevenuePage() {
    // Simulación de datos de ingresos
    const subscriptions = [
        { id: "sub_1", user: "migue@test.com", plan: "Pro", amount: "$19.00", status: "Active", date: "Hoy" },
        { id: "sub_2", user: "juan@dev.io", plan: "Premium", amount: "$49.00", status: "Active", date: "Ayer" },
        { id: "sub_3", user: "dev@ai.com", plan: "Pro", amount: "$19.00", status: "Past Due", date: "Hace 2 días" },
    ];

    const planStats = [
        { plan: "Free", count: 840, perc: 65, color: "bg-zinc-700" },
        { plan: "Pro", count: 320, perc: 25, color: "bg-blue-600" },
        { plan: "Premium", count: 120, perc: 10, color: "bg-emerald-600" },
    ];

    return (
        <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Métricas de Ingresos</h1>
                    <p className="text-zinc-500 font-medium">Análisis detallado de suscripciones y flujo de caja.</p>
                </div>
                <div className="bg-emerald-600 px-8 py-4 rounded-[2rem] text-white flex items-center gap-6 shadow-2xl shadow-emerald-900/30">
                    <div>
                        <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">Ingresos Totales (LTM)</p>
                        <h4 className="text-3xl font-black">$148,450.00</h4>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Placeholder */}
                <div className="lg:col-span-2 bg-zinc-900 border border-white/5 p-10 rounded-[3rem] space-y-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Crecimiento MRR</h3>
                        <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                            <ArrowUpRight className="w-4 h-4" />
                            +14.2% mes anterior
                        </div>
                    </div>
                    <div className="h-64 flex items-end gap-3 pt-12">
                        {[40, 55, 45, 70, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 space-y-4 group">
                                <div className="relative w-full h-full flex items-end">
                                    <div
                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl transition-all duration-1000 group-hover:from-blue-500"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block text-center">Mes {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribution by Plan */}
                <div className="bg-zinc-900 border border-white/5 p-10 rounded-[3rem] space-y-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Distribución de Usuarios</h3>
                    <div className="space-y-8">
                        {planStats.map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-widest">{item.plan}</p>
                                        <p className="text-[10px] text-zinc-600 font-bold">{item.count} Usuarios</p>
                                    </div>
                                    <span className="text-sm font-black text-white">{item.perc}%</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} transition-all duration-1000`}
                                        style={{ width: `${item.perc}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-white/5">
                        <p className="text-xs text-zinc-500 leading-relaxed font-bold">
                            La tasa de conversión de Free a Pro ha subido un 2.1% en las últimas 24 horas.
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 space-y-10">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Últimas Suscripciones</h3>
                    <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">Ver todas</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptions.map((sub, i) => (
                        <div key={i} className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] space-y-6 hover:border-blue-500/20 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                                    <CreditCard className="w-5 h-5 text-zinc-600 group-hover:text-blue-500" />
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${sub.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {sub.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-lg font-black text-white">{sub.amount}</p>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Plan {sub.plan}</p>
                            </div>
                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                <p className="text-xs text-zinc-500 font-medium truncate max-w-[120px]">{sub.user}</p>
                                <p className="text-[10px] text-zinc-700 font-black uppercase">{sub.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
