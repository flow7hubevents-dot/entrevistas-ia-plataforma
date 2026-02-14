import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600; // Revalidar cada hora

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const { data: evaluations, error } = await supabase
            .from("evaluaciones")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) {
            return NextResponse.json({ error: "Error obteniendo datos" }, { status: 500 });
        }

        if (!evaluations || evaluations.length === 0) {
            return NextResponse.json({
                isFirstTime: true,
                message: "Aún no tienes suficientes entrevistas para generar insights."
            });
        }

        // Optimización: Si hay resultados recientes en el cache no llamar a Gemini
        // Aquí podríamos implementar un Redis o similar, pero por ahora usamos los headers de Next.js

        const statsSummary = evaluations.map(e => ({
            puntuacion: e.puntuacion_global,
            comunicacion: e.comunicacion,
            tecnica: e.tecnica,
            resolucion: e.resolucion,
            fuertes: e.puntos_fuertes,
            debiles: e.puntos_debiles
        }));

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
            Eres un analista de carrera senior y coach de entrevistas.
            Genera un informe JSON basado en estos datos: ${JSON.stringify(statsSummary)}
            Estructura: { "tendencia": string, "puntosFuertesRecurrentes": [], "debilidadesRecurrentes": [], "recomendacionesPersonalizadas": string, "prediccionNivelFuturo": string, "kpis": { "mejoraPuntuacion": string } }
        `;

        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const insights = JSON.parse(text);

        return NextResponse.json(insights, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
            }
        });

    } catch (err) {
        console.error("Error en /api/analiticas/insights:", err);
        return NextResponse.json({ error: "Error procesando analíticas" }, { status: 500 });
    }
}
