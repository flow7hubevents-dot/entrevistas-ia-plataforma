import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, type, data } = await req.json();

    let subject = "";
    let html = "";

    const baseStyles = `
            font-family: 'Outfit', 'Inter', sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
            background-color: #050505;
            color: #ffffff;
            border-radius: 40px;
        `;

    switch (type) {
      case "bienvenida":
        subject = "🚀 Bienvenido a la Élite: AI Entrevistas Pro";
        html = `
                    <div style="${baseStyles}">
                        <div style="background: #3b82f6; width: 40px; height: 40px; border-radius: 12px; margin-bottom: 24px;"></div>
                        <h1 style="font-size: 32px; font-weight: 900; letter-spacing: -1px; margin-bottom: 16px;">BIENVENIDO, ${data.name.toUpperCase()}</h1>
                        <p style="color: #a1a1aa; line-height: 1.6; font-size: 16px;">Has dado el primer paso para dominar cualquier proceso de selección. Nuestra IA está lista para ponerte a prueba.</p>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/app" style="background: #ffffff; color: #000000; padding: 16px 32px; text-decoration: none; border-radius: 16px; display: inline-block; font-weight: 900; font-size: 12px; letter-spacing: 2px; margin-top: 32px;">IR AL DASHBOARD</a>
                        <p style="margin-top: 40px; font-size: 10px; color: #3f3f46; font-weight: 900; letter-spacing: 1px;">© 2026 AI ENTREVISTAS PRO ECOSYSTEM</p>
                    </div>
                `;
        break;

      case "evaluacion":
        subject = `📊 Informe de Rendimiento: ${data.puntuacion}/100`;
        html = `
                    <div style="${baseStyles}">
                        <h4 style="color: #3b82f6; font-size: 10px; font-weight: 900; letter-spacing: 2px; margin-bottom: 8px;">SESIÓN FINALIZADA</h4>
                        <h1 style="font-size: 48px; font-weight: 900; margin-bottom: 24px;">${data.puntuacion}<span style="font-size: 20px; color: #3f3f46;">/100</span></h1>
                        <div style="background: #18181b; padding: 24px; border-radius: 24px; border: 1px solid #27272a; margin-bottom: 32px;">
                            <p style="color: #a1a1aa; font-style: italic; margin: 0;">"${data.resumen}"</p>
                        </div>
                        <a href="${process.env.NEXT_PUBLIC_APP_URL}/app/entrevistas/${data.id}/evaluacion" style="background: #3b82f6; color: #white; padding: 16px 32px; text-decoration: none; border-radius: 16px; display: inline-block; font-weight: 900; font-size: 12px; letter-spacing: 2px;">DESCARGAR REPORTE FULL</a>
                    </div>
                `;
        break;

      default:
        return NextResponse.json({ error: "Tipo de email no válido" }, { status: 400 });
    }

    const { data: resendData, error } = await resend.emails.send({
      from: "AI Entrevistas <noreply@aientrevistas.com>",
      to,
      subject,
      html,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ success: true, resendData });
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
