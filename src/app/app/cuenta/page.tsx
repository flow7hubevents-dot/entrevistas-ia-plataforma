"use client";

import { User, Mail, CreditCard, ShieldCheck } from "lucide-react";

export default function AccountPage() {
    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <header className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-4xl font-black text-white shadow-xl">
                    JD
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">Juan Diego</h2>
                    <p className="text-zinc-400">Miembro desde Diciembre 2025 • Plan Pro</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-400" />
                        Información Personal
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase font-black mb-1">Nombre Completo</p>
                            <p className="text-zinc-200">Juan Diego García</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase font-black mb-1">Correo Electrónico</p>
                            <p className="text-zinc-200">juan.diego@example.com</p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-400" />
                        Suscripción y Pagos
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <p className="font-bold">Plan Premium Anual</p>
                                <p className="text-xs text-zinc-500">Siguiente pago: 12 Dic, 2026</p>
                            </div>
                            <p className="text-emerald-400 font-black">$199/año</p>
                        </div>
                        <button className="text-sm text-blue-400 hover:underline font-medium">Gestionar método de pago</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
