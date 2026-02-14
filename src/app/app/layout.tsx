import Link from "next/link";
import {
    LayoutDashboard,
    Video,
    BarChart3,
    Settings,
    UserCircle,
    Search,
    Menu,
    ShieldAlert,
    Users,
    CreditCard,
    Zap
} from "lucide-react";

import UserSidebar from "@/components/layout/UserSidebar";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        isAdmin = profile?.role === 'admin';
    }

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-zinc-100 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-950 border-r border-white/5 flex flex-col shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        AI Entrevistas
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4 mb-2">Menú Principal</div>
                    <Link
                        href="/app"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        <LayoutDashboard className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                        <span className="font-medium text-zinc-300 group-hover:text-white">Dashboard</span>
                    </Link>

                    <Link
                        href="/app/entrevistas"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        <Video className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                        <span className="font-medium text-zinc-300 group-hover:text-white">Entrevistas</span>
                    </Link>

                    <Link
                        href="/app/entrevistadores"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        <Users className="w-5 h-5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                        <span className="font-medium text-zinc-300 group-hover:text-white">Entrevistadores</span>
                    </Link>

                    <Link
                        href="/app/analiticas"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        <BarChart3 className="w-5 h-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
                        <span className="font-medium text-zinc-300 group-hover:text-white">Analíticas</span>
                    </Link>

                    {isAdmin && (
                        <div className="pt-6 space-y-2">
                            <div className="text-[10px] font-black text-red-500/50 uppercase tracking-widest px-4 mb-2">Administración</div>
                            <Link
                                href="/app/admin"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/5 transition-colors group"
                            >
                                <ShieldAlert className="w-5 h-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
                                <span className="font-medium text-zinc-400 group-hover:text-white">Panel Admin</span>
                            </Link>
                            <Link
                                href="/app/admin/godmode"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/5 transition-colors group"
                            >
                                <Zap className="w-5 h-5 text-emerald-900 group-hover:text-emerald-500 transition-colors" />
                                <span className="font-medium text-zinc-400 group-hover:text-emerald-500">God Mode</span>
                            </Link>
                            <Link
                                href="/app/admin/usuarios"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                            >
                                <Users className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                                <span className="font-medium text-zinc-400 group-hover:text-white">Usuarios</span>
                            </Link>
                            <Link
                                href="/app/admin/ingresos"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                            >
                                <CreditCard className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                                <span className="font-medium text-zinc-400 group-hover:text-white">Ingresos</span>
                            </Link>
                        </div>
                    )}

                    <div className="pt-6 text-[10px] font-black text-zinc-600 dark:text-zinc-600 uppercase tracking-widest px-4 mb-2">Preferencias</div>
                    <Link
                        href="/app/ajustes"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        <Settings className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
                        <span className="font-medium text-zinc-300 group-hover:text-white">Ajustes</span>
                    </Link>

                    <Link
                        href="/app/cuenta"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                        <UserCircle className="w-5 h-5 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
                        <span className="font-medium text-zinc-300 group-hover:text-white">Cuenta</span>
                    </Link>
                </nav>

                <UserSidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100">
                {/* Header */}
                <header className="h-16 bg-white/80 dark:bg-zinc-950/50 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 flex items-center justify-between px-8 shrink-0">
                    <div className="relative w-96 max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Buscar entrevistas, resultados..."
                            className="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-400"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors relative">
                            <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950"></div>
                            <Menu className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main className="flex-1 relative overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
