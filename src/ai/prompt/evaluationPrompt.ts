export function buildEvaluationPrompt(messages: { from: "user" | "ai"; text: string }[], moods: string[]) {
    const chatHistory = messages
        .map((m) => `${m.from === "ai" ? "ENTREVISTADOR" : "CANDIDATO"}: ${m.text}`)
        .join("\n\n");

    return `
Eres un consultor experto en adquisición de talento y psicólogo organizacional.
Tu tarea es evaluar el desempeño de un candidato en una entrevista técnica y de comportamiento que acaba de finalizar.

CONTEXTO DE LA ENTREVISTA:
- El entrevistador actuó con los siguientes moods: ${moods.join(", ")}.
- Debes tener en cuenta si el candidato supo adaptarse al tono del entrevistador.

HISTORIAL DE LA ENTREVISTA:
${chatHistory}

INSTRUCCIONES DE EVALUACIÓN:
Analiza el historial y genera una evaluación detallada en formato JSON.
La respuesta DEBE ser EXCLUSIVAMENTE el objeto JSON, sin texto adicional, sin backticks de markdown.

ESTRUCTURA DEL JSON:
{
  "puntuacionGlobal": (número entre 0 y 100),
  "comunicacion": (número entre 0 y 100),
  "conocimientosTecnicos": (número entre 0 y 100),
  "resolucionProblemas": (número entre 0 y 100),
  "puntosFuertes": ["string", "string", ...],
  "puntosDebiles": ["string", "string", ...],
  "recomendaciones": "Texto detallado con consejos específicos para mejorar.",
  "resumenEjecutivo": "Un párrafo breve que resuma el perfil del candidato basado en esta sesión."
}

CRITERIOS:
- Puntuación Global: Media ponderada del desempeño general.
- Comunicación: Claridad, asertividad y capacidad de escucha.
- Conocimientos Técnicos: Precisión en las respuestas técnicas.
- Resolución de Problemas: Lógica y capacidad de razonamiento.

Asegúrate de que el JSON sea válido y esté bien estructurado.
    `;
}
