"use client";

import { useEffect, useState, useRef } from "react";
import { Terminal, ShieldAlert, Cpu, Database, Eye, Ghost, Activity, Server, Zap } from "lucide-react";

export default function GodModePage() {
    const [logs, setLogs] = useState<string[]>([
        "[SYSTEM] God Mode initialized...",
        "[AUTH] Elevated privileges detected: USER_ROLE=admin",
        "[NETWORK] Tunneling through secure gateway...",
    ]);
    const [command, setCommand] = useState("");
    const terminalEndRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `> ${msg}`]);
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim()) return;

        addLog(command);
        const cmd = command.toLowerCase();

        if (cmd === "help") {
            addLog("Available commands: stats, users --list, prompt --edit, simulate --interview, clear, exit");
        } else if (cmd === "stats") {
            addLog("Uptime: 99.99% | CPU: 12% | MEM: 456MB | ACTIVE_USERS: 24");
        } else if (cmd === "clear") {
            setLogs([]);
        } else {
            addLog(`Unknown command: ${command}. Type 'help' for options.`);
        }

        setCommand("");
    };

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    return (
        <div className="min-h-screen bg-black text-emerald-500 font-mono p-4 md:p-10 space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Header / HUD */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-emerald-900/30 pb-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center animate-pulse">
                        <ShieldAlert className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">GOD_MODE_v2.0</h1>
                        <p className="text-[10px] text-emerald-900 font-bold uppercase tracking-widest">Administrative Overwrite Active</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                    {[
                        { icon: Server, label: "Server Status", val: "ONLINE" },
                        { icon: Activity, label: "Latencia", val: "24ms" },
                        { icon: Zap, label: "IA Energy", val: "MAX" },
                        { icon: Ghost, label: "Stealth", val: "ACTIVE" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded-lg items-center">
                            <stat.icon className="w-3 h-3 mb-1" />
                            <p className="text-[8px] uppercase opacity-50">{stat.label}</p>
                            <p className="text-xs font-black">{stat.val}</p>
                        </div>
                    ))}
                </div>
            </header>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl hover:bg-emerald-500/10 transition-all cursor-pointer group">
                    <Database className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-white font-black text-sm uppercase">Ver Conversaciones</h3>
                    <p className="text-[10px] opacity-60 mt-1">Acceso total a logs de entrevistas completas.</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl hover:bg-emerald-500/10 transition-all cursor-pointer group">
                    <Cpu className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-white font-black text-sm uppercase">Global Prompt Override</h3>
                    <p className="text-[10px] opacity-60 mt-1">Modificar el core del comportamiento IA.</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl hover:bg-emerald-500/10 transition-all cursor-pointer group">
                    <Eye className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-white font-black text-sm uppercase">Simular Usuario</h3>
                    <p className="text-[10px] opacity-60 mt-1">Navegar por la plataforma con perfil fantasma.</p>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl hover:bg-red-500/10 transition-all cursor-pointer group">
                    <ShieldAlert className="w-8 h-8 mb-4 text-red-500" />
                    <h3 className="text-red-500 font-black text-sm uppercase">Acciones Masivas</h3>
                    <p className="text-[10px] opacity-60 mt-1 text-red-900">BORRADO / BLOQUEO / MIGRACIÓN.</p>
                </div>
            </div>

            {/* Main Terminal Area */}
            <div className="flex-1 bg-black/80 border border-emerald-900/30 rounded-3xl overflow-hidden flex flex-col h-[50vh] shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                <div className="bg-emerald-900/10 px-6 py-3 border-b border-emerald-900/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">System Terminal</span>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-2 scrollbar-hide">
                    {logs.map((log, i) => (
                        <div key={i} className="text-xs font-medium">
                            <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span> {log}
                        </div>
                    ))}
                    <div ref={terminalEndRef} />
                </div>

                <form onSubmit={handleCommand} className="p-4 border-t border-emerald-900/30">
                    <div className="flex items-center gap-3">
                        <span className="text-emerald-500 font-black">$</span>
                        <input
                            autoFocus
                            className="flex-1 bg-transparent border-none outline-none text-emerald-400 text-xs placeholder:text-emerald-900"
                            placeholder="Type command (try 'help')..."
                            value={command}
                            onChange={(e) => setCommand(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            <style jsx global>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}
