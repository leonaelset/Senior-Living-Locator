import { Resend } from 'resend'
import { LeadFormData } from '@/lib/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLeadEmail(lead: LeadFormData) {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: process.env.ADMIN_EMAIL!,
    subject: `New Lead: ${lead.name} → ${lead.communityName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1A1714;">New Lead Submitted</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #7A6F65;">Name</td><td style="padding: 8px 0; font-weight: bold;">${lead.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #7A6F65;">Phone</td><td style="padding: 8px 0;">${lead.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #7A6F65;">Email</td><td style="padding: 8px 0;">${lead.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #7A6F65;">Looking for</td><td style="padding: 8px 0;">${lead.whoFor}</td></tr>
          <tr><td style="padding: 8px 0; color: #7A6F65;">Community</td><td style="padding: 8px 0;">${lead.communityName}</td></tr>
          <tr><td style="padding: 8px 0; color: #7A6F65;">Notes</td><td style="padding: 8px 0;">${lead.notes || 'None'}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #DDD6CC; margin: 24px 0;" />
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/leads" 
           style="background: #1A1714; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          View All Leads
        </a>
      </div>
    `,
  })
}