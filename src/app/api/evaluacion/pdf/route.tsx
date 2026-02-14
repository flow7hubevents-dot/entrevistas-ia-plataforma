import { NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, renderToStream } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
    page: {
        padding: 50,
        backgroundColor: "#ffffff",
    },
    header: {
        marginBottom: 40,
        borderBottomWidth: 2,
        borderBottomColor: "#3b82f6",
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        color: "#0f172a",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    scoreCard: {
        marginVertical: 30,
        padding: 30,
        backgroundColor: "#f8fafc",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    scoreLabel: {
        fontSize: 10,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 2,
        marginBottom: 5,
    },
    scoreValue: {
        fontSize: 48,
        color: "#3b82f6",
        fontWeight: "bold",
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        color: "#0f172a",
        fontWeight: "bold",
        textTransform: "uppercase",
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: "#3b82f6",
        paddingLeft: 10,
    },
    text: {
        fontSize: 11,
        color: "#334155",
        lineHeight: 1.6,
    },
    footer: {
        position: "absolute",
        bottom: 50,
        left: 50,
        right: 50,
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
        paddingTop: 20,
        textAlign: "center",
    },
});

const EvaluationBlob = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Reporte de Evaluación</Text>
                <Text style={{ fontSize: 10, color: "#64748b", marginTop: 5 }}>AI Entrevistas Pro | Sesión ID: {data.id}</Text>
            </View>

            <View style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>Puntuación Global</Text>
                <Text style={styles.scoreValue}>{data.puntuacion_global}/100</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
                <View style={{ backgroundColor: "#f1f5f9", padding: 15, borderRadius: 10 }}>
                    <Text style={[styles.text, { fontStyle: "italic" }]}>{data.resumen}</Text>
                </View>
            </View>

            <View style={{ flexDirection: "row", gap: 30 }}>
                <View style={[styles.section, { flex: 1 }]}>
                    <Text style={styles.sectionTitle}>Fortalezas</Text>
                    <Text style={[styles.text, { color: "#059669" }]}>{data.puntos_fuertes}</Text>
                </View>
                <View style={[styles.section, { flex: 1 }]}>
                    <Text style={styles.sectionTitle}>Áreas de Mejora</Text>
                    <Text style={[styles.text, { color: "#dc2626" }]}>{data.puntos_debiles}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recomendaciones</Text>
                <Text style={styles.text}>{data.recomendaciones}</Text>
            </View>

            <View style={styles.footer}>
                <Text style={{ fontSize: 9, color: "#94a3b8" }}>
                    Generado automáticamente por AI Entrevistas Pro el {new Date().toLocaleDateString()}
                </Text>
            </View>
        </Page>
    </Document>
);

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const stream = await renderToStream(<EvaluationBlob data={data} />);

        // Convert WebStream to Buffer
        const chunks: Uint8Array[] = [];
        const reader = stream.getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
        }

        const buffer = Buffer.concat(chunks);

        return new NextResponse(buffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="evaluacion-${data.id}.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
