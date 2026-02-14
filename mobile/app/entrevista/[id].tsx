import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as Speech from "expo-speech";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Mic, MicOff, Send, X, Play, RotateCcw } from "lucide-react-native";
import { supabase } from "../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function InterviewScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [messages, setMessages] = useState<{ from: "user" | "ai"; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [interviewer, setInterviewer] = useState<any>(null);
    const [isMuted, setIsMuted] = useState(false);
    const chatRef = useRef<ScrollView>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");

            const stored = await AsyncStorage.getItem("selected_interviewer");
            if (stored) setInterviewer(JSON.parse(stored));
        })();
    }, []);

    const speak = (text: string) => {
        Speech.speak(text, {
            language: "es-ES",
            rate: 1.0,
            pitch: 1.0,
        });
    };

    async function startInterview() {
        setHasStarted(true);
        setIsLoading(true);
        try {
            const res = await fetch("https://tu-backend-url.vercel.app/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: "Inicia la entrevista con tu primera pregunta para el candidato. Preséntate brevemente.",
                    moods: ["profesional", "serio"],
                    personality: interviewer?.personalidad_prompt
                }),
            });
            const data = await res.json();
            setMessages([{ from: "ai", text: data.reply }]);
            speak(data.reply);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function sendMessage() {
        if (!input.trim() || isLoading) return;
        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { from: "user", text: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch("https://tu-backend-url.vercel.app/api/interview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    moods: ["profesional", "serio"],
                    personality: interviewer?.personalidad_prompt
                }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { from: "ai", text: data.reply }]);
            speak(data.reply);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    if (hasPermission === null) return <View className="flex-1 bg-black" />;
    if (hasPermission === false) return <Text className="text-white p-20">No camera access</Text>;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-[#050505]">
            {/* Header / Camera View */}
            <View className="h-[40%] bg-zinc-950 relative">
                <CameraView style={StyleSheet.absoluteFill} facing="front" />
                <View className="absolute top-12 left-6 bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                    <Text className="text-white font-black text-[10px] uppercase tracking-widest">{interviewer?.nombre || 'IA Standar'}</Text>
                </View>
                <TouchableOpacity onPress={() => router.back()} className="absolute top-12 right-6 w-10 h-10 bg-black/50 rounded-full items-center justify-center border border-white/10 backdrop-blur-md">
                    <X color="white" size={20} />
                </TouchableOpacity>
            </View>

            {/* Chat Area */}
            <View className="flex-1 p-6 bg-[#050505] rounded-t-[3rem] -mt-10 border-t border-white/5 shadow-2xl">
                <ScrollView
                    ref={chatRef}
                    onContentSizeChange={() => chatRef.current?.scrollToEnd({ animated: true })}
                    className="flex-1 mb-4"
                >
                    {!hasStarted ? (
                        <View className="flex-1 items-center justify-center p-10 opacity-50">
                            <Text className="text-zinc-500 text-center font-medium">Pulsa comenzar para iniciar la cámara e interactuar con la IA.</Text>
                        </View>
                    ) : (
                        messages.map((msg, i) => (
                            <View key={i} className={`mb-4 max-w-[85%] ${msg.from === 'user' ? 'self-end' : 'self-start'}`}>
                                <View className={`p-5 rounded-3xl ${msg.from === 'user' ? 'bg-blue-600 rounded-tr-none' : 'bg-zinc-900 rounded-tl-none border border-white/5'}`}>
                                    <Text className={`text-sm ${msg.from === 'user' ? 'text-white' : 'text-zinc-300'} font-medium`}>{msg.text}</Text>
                                </View>
                            </View>
                        ))
                    )}
                    {isLoading && <ActivityIndicator color="#3b82f6" style={{ alignSelf: 'flex-start', marginLeft: 20 }} />}
                </ScrollView>

                {/* Input / Control Bar */}
                {!hasStarted ? (
                    <TouchableOpacity onPress={startInterview} className="bg-emerald-600 py-5 rounded-[2rem] flex-row items-center justify-center shadow-xl shadow-emerald-900/20">
                        <Play color="white" size={20} fill="white" className="mr-2" />
                        <Text className="text-white font-black text-lg uppercase tracking-tight">Comenzar Sesión</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="flex-row items-center gap-3">
                        <TouchableOpacity onPress={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-2xl items-center justify-center ${isMuted ? 'bg-red-500/10' : 'bg-zinc-900'}`}>
                            {isMuted ? <MicOff color="#ef4444" size={24} /> : <Mic color="#71717a" size={24} />}
                        </TouchableOpacity>
                        <TextInput
                            className="flex-1 bg-zinc-900 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold"
                            placeholder="Tu respuesta..."
                            placeholderTextColor="#3f3f46"
                            value={input}
                            onChangeText={setInput}
                            onSubmitEditing={sendMessage}
                        />
                        <TouchableOpacity onPress={sendMessage} className="w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center shadow-lg shadow-blue-900/30">
                            <Send color="white" size={24} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}
