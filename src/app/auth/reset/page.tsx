"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { KeyRound, Mail, AlertCircle, ArrowLeft, Send } from "lucide-react";

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative z-10 animate-[scaleIn_0.4s_ease-out]">
                <Link href="/auth/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Login
                </Link>

                <div className="text-center space-y-2 mb-10 text-left">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
                        <KeyRound className="w-6 h-6 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Recuperar contraseña</h1>
                    <p className="text-zinc-500 text-sm">Te enviaremos un enlace para que puedas volver a entrar.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm mb-6">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {success ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem] text-center space-y-4">
                        <p className="text-emerald-400 font-bold">¡Email enviado!</p>
                        <p className="text-zinc-500 text-sm">Revisa tu bandeja de entrada para seguir las instrucciones.</p>
                    </div>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.2em] ml-2">Email de tu cuenta</label>
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? "Enviando..." : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Enviar enlace
                                </>
                            )}
                        </button>
                    </form>
                )}
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
