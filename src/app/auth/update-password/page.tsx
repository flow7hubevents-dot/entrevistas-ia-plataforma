"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative">
                <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] text-center space-y-6">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                    <h2 className="text-3xl font-black text-white">¡Actualizada!</h2>
                    <p className="text-zinc-500 text-sm font-medium">Tu contraseña ha sido cambiada correctamente.</p>
                    <button
                        onClick={() => window.location.href = "/"}
                        className="w-full py-4 bg-white text-black font-black rounded-2xl transition-all active:scale-95"
                    >
                        Ir al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
                <div className="text-center space-y-2 mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tight">Nueva contraseña</h1>
                    <p className="text-zinc-500 text-sm font-medium">Ingresa tu nueva clave de acceso.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm mb-6">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] ml-2">Nueva Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                        {loading ? "Actualizando..." : "Cambiar Contraseña"}
                    </button>
                </form>
            </div>
        </div>
    );
}
