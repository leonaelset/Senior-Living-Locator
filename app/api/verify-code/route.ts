import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ verified: false, error: 'Phone and code are required' }, { status: 400 });
    }

    // Look up the code
    const { data, error } = await supabaseAdmin
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('used', false)
      .single();

    if (error || !data) {
      return NextResponse.json({ verified: false, error: 'Invalid code' }, { status: 200 });
    }

    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ verified: false, error: 'Code has expired. Please request a new one.' }, { status: 200 });
    }

    // Mark code as used
    await supabaseAdmin
      .from('verification_codes')
      .update({ used: true })
      .eq('id', data.id);

    return NextResponse.json({ verified: true });

  } catch (err) {
    console.error('verify-code error:', err);
    return NextResponse.json({ verified: false, error: 'Verification failed' }, { status: 500 });
  }
}