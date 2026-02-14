import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { supabase } from "../../lib/supabase";
import { Link, useRouter } from "expo-router";
import { Mail, Lock, LogIn } from "lucide-react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signIn() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            router.replace("/(tabs)");
        }
        setLoading(false);
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-[#050505]">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
                <View className="mb-12 items-center">
                    <View className="w-16 h-16 bg-blue-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-blue-900/40">
                        <LogIn color="white" size={32} />
                    </View>
                    <Text className="text-4xl font-black text-white tracking-tighter">Bienvenido</Text>
                    <Text className="text-zinc-500 font-medium">Inicia sesión en AIEntrevistasPro</Text>
                </div>

                <View className="space-y-6">
                    <View>
                        <Text className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-2 ml-1">Email</Text>
                        <View className="flex-row items-center bg-zinc-900 border border-white/5 rounded-2xl px-4 py-4">
                            <Mail color="#71717a" size={20} />
                            <TextInput
                                className="flex-1 text-white ml-3 font-bold"
                                placeholder="tu@email.com"
                                placeholderTextColor="#3f3f46"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-2 ml-1">Contraseña</Text>
                        <View className="flex-row items-center bg-zinc-900 border border-white/5 rounded-2xl px-4 py-4">
                            <Lock color="#71717a" size={20} />
                            <TextInput
                                className="flex-1 text-white ml-3 font-bold"
                                placeholder="••••••••"
                                placeholderTextColor="#3f3f46"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={signIn}
                        className={`bg-blue-600 py-5 rounded-2xl items-center shadow-2xl shadow-blue-900/40 ${loading ? 'opacity-50' : ''}`}
                        disabled={loading}
                    >
                        <Text className="text-white font-black text-lg uppercase tracking-tight">Entrar</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-8 flex-row justify-center">
                    <Text className="text-zinc-500 font-medium">¿No tienes cuenta? </Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity>
                            <Text className="text-blue-500 font-bold underline">Regístrate</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
