import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        // Verificar si el usuario es admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: "Prohibido" }, { status: 403 });
        }

        // Obtener estadísticas globales de Supabase
        const [
            { count: totalUsuarios },
            { count: totalEntrevistas },
            { data: revenueData }
        ] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('evaluaciones').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('plan') // Simulación de ingresos
        ]);

        // Simulación de datos para demostración
        const stats = {
            totalUsuarios: totalUsuarios || 0,
            usuariosActivosMes: Math.floor((totalUsuarios || 0) * 0.4),
            totalEntrevistas: totalEntrevistas || 0,
            ingresosMensuales: 12450.00,
            ingresosPorMes: [
                { mes: "Sep", ingresos: 4500 },
                { mes: "Oct", ingresos: 7200 },
                { mes: "Nov", ingresos: 8900 },
                { mes: "Dic", ingresos: 11200 },
                { mes: "Ene", ingresos: 12800 },
                { mes: "Feb", ingresos: 14500 },
            ],
            crecimientoUsuarios: [
                { mes: "Sep", usuarios: 120 },
                { mes: "Oct", usuarios: 240 },
                { mes: "Nov", usuarios: 480 },
                { mes: "Dic", usuarios: 720 },
                { mes: "Ene", usuarios: 950 },
                { mes: "Feb", usuarios: 1240 },
            ]
        };

        return NextResponse.json(stats);
    } catch (err) {
        console.error("Error en /api/admin/stats:", err);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
