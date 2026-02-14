"use client";

import { useEffect, useState } from "react";
import {
    Video,
    Calendar,
    Search,
    Filter,
    Star,
    ExternalLink,
    ChevronRight,
    User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminInterviewsPage() {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchInterviews() {
            const { data, error } = await supabase
                .from('evaluaciones')
                .select(`
                *,
                profiles:user_id(full_name, email)
            `)
                .order('created_at', { ascending: false });

            if (!error) setInterviews(data);
            setLoading(false);
        }
        fetchInterviews();
    }, []);

    if (loading) return <div className="p-12 text-center text-zinc-500 animate-pulse">Cargando registro de entrevistas...</div>;

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Registro de Entrevistas</h1>
                    <p className="text-zinc-500 font-medium">Monitorea el uso de la IA y el desempeño de los candidatos.</p>
                </div>
                <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-zinc-600 tracking-widest">Total histórico</p>
                        <p className="text-white font-black text-xl">{interviews.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                        <Video className="w-5 h-5" />
                    </div>
                </div>
            </header>

            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-zinc-500">
                            <th className="px-8 py-6">Candidato</th>
                            <th className="px-8 py-6">Fecha</th>
                            <th className="px-8 py-6">Puntuación</th>
                            <th className="px-8 py-6">ID Sesión</th>
                            <th className="px-8 py-6 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {interviews.map((item, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-zinc-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-tight">{item.profiles?.full_name || 'Usuario'}</p>
                                            <p className="text-xs text-zinc-600">{item.profiles?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xs text-zinc-400 font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(item.created_at).toLocaleString()}
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <Star className={`w-4 h-4 ${item.puntuacion_global > 70 ? 'text-emerald-500 fill-emerald-500' : 'text-yellow-500 fill-yellow-500'}`} />
                                        <span className="text-lg font-black text-white">{item.puntuacion_global}</span>
                                        <span className="text-xs text-zinc-600">/100</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <code className="text-[10px] text-zinc-600 bg-white/5 px-2 py-1 rounded">#{item.entrevista_id}</code>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <Link
                                        href={`/app/entrevistas/${item.entrevista_id}/evaluacion`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all border border-white/5"
                                    >
                                        Ver Informe
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
