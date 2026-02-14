"use client";

import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Calendar,
    Trash2,
    Ban,
    ShieldCheck,
    Search,
    Filter,
    Video,
    ChevronRight,
    UserCheck
} from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res = await fetch("/api/admin/usuarios");
        const data = await res.json();
        if (!data.error) setUsers(data);
        setLoading(false);
    };

    const handleUpdatePlan = async (userId: string, newPlan: string) => {
        await fetch("/api/admin/usuarios", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: userId, updates: { plan: newPlan } })
        });
        fetchUsers();
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("¿Estás seguro de eliminar este usuario? Esta acción es irreversible.")) return;
        await fetch("/api/admin/usuarios", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: userId })
        });
        fetchUsers();
    };

    const filteredUsers = users.filter(u =>
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-12 text-center text-zinc-500 animate-pulse">Cargando base de datos de usuarios...</div>;

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-7xl mx-auto animate-[fadeIn_0.5s_ease-out]">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Gestión de Usuarios</h1>
                    <p className="text-zinc-500 font-medium font-medium">Control total sobre perfiles, planes y permisos.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            placeholder="Buscar por email o nombre..."
                            className="bg-zinc-900 border border-white/5 py-3 pl-12 pr-6 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-white min-w-80"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-500 hover:text-white transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-zinc-500">
                            <th className="px-8 py-6">Usuario</th>
                            <th className="px-8 py-6">Estado / Plan</th>
                            <th className="px-8 py-6">Registro</th>
                            <th className="px-8 py-6">Uso</th>
                            <th className="px-8 py-6 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((u, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-xs font-black text-white">
                                            {u.email?.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white leading-tight">{u.full_name || u.email?.split('@')[0]}</p>
                                            <p className="text-xs text-zinc-600 flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                {u.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${u.plan === 'pro' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                u.plan === 'premium' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    'bg-white/5 text-zinc-500 border-white/5'
                                            }`}>
                                            {u.plan}
                                        </span>
                                        {u.role === 'admin' && (
                                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Admin</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-xs text-zinc-500 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-sm">
                                        <Video className="w-4 h-4" />
                                        {u.evaluaciones?.[0]?.count || 0}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleUpdatePlan(u.id, u.plan === 'pro' ? 'free' : 'pro')}
                                            className="p-2.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-blue-400 rounded-xl transition-all"
                                            title="Alternar Plan"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2.5 bg-zinc-900 border border-white/5 text-zinc-400 hover:text-red-500 rounded-xl transition-all"
                                            title="Suspender Usuario"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="p-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            title="Eliminar Permanente"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <User className="w-12 h-12 text-zinc-700 mx-auto" />
                        <p className="text-zinc-500 font-medium">No se encontraron usuarios con ese criterio.</p>
                    </div>
                )}
            </div>

            <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
