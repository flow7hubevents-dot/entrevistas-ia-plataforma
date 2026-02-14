import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from "react-native";
import { Search, ChevronLeft, Star, Briefcase, Cpu, ShieldCheck, Zap } from "lucide-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MarketplaceScreen() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    const interviewers = [
        {
            id: "1",
            nombre: "Sarah Tech",
            especialidad: "Técnico",
            dificultad: "Alto",
            descripcion: "Especialista en arquitecturas frontend y algoritmos complejos.",
            plan_requerido: "premium",
            personalidad_prompt: "Eres Sarah Tech, una ingeniera de software senior muy exigente. Tu tono es directo y no toleras respuestas vagas."
        },
        {
            id: "2",
            nombre: "Marco HR",
            especialidad: "RRHH",
            dificultad: "Medio",
            descripcion: "Enfocado en cultura, valores y soft skills.",
            plan_requerido: "free",
            personalidad_prompt: "Eres Marco de RRHH, un seleccionador empático pero observador. Buscas coherencia y gran inteligencia emocional."
        },
        {
            id: "3",
            nombre: "Alejandra CEO",
            especialidad: "Negocio",
            dificultad: "Alto",
            descripcion: "Entrevistas para puestos estratégicos y liderazgo.",
            plan_requerido: "pro",
            personalidad_prompt: "Eres Alejandra, CEO. Buscas ambición, visión de negocio y capacidad de ejecución rápida."
        }
    ];

    const handleSelect = async (interviewer: any) => {
        await AsyncStorage.setItem("selected_interviewer", JSON.stringify(interviewer));
        router.push(`/entrevista/${Date.now()}`);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#050505]">
            <View className="p-6 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-zinc-900 rounded-xl items-center justify-center">
                    <ChevronLeft color="white" size={24} />
                </TouchableOpacity>
                <Text className="text-white font-black text-xl uppercase tracking-tighter">Marketplace</Text>
                <View className="w-10" />
            </View>

            <View className="px-6 mb-8">
                <View className="flex-row items-center bg-zinc-900 border border-white/5 px-4 py-4 rounded-2xl">
                    <Search color="#52525b" size={20} />
                    <TextInput
                        placeholder="Buscar entrevistador..."
                        placeholderTextColor="#3f3f46"
                        className="flex-1 ml-3 text-white font-bold"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 50 }}>
                {interviewers.map((i) => (
                    <TouchableOpacity
                        key={i.id}
                        onPress={() => handleSelect(i)}
                        className="bg-zinc-900/50 border border-white/5 p-8 rounded-[3rem] mb-6 relative overflow-hidden"
                    >
                        <View className="flex-row justify-between mb-4">
                            <View className="w-16 h-16 bg-zinc-800 rounded-2xl items-center justify-center border border-white/10">
                                <Users color="#52525b" size={32} />
                            </View>
                            <View className="items-end">
                                <View className={`px-3 py-1 rounded-full border ${i.plan_requerido === 'free' ? 'border-zinc-800 text-zinc-500' : 'border-blue-500/20 bg-blue-500/5'}`}>
                                    <Text className={`text-[8px] font-black uppercase tracking-widest ${i.plan_requerido === 'free' ? 'text-zinc-500' : 'text-blue-400'}`}>{i.plan_requerido}</Text>
                                </View>
                                <View className="flex-row mt-3">
                                    <Star color="#eab308" size={12} fill="#eab308" />
                                    <Star color="#eab308" size={12} fill="#eab308" />
                                    <Star color={i.dificultad === 'Alto' ? '#eab308' : '#27272a'} size={12} fill={i.dificultad === 'Alto' ? '#eab308' : 'transparent'} />
                                </View>
                            </View>
                        </View>

                        <View className="space-y-1 mb-4">
                            <Text className="text-white font-black text-2xl tracking-tight">{i.nombre}</Text>
                            <View className="flex-row items-center">
                                <Briefcase color="#52525b" size={14} className="mr-2" />
                                <Text className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{i.especialidad}</Text>
                            </View>
                        </View>

                        <Text className="text-zinc-500 text-sm leading-relaxed mb-6">{i.descripcion}</Text>

                        <View className="flex-row justify-between items-center pt-6 border-t border-white/5">
                            <Text className="text-white/40 font-black text-[10px] uppercase tracking-widest">Seleccionar Perfil</Text>
                            <View className="w-10 h-10 bg-blue-600 rounded-full items-center justify-center">
                                <Zap color="white" size={16} fill="white" />
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

// Simple fallback for Users icon if not imported
const Users = (props: any) => <View {...props} className="bg-zinc-700" />;
