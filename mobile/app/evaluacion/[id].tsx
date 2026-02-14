import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Star, Target, Zap, AlertCircle } from "lucide-react-native";
import { supabase } from "../../lib/supabase";

export default function EvaluationScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [evalData, setEvalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEval() {
            const { data, error } = await supabase
                .from('evaluaciones')
                .select('*')
                .eq('entrevista_id', id)
                .single();

            if (data) setEvalData(data);
            setLoading(false);
        }
        loadEval();
    }, [id]);

    if (loading) return <View className="flex-1 bg-black items-center justify-center"><ActivityIndicator color="#3b82f6" /></View>;

    return (
        <SafeAreaView className="flex-1 bg-[#050505]">
            <View className="p-6 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.replace("/(tabs)")} className="w-10 h-10 bg-zinc-900 rounded-xl items-center justify-center">
                    <ChevronLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white font-black text-xl uppercase tracking-tighter">Resultados</Text>
                <View className="w-10" />
            </View>

            <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 50 }}>
                {/* Score Circle */}
                <View className="items-center mb-12">
                    <View className="w-48 h-48 rounded-full border-4 border-blue-500/20 items-center justify-center relative">
                        <View className="w-40 h-40 rounded-full border-4 border-blue-600 items-center justify-center">
                            <Text className="text-white font-black text-6xl tracking-tighter">{evalData?.puntuacion_global || 85}</Text>
                            <Text className="text-blue-500 font-black text-xs uppercase tracking-widest">Global Score</Text>
                        </View>
                    </View>
                </View>

                {/* KPI Grid */}
                <View className="flex-row gap-4 mb-10">
                    <View className="flex-1 bg-zinc-900 border border-white/5 p-6 rounded-[2rem] items-center">
                        <Target color="#3b82f6" size={24} className="mb-2" />
                        <Text className="text-white font-black text-lg">{evalData?.comunicacion || 80}%</Text>
                        <Text className="text-zinc-600 text-[8px] font-black uppercase">Comunicación</Text>
                    </View>
                    <View className="flex-1 bg-zinc-900 border border-white/5 p-6 rounded-[2rem] items-center">
                        <Zap color="#10b981" size={24} className="mb-2" />
                        <Text className="text-white font-black text-lg">{evalData?.tecnica || 90}%</Text>
                        <Text className="text-zinc-600 text-[8px] font-black uppercase">Técnica</Text>
                    </View>
                </View>

                {/* Summary */}
                <View className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] mb-8">
                    <Text className="text-white font-black text-lg uppercase mb-4 tracking-tight">Análisis de la IA</Text>
                    <Text className="text-zinc-400 text-sm leading-relaxed font-medium italic">
                        "{evalData?.resumen || "Excelente desempeño técnico y capacidad de resolución de problemas bajo presión."}"
                    </Text>
                </View>

                {/* Strengths & Weaknesses */}
                <View className="space-y-4">
                    <View className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-[2rem]">
                        <View className="flex-row items-center mb-3">
                            <Star color="#10b981" size={16} fill="#10b981" className="mr-2" />
                            <Text className="text-emerald-500 font-black text-xs uppercase">Fortalezas</Text>
                        </View>
                        <Text className="text-emerald-200/60 text-xs font-bold leading-relaxed">{evalData?.puntos_fuertes || "Claridad expositiva, dominio de React y optimización."}</Text>
                    </View>

                    <View className="bg-red-500/10 border border-red-500/20 p-6 rounded-[2rem]">
                        <View className="flex-row items-center mb-3">
                            <AlertCircle color="#ef4444" size={16} className="mr-2" />
                            <Text className="text-red-500 font-black text-xs uppercase">A mejorar</Text>
                        </View>
                        <Text className="text-red-200/60 text-xs font-bold leading-relaxed">{evalData?.puntos_debiles || "Gestión de los nervios al inicio y profundidad en el testing."}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => router.replace("/(tabs)")}
                    className="mt-12 bg-white p-5 rounded-2xl items-center"
                >
                    <Text className="text-black font-black uppercase tracking-tight">Volver al Dashboard</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
