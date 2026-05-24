// app/actions/adminActions.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function adminLogin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (password === adminPassword) {
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return { success: true }
  }
  return { success: false }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/')
}

export async function updateLeadStatus(id: string, status: string) {
  const { error } = await supabaseAdmin
    .from('leads')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error(error)
    return { success: false, error: error.message }
  }
  revalidatePath('/admin/leads')
  return { success: true }
}

export async function deleteCommunity(id: string) {
  const { error } = await supabaseAdmin
    .from('communities')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(error)
    return { success: false, error: error.message }
  }
  revalidatePath('/admin/communities')
  return { success: true }
}

export async function createCommunity(data: any) {
  if (!data.name || !data.slug || !data.city || !data.address || !data.priceMin || !data.priceMax || !data.phone || !data.email) {
    return { success: false, error: 'Missing required fields' }
  }

  const { error } = await supabaseAdmin
    .from('communities')
    .insert({
      name: data.name,
      slug: data.slug,
      city: data.city,
      address: data.address,
      care_types: data.careTypes,
      price_min: data.priceMin,
      price_max: data.priceMax,
      description: data.description,
      amenities: data.amenities,
      images: data.images,
      phone: data.phone,
      email: data.email,
      rating: data.rating || 0,
      review_count: data.reviewCount || 0,
    })

  if (error) {
    console.error(error)
    return { success: false, error: error.message }
  }
  revalidatePath('/admin/communities')
  return { success: true }
}