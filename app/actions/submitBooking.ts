// app/actions/submitBooking.ts
'use server'

import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const TEST_MODE = process.env.TEST_MODE === 'true';
const TEST_EMAIL = process.env.TEST_EMAIL!;

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  communitySlug: string;
}

export async function submitBooking(formData: BookingFormData) {
  // Validation
  if (!formData.name || !formData.phone || !formData.email || !formData.preferredDate || !formData.preferredTime || !formData.communitySlug) {
    return { success: false, error: 'Missing required fields' };
  }

  // 1. Save to Supabase
  const { error: insertError } = await supabaseAdmin
    .from('bookings')
    .insert({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      preferred_date: formData.preferredDate,
      preferred_time: formData.preferredTime,
      community_slug: formData.communitySlug,
      status: 'Pending',
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error('Failed to save booking:', insertError);
  }

  // 2. Fetch community details
  const { data: community, error: communityError } = await supabase
    .from('communities')
    .select('email, address, name')
    .eq('slug', formData.communitySlug)
    .single();

  if (communityError || !community) {
    console.error('Community not found:', communityError);
    return { success: false, error: 'Community not found' };
  }

  // 3. Email to admin (unchanged)
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: ADMIN_EMAIL,
    subject: `New Tour Request — ${community.name}`,
    html: `
      <h2>New Tour Request</h2>
      <p><strong>Visitor:</strong> ${formData.name}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Preferred Date:</strong> ${formData.preferredDate}</p>
      <p><strong>Preferred Time:</strong> ${formData.preferredTime}</p>
      <p><strong>Community:</strong> ${community.name}</p>
      <p><strong>Address:</strong> ${community.address}</p>
    `,
  }).catch(e => console.error('Admin email failed:', e));

  // 4. Email to the community (with test mode override)
  const communityEmail = TEST_MODE ? TEST_EMAIL : community.email;
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: communityEmail,
    subject: `Tour Request from ${formData.name} — via Texas Senior Living Locator`,
    html: `
      <p>Hello,</p>
      <p>You have received a new tour request through Texas Senior Living Locator.</p>
      <p><strong>Visitor:</strong> ${formData.name}<br/>
      <strong>Phone:</strong> ${formData.phone}<br/>
      <strong>Email:</strong> ${formData.email}<br/>
      <strong>Preferred Visit:</strong> ${formData.preferredDate} — ${formData.preferredTime}</p>
      <p>This referral was sent by Texas Senior Living Locator. Please reach out to confirm the appointment. If this visitor moves in, this constitutes a formal referral under our agreement.</p>
      <p>Questions? Reply to this email or contact us at ${ADMIN_EMAIL}.</p>
      <p>Texas Senior Living Locator</p>
    `,
  }).catch(e => console.error('Community email failed:', e));

  // 5. Email to visitor (unchanged)
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: formData.email,
    subject: `Your Tour Request — ${community.name}`,
    html: `
      <p>Hi ${formData.name},</p>
      <p>Your tour request has been received!</p>
      <p><strong>Community:</strong> ${community.name}<br/>
      <strong>Address:</strong> ${community.address}<br/>
      <strong>Requested Visit:</strong> ${formData.preferredDate} — ${formData.preferredTime}</p>
      <p>A member of our team will call you within 24 hours to confirm your appointment.</p>
      <p>If you have any questions in the meantime, reply to this email.</p>
      <p>Texas Senior Living Locator</p>
    `,
  }).catch(e => console.error('Visitor email failed:', e));

  return { success: true };
}