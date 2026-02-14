"use client";

import { useState } from "react";
import {
    FileText,
    ArrowLeft,
    Download,
    Search,
    ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function BillingPage() {
    const [invoices] = useState([
        { id: "INV-001", date: "14 Feb, 2026", amount: "$19.00", status: "Pagado", plan: "Plan Pro" },
        { id: "INV-002", date: "14 Ene, 2026", amount: "$19.00", status: "Pagado", plan: "Plan Pro" },
        { id: "INV-003", date: "14 Dic, 2025", amount: "$19.00", status: "Pagado", plan: "Plan Pro" },
    ]);

    return (
        <div className="p-8 md:p-12 space-y-10 max-w-5xl mx-auto">
            <header className="space-y-4">
                <Link href="/cuenta/suscripcion" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a suscripción
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Historial de Facturación</h2>
                        <p className="text-zinc-500 font-medium">Aquí puedes descargar todas tus facturas y ver los detalles de tus pagos.</p>
                    </div>
                    <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-blue-900/20">
                        <ExternalLink className="w-5 h-5" />
                        Portal de Stripe
                    </button>
                </div>
            </header>

            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-950/20">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            placeholder="Buscar facturas..."
                            className="bg-transparent border-none focus:ring-0 text-sm pl-10 text-white placeholder:text-zinc-700 w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-950/40 text-[10px] uppercase font-black tracking-widest text-zinc-600">
                                <th className="px-8 py-6">ID Factura</th>
                                <th className="px-8 py-6">Fecha</th>
                                <th className="px-8 py-6">Plan</th>
                                <th className="px-8 py-6">Importe</th>
                                <th className="px-8 py-6 text-center">Estado</th>
                                <th className="px-8 py-6 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invoices.map((invoice, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-white">{invoice.id}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm text-zinc-400">{invoice.date}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-black px-2 py-1 bg-white/5 rounded-md text-zinc-500">{invoice.plan}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-white">{invoice.amount}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase rounded-full border border-emerald-500/20">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {invoices.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                            <FileText className="w-8 h-8 text-zinc-700" />
                        </div>
                        <p className="text-zinc-500 font-medium">No se han encontrado facturas anteriores.</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 justify-center mt-10">
                <p className="text-zinc-600 text-xs font-medium uppercase tracking-[0.2em] flex items-center gap-3">
                    <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                    Pagos seguros procesados por Stripe
                    <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                </p>
            </div>
        </div>
    );
}
