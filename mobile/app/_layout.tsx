import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#050505" }}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#050505" } }}>
            {!session ? (
                <Stack.Screen name="(auth)" />
            ) : (
                <Stack.Screen name="(tabs)" />
            )}
            <Stack.Screen name="entrevista/[id]" options={{ presentation: "fullScreenModal" }} />
            <Stack.Screen name="evaluacion/[id]" />
            <Stack.Screen name="marketplace/index" options={{ presentation: "modal" }} />
        </Stack>
    );
}
