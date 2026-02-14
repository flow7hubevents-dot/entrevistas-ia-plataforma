import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: "Prohibido" }, { status: 403 });

        const { data: users, error } = await supabase
            .from('profiles')
            .select(`
                *,
                evaluaciones:evaluaciones(count)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ error: "Error obteniendo usuarios" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createClient();
        const { targetUserId, updates } = await req.json();

        // Validar admin
        const { data: { user: admin } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', admin?.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: "Prohibido" }, { status: 403 });

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', targetUserId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Error actualizando usuario" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const supabase = await createClient();
        const { targetUserId } = await req.json();

        // Validar admin
        const { data: { user: admin } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', admin?.id).single();
        if (profile?.role !== 'admin') return NextResponse.json({ error: "Prohibido" }, { status: 403 });

        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', targetUserId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Error eliminando usuario" }, { status: 500 });
    }
}
