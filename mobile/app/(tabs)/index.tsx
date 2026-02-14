import React, { useEffect, useState, useCallback, memo } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, RefreshControl } from "react-native";
import { supabase } from "../../lib/supabase";
import { Video, Star, Zap, Plus, ChevronRight } from "lucide-react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Componente Memoizado para KPIs
const KPICard = memo(({ label, value, icon: Icon, color }: any) => (
    <View className="flex-1 bg-zinc-900 border border-white/5 p-6 rounded-[2.5rem]">
        <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center mb-3">
            <Icon color={color} size={20} />
        </View>
        <Text className="text-white font-black text-2xl tracking-tighter">{value}</Text>
        <Text className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">{label}</Text>
    </View>
));

export default function DashboardScreen() {
    const [userName, setUserName] = useState("Usuario");
    const [stats, setStats] = useState({ interviews: 0, score: 0 });
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const loadData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0]);

            // Intentar cargar de cache primero
            const cached = await AsyncStorage.getItem(`stats_${user.id}`);
            if (cached) setStats(JSON.parse(cached));

            const { data: evals } = await supabase
                .from('evaluaciones')
                .select('puntuacion_global')
                .eq('user_id', user.id);

            if (evals && evals.length > 0) {
                const avg = evals.reduce((acc, curr) => acc + curr.puntuacion_global, 0) / evals.length;
                const newStats = { interviews: evals.length, score: Math.round(avg) };
                setStats(newStats);
                await AsyncStorage.setItem(`stats_${user.id}`, JSON.stringify(newStats));
            }
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadData().finally(() => setRefreshing(false));
    }, [loadData]);

    return (
        <SafeAreaView className="flex-1 bg-[#050505]">
            <ScrollView
                className="p-6"
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
            >
                <View className="flex-row justify-between items-center mb-12">
                    <View>
                        <Text className="text-zinc-600 font-black uppercase tracking-widest text-[9px] mb-1">Status: Online</Text>
                        <Text className="text-4xl font-black text-white tracking-tighter uppercase">{userName}</Text>
                    </View>
                    <TouchableOpacity className="w-12 h-12 bg-zinc-900 rounded-2xl border border-white/5 items-center justify-center">
                        <Zap color="#3b82f6" size={24} fill="#3b82f6" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row gap-4 mb-10">
                    <KPICard label="Sesiones" value={stats.interviews} icon={Video} color="#3b82f6" />
                    <KPICard label="Avg Score" value={`${stats.score}%`} icon={Star} color="#10b981" />
                </View>

                <TouchableOpacity
                    onPress={() => router.push("/marketplace")}
                    className="bg-blue-600 p-8 rounded-[3rem] shadow-2xl shadow-blue-900/50 mb-12 flex-row items-center justify-between"
                >
                    <View className="flex-1">
                        <Text className="text-white font-black text-2xl uppercase tracking-tighter mb-1">Nueva Sesión</Text>
                        <Text className="text-blue-100/60 text-xs font-bold">Inicia un entrenamiento IA ahora</Text>
                    </View>
                    <View className="w-14 h-14 bg-white/10 rounded-3xl items-center justify-center border border-white/10">
                        <Plus color="white" size={32} />
                    </View>
                </TouchableOpacity>

                <View className="space-y-6">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-white font-black text-lg tracking-tight uppercase">Recomendados</Text>
                        <Text className="text-blue-500 font-black text-[10px] uppercase underline">Marketplace</Text>
                    </View>

                    {[1, 2].map((i) => (
                        <View key={i} className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem] flex-row items-center">
                            <View className="w-14 h-14 bg-zinc-800 rounded-2xl mr-4 border border-white/10" />
                            <View className="flex-1">
                                <Text className="text-white font-black text-lg">Sarah Tech</Text>
                                <Text className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Lead Frontend</Text>
                            </div>
                            <ChevronRight color="#27272a" size={24} />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
