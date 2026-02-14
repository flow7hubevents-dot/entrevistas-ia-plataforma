"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserSidebar() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    if (!user) {
        return (
            <div className="p-4 mt-auto border-t border-white/5 animate-pulse">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-white/5"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-white/5 rounded w-20"></div>
                        <div className="h-2 bg-white/5 rounded w-24"></div>
                    </div>
                </div>
            </div>
        );
    }

    const initials = user.email?.substring(0, 2).toUpperCase() || "US";

    return (
        <div className="p-4 mt-auto border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-3 group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-zinc-500 truncate uppercase tracking-widest">{user.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Cerrar sesión"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
