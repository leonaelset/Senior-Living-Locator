'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { LeadFormData } from '@/lib/types'
import { sendLeadEmail } from '@/lib/sendLeadEmail'

export async function submitLead(data: LeadFormData) {
  if (!data.name || !data.phone || !data.email) {
    return { success: false, error: 'Missing required fields' }
  }

  const { error } = await supabaseAdmin
    .from('leads')
    .insert({
      community_name: data.communityName,
      community_slug: data.communitySlug,
      name: data.name,
      phone: data.phone,
      email: data.email,
      who_for: data.whoFor,
      notes: data.notes || '',
      status: 'New',
    })

  if (error) {
    console.error(error)
    return { success: false, error: 'Failed to save lead' }
  }

  try {
    await sendLeadEmail(data)
  } catch (emailError) {
    console.error('Email failed:', emailError)
  }

  return { success: true }
}