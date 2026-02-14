import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildInterviewerPrompt } from "@/ai/prompt/interviewerPrompt";

export async function POST(req: Request) {
  try {
    const { message, moods, personality } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = buildInterviewerPrompt(moods, personality) + `
CANDIDATO:
${message}

ENTREVISTADOR:
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Error en /api/interview:", err);
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}