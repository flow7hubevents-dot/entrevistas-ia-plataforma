"use client";

import { Video, Plus, Calendar, Star } from "lucide-react";
import Link from "next/link";

export default function InterviewsPage() {
    const interviews = [
        { id: "1", title: "Frontend Developer Junior", date: "14 Feb, 2026", score: "8.5", status: "Completada" },
        { id: "2", title: "FullStack Node.js Engineer", date: "12 Feb, 2026", score: "7.2", status: "Completada" },
        { id: "3", title: "UI/UX Designer Mock", date: "10 Feb, 2026", score: "9.1", status: "Completada" },
    ];

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Mis Entrevistas</h2>
                    <p className="text-zinc-400">Gestiona y revisa tus sesiones de práctica previas.</p>
                </div>
                <Link
                    href="/app/entrevistas/new-session"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Entrevista
                </Link>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {interviews.map((interview) => (
                    <div
                        key={interview.id}
                        className="group bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-800/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                <Video className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{interview.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-zinc-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {interview.date}
                                    </span>
                                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                        {interview.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Puntuación</p>
                                <div className="flex items-center gap-2 text-2xl font-black text-white">
                                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    {interview.score}
                                </div>
                            </div>
                            <Link
                                href={`/app/entrevistas/${interview.id}`}
                                className="bg-white/5 group-hover:bg-blue-600/10 border border-white/10 group-hover:border-blue-500/20 text-white py-3 px-6 rounded-xl font-bold transition-all"
                            >
                                Ver resultados
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
