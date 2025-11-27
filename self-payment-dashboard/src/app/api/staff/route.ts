import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, password, staff_name, role } = await req.json();

  if (!email || !password || !staff_name || !role) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .schema('restaurant')
    .from('staff_profiles')
    .insert([{ email, password: hashedPassword, staff_name, role, is_active: true }])
    .select('staff_id, staff_name, role, email, is_active, created_at'); 

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, data });
}

export async function GET() {
  const { data, error } = await supabase
    .schema('restaurant')
    .from('staff_profiles')
    .select('staff_id, staff_name, role, email, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true, data });
}
