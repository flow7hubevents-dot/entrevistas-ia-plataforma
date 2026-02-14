"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Enviar email de bienvenida de forma asíncrona (optativo el await)
            fetch("/api/email/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: email,
                    type: "bienvenida",
                    data: { name: email.split("@")[0] }
                })
            }).catch(e => console.error("Error sending welcome email:", e));

            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative">
                <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white">¡Revisa tu email!</h2>
                    <p className="text-zinc-500">Hemos enviado un enlace de confirmación a <span className="text-white font-medium">{email}</span> para activar tu cuenta.</p>
                    <Link href="/auth/login" className="inline-block px-10 py-4 bg-white text-black font-black rounded-2xl transition-all active:scale-95">
                        Ir al Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative z-10 animate-[scaleIn_0.4s_ease-out]">
                <div className="text-center space-y-2 mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tight">Crea tu cuenta</h1>
                    <p className="text-zinc-500 text-sm">Únete a miles de profesionales mejorando sus habilidades.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm mb-6">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] ml-2">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] ml-2">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? "Registrando..." : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Registrarse ahora
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-zinc-500 text-sm mt-10">
                    ¿Ya tienes una cuenta?{" "}
                    <Link href="/auth/login" className="text-white font-bold hover:text-blue-400 transition-colors underline underline-offset-4">Inicia sesión</Link>
                </p>
            </div>

            <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
