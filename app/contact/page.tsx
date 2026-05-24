// app/contact/page.tsx
'use client'

import { useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { submitLead } from '@/app/actions/submitLead'
import { LeadFormData } from '@/lib/types'

export default function ContactPage() {
  const searchParams = useSearchParams()
  const communitySlug = searchParams.get('community') || ''
  const communityName = searchParams.get('name') || ''

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const lead: LeadFormData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      whoFor: formData.get('whoFor') as LeadFormData['whoFor'],
      notes: formData.get('notes') as string,
      communitySlug,
      communityName,
    }

    const result = await submitLead(lead)
    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error || 'Something went wrong. Please try again.')
    }
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm text-center">
          <h1 className="font-fraunces font-bold text-2xl text-[#1A1714] mb-3">
            You're all set.
          </h1>
          <p className="font-dm-sans text-[#1A1714] mb-2">
            We'll reach out within 24 hours to learn more about what you need.
          </p>
          <p className="font-dm-sans text-[#6B6B6B] text-sm">
            You can close this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {communityName && (
          <div className="flex justify-center mb-4">
            <span className="bg-white border border-[#E5E5E5] text-[#6B6B6B] text-sm font-dm-sans font-medium px-4 py-1.5 rounded-full shadow-sm">
              Inquiring about: {communityName}
            </span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-6 md:p-8 shadow-sm">
          <h1 className="font-fraunces font-bold text-2xl md:text-3xl text-[#1A1714] text-center mb-2">
            Let's Find the Right Community
          </h1>
          <p className="font-dm-sans text-[#6B6B6B] text-center mb-6">
            Tell us what you're looking for and we'll match you with the best senior living communities in Texas — no cost, no pressure.
          </p>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#1A1714] font-dm-sans mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-white border-2 border-[#E5E5E5] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-[#1A1714] font-dm-sans mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full bg-white border-2 border-[#E5E5E5] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#1A1714] font-dm-sans mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-white border-2 border-[#E5E5E5] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none transition-colors"
              />
            </div>

            {/* Who is this for? */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1714] font-dm-sans mb-2">
                Who is this for? *
              </label>
              <div className="flex flex-wrap gap-3">
                {(['Myself', 'Parent', 'Spouse', 'Other'] as const).map((option) => (
                  <label key={option} className="cursor-pointer">
                    <input
                      type="radio"
                      name="whoFor"
                      value={option}
                      required
                      className="peer sr-only"
                    />
                    <span className="inline-block px-5 py-2 rounded-full border-2 border-[#E5E5E5] bg-white text-[#1A1714] font-dm-sans text-sm font-medium transition-all peer-checked:bg-[#1A1714] peer-checked:text-white peer-checked:border-[#1A1714]">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes (optional) */}
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-[#1A1714] font-dm-sans mb-1">
                Additional Notes <span className="font-normal text-[#6B6B6B]">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Any details about timeline, specific needs, or questions..."
                className="w-full bg-white border-2 border-[#E5E5E5] rounded-xl px-4 py-3 focus:border-[#1A1714] outline-none transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border border-[#1A1714] bg-[#1A1714] text-white font-fraunces font-bold py-4 hover:bg-[#2a2a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit — It\'s Free'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}