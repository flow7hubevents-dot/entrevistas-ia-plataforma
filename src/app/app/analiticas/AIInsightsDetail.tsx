import { BrainCircuit } from "lucide-react";

export default function AIInsightsDetail({ insights }: { insights: any }) {
    return (
        <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 md:p-16 space-y-12 relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -z-10"></div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-1 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <BrainCircuit className="w-4 h-4" />
                        Análisis Estratégico AI
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none uppercase">Recomendaciones <br /><span className="text-blue-500">Personalizadas</span></h2>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-xl text-zinc-400 leading-relaxed font-medium italic">
                            "{insights?.recomendacionesPersonalizadas || "Completa más entrevistas para obtener consejos específicos."}"
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-96 space-y-6">
                    <div className="bg-zinc-900 shadow-2xl p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Fortalezas Recurrentes</h4>
                        <div className="space-y-3">
                            {(insights?.puntosFuertesRecurrentes || []).map((point: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-emerald-400 text-sm font-bold animate-[fadeIn_0.3s_ease-out]">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900 shadow-2xl p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Áreas a Mejorar</h4>
                        <div className="space-y-3">
                            {(insights?.debilidadesRecurrentes || []).map((point: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 text-red-400 text-sm font-bold animate-[fadeIn_0.3s_ease-out]">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                    {point}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
