import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildEvaluationPrompt } from "@/ai/prompt/evaluationPrompt";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { messages, moods, id } = await req.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json(
                { error: "No hay mensajes para evaluar" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = buildEvaluationPrompt(messages, moods);

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // Limpiar posibles backticks si Gemini los incluye
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const evaluation = JSON.parse(text);

            // Persistencia en Supabase si el usuario está autenticado
            if (user) {
                const { error: dbError } = await supabase
                    .from("evaluaciones")
                    .insert({
                        user_id: user.id,
                        entrevista_id: id,
                        puntuacion_global: evaluation.puntuacionGlobal,
                        comunicacion: evaluation.comunicacion,
                        tecnica: evaluation.conocimientosTecnicos,
                        resolucion: evaluation.resolucionProblemas,
                        resumen: evaluation.resumenEjecutivo,
                        puntos_fuertes: evaluation.puntosFuertes,
                        puntos_debiles: evaluation.puntosDebiles,
                        recomendaciones: evaluation.recomendaciones
                    });

                if (dbError) console.error("Error guardando evaluación en DB:", dbError);
            }

            return NextResponse.json(evaluation);
        } catch (parseError) {
            console.error("Error parseando JSON de Gemini:", text);
            return NextResponse.json(
                { error: "Error en el formato de la evaluación" },
                { status: 500 }
            );
        }
    } catch (err) {
        console.error("Error en /api/evaluacion:", err);
        return NextResponse.json(
            { error: "Error procesando la evaluación" },
            { status: 500 }
        );
    }
}
