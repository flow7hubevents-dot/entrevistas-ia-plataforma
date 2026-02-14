"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Video,
    DollarSign,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ShieldAlert,
    BarChart3,
    Calendar
} from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then(res => res.json())
            .then(data => {
                if (!data.error) setStats(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 font-medium">Cargando métricas globales...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="p-12 text-center space-y-4">
                <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
                <h2 className="text-2xl font-black text-white">ACCESO DENEGADO</h2>
                <p className="text-zinc-500">No tienes permisos de administrador para ver esta sección.</p>
            </div>
        );
    }

    const kpis = [
        { label: "Total Usuarios", value: stats.totalUsuarios, icon: Users, color: "text-blue-500", trend: "+12%" },
        { label: "Activos este mes", value: stats.usuariosActivosMes, icon: Activity, color: "text-emerald-500", trend: "+8%" },
        { label: "Entrevistas realizadas", value: stats.totalEntrevistas, icon: Video, color: "text-purple-500", trend: "+24%" },
        { label: "Ingresos (MRR)", value: `$${stats.ingresosMensuales.toLocaleString()}`, icon: DollarSign, color: "text-yellow-500", trend: "+15%" },
    ];

    return (
        <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            <header className="flex items-end justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
                        <ShieldAlert className="w-4 h-4" />
                        ADMIN CONTROL PANEL
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Vista General</h1>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado del Sistema</p>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        OPERATIVO
                    </div>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-zinc-900 shadow-2xl border border-white/5 p-8 rounded-[2.5rem] space-y-6 hover:border-white/10 transition-colors group">
                        <div className="flex items-center justify-between">
                            <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${kpi.color}`}>
                                <kpi.icon className="w-7 h-7" />
                            </div>
                            <div className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                {kpi.trend}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-zinc-600 tracking-[0.2em] mb-1">{kpi.label}</p>
                            <h4 className="text-3xl font-black text-white">{kpi.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ingresos Chart */}
                <div className="bg-zinc-900 border border-white/5 p-10 rounded-[3rem] space-y-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Ingresos Mensuales</h3>
                        <BarChart3 className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-4">
                        {stats.ingresosPorMes.map((item: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="relative w-full">
                                    <div
                                        className="w-full bg-blue-600 rounded-xl transition-all duration-1000 group-hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                                        style={{ height: `${(item.ingresos / 15000) * 100}%` }}
                                    />
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-black px-2 py-1 rounded mb-2">
                                        ${item.ingresos}
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.mes}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Usuarios Chart */}
                <div className="bg-[#050505] border border-white/5 p-10 rounded-[3rem] space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10"></div>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Crecimiento de Usuarios</h3>
                        <TrendingUp className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 relative">
                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                            <polyline
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="3"
                                points={stats.crecimientoUsuarios.map((u: any, i: number) =>
                                    `${(i / (stats.crecimientoUsuarios.length - 1)) * 100}% , ${100 - (u.usuarios / 1500) * 100}%`
                                ).join(' ')}
                            />
                        </svg>
                        {stats.crecimientoUsuarios.map((u: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 pt-20">
                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{u.mes}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
