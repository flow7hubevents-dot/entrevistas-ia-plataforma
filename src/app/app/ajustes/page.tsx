"use client";

import { Bell, Lock, Globe, Eye } from "lucide-react";

export default function SettingsPage() {
    const sections = [
        { title: "Notificaciones", desc: "Configura cómo quieres recibir las alertas.", icon: Bell },
        { title: "Privacidad", desc: "Gestiona quién puede ver tu actividad.", icon: Lock },
        { title: "Idioma", desc: "Cambia el idioma de la plataforma.", icon: Globe },
        { title: "Apariencia", desc: "Personaliza el tema oscuro/claro.", icon: Eye },
    ];

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <header>
                <h2 className="text-3xl font-bold text-white">Ajustes</h2>
                <p className="text-zinc-400">Personaliza tu experiencia en la plataforma.</p>
            </header>

            <div className="space-y-4">
                {sections.map((section, i) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/5 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">
                                <section.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{section.title}</h3>
                                <p className="text-sm text-zinc-500">{section.desc}</p>
                            </div>
                        </div>
                        <div className="w-10 h-6 bg-zinc-800 rounded-full relative overflow-hidden">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-zinc-600 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
