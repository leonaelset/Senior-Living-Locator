import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete any existing unused codes for this phone
    await supabaseAdmin
      .from('verification_codes')
      .delete()
      .eq('phone', phone)
      .eq('used', false);

    // Insert new code
    const { error: insertError } = await supabaseAdmin
      .from('verification_codes')
      .insert({ phone, code, expires_at: expiresAt, used: false });

    if (insertError) {
      return NextResponse.json({ error: 'Failed to store code' }, { status: 500 });
    }

    // Send SMS via Twilio
    await client.messages.create({
      body: `Your Texas Senior Living verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: phone,
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('send-verification error:', err);
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 });
  }
}