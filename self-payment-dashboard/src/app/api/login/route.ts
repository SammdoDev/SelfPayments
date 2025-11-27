import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // 🔹 Ambil user dari schema restaurant
  const { data: user, error } = await supabase
    .schema('restaurant')
    .from('staff_profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'Email not found' }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // ✅ Jika berhasil login, buat token sederhana (bisa pakai JWT nanti)
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

  const res = NextResponse.json({
    message: 'Login success',
    user: {
      id: user.id,
      staff_name: user.staff_name,
      email: user.email,
      role: user.role,
    },
  });

  // 🔹 Simpan token ke cookie (valid 1 hari)
  res.cookies.set('sb-access-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return res;
}
