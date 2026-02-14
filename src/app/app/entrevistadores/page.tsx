"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Users,
    Search,
    Briefcase,
    Cpu,
    Zap,
    ShieldCheck,
    Star,
    ChevronRight,
    User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const INTERVIEWERS_DATA = [
    {
        id: "1",
        nombre: "Sarah Tech",
        especialidad: "Técnico",
        dificultad: "Alto",
        descripcion: "Especialista en arquitecturas frontend y algoritmos complejos.",
        plan_requerido: "premium",
        avatar_url: "/avatars/sarah.jpg",
        voz: "Google Español",
        personalidad_prompt: "Eres Sarah Tech, una ingeniera de software senior muy exigente. Te enfocas en la optimización de código."
    },
    {
        id: "2",
        nombre: "Marco HR",
        especialidad: "RRHH",
        dificultad: "Medio",
        descripcion: "Enfocado en cultura, valores y soft skills.",
        plan_requerido: "free",
        avatar_url: "/avatars/marco.jpg",
        voz: "Microsoft Helena",
        personalidad_prompt: "Eres Marco de RRHH, un seleccionador empático pero observador."
    },
    {
        id: "3",
        nombre: "Alejandra CEO",
        especialidad: "Negocio",
        dificultad: "Alto",
        descripcion: "Entrevistas para puestos estratégicos y liderazgo.",
        plan_requerido: "pro",
        avatar_url: "/avatars/alejandra.jpg",
        voz: "Google Español (Mujer)",
        personalidad_prompt: "Eres Alejandra, la CEO de una startup unicornio."
    },
    {
        id: "4",
        nombre: "David Sales",
        especialidad: "Ventas",
        dificultad: "Bajo",
        descripcion: "Perfecto para practicar tu pitch comercial inicial.",
        plan_requerido: "free",
        avatar_url: "/avatars/david.jpg",
        voz: "Google Español (Hombre)",
        personalidad_prompt: "Eres David, un manager de ventas dinámico y enérgico."
    },
    {
        id: "5",
        nombre: "Elena Cybersecurity",
        especialidad: "Seguridad",
        dificultad: "Alto",
        descripcion: "Auditoría técnica rigurosa de seguridad y redes.",
        plan_requerido: "premium",
        avatar_url: "/avatars/elena.jpg",
        voz: "Microsoft Sabina",
        personalidad_prompt: "Eres Elena, experta en Ciberseguridad."
    },
    {
        id: "6",
        nombre: "Roberto Project Mgr",
        especialidad: "Gestión",
        dificultad: "Medio",
        descripcion: "Evaluación de metodologías ágiles y gestión de plazos.",
        plan_requerido: "pro",
        avatar_url: "/avatars/roberto.jpg",
        voz: "Google Español (Hombre 2)",
        personalidad_prompt: "Eres Roberto, un Project Manager Senior."
    }
];

export default function InterviewersMarketplace() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSpecialty, setFilterSpecialty] = useState("all");
    const [filterDifficulty, setFilterDifficulty] = useState("all");
    const [userPlan, setUserPlan] = useState("free");
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        async function checkPlan() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
                if (profile) setUserPlan(profile.plan);
            }
            setLoading(false);
        }
        checkPlan();
    }, []);

    const filtered = useMemo(() => {
        return INTERVIEWERS_DATA.filter(i => {
            const matchesSearch = i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || i.especialidad.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSpecialty = filterSpecialty === "all" || i.especialidad === filterSpecialty;
            const matchesDifficulty = filterDifficulty === "all" || i.dificultad === filterDifficulty;
            return matchesSearch && matchesSpecialty && matchesDifficulty;
        });
    }, [searchTerm, filterSpecialty, filterDifficulty]);

    const handleSelect = (interviewer: any) => {
        const planHierarchy = { 'free': 0, 'pro': 1, 'premium': 2 };
        const userLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
        const requiredLevel = planHierarchy[interviewer.plan_requerido as keyof typeof planHierarchy] || 0;

        if (userLevel < requiredLevel) {
            import("posthog-js").then(ph => ph.default.capture("upgrade_click", { from: "marketplace", required_plan: interviewer.plan_requerido }));
            router.push("/app/upgrade");
            return;
        }

        import("posthog-js").then(ph => ph.default.capture("entrevistador_seleccionado", {
            name: interviewer.nombre,
            specialty: interviewer.especialidad,
            plan: interviewer.plan_requerido
        }));

        localStorage.setItem("selected_interviewer", JSON.stringify(interviewer));
        router.push("/app/entrevistas/new-session");
    };

    if (loading) {
        return (
            <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
                <Skeleton className="h-20 w-full rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-80 rounded-[3rem]" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Users className="w-4 h-4" />
                        Interviewer Marketplace
                    </div>
                    <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-tight">Elige a tu <span className="text-blue-500">Oponente</span></h1>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            placeholder="Buscar por nombre..."
                            className="w-full bg-zinc-900 border border-white/5 py-4 pl-12 pr-6 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/30 text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select className="bg-zinc-900 border border-white/5 py-4 px-6 rounded-2xl text-sm text-zinc-400" onChange={(e) => setFilterSpecialty(e.target.value)}>
                            <option value="all">Especialidad</option>
                            <option value="Técnico">Técnico</option>
                            <option value="RRHH">RRHH</option>
                            <option value="Negocio">Negocio</option>
                        </select>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((interviewer) => (
                    <div
                        key={interviewer.id}
                        onClick={() => handleSelect(interviewer)}
                        className="group relative bg-zinc-900/40 border border-white/5 p-8 rounded-[3rem] space-y-8 hover:bg-zinc-800/50 hover:border-blue-500/30 transition-all duration-500 cursor-pointer overflow-hidden transform hover:-translate-y-2 shadow-2xl"
                    >
                        <div className="flex items-start justify-between">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-zinc-800 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-500">
                                <UserIcon className="w-10 h-10 text-zinc-600" />
                            </div>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${interviewer.plan_requerido === 'free' ? 'text-zinc-500 border-white/5' : interviewer.plan_requerido === 'pro' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'}`}>
                                {interviewer.plan_requerido}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white tracking-tight">{interviewer.nombre}</h3>
                            <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                                {interviewer.especialidad === 'Técnico' ? <Cpu className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                {interviewer.especialidad}
                            </div>
                        </div>

                        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{interviewer.descripcion}</p>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">Seleccionar Perfil</span>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
                                <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
