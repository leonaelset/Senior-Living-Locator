'use client'

import { useState } from 'react'
import { adminLogin } from '@/app/actions/adminActions'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError('')
    const password = formData.get('password') as string
    const result = await adminLogin(password)
    if (result.success) {
      router.push('/admin/leads')
    } else {
      setError('Incorrect password')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#EDE8DF] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#F7F3EE] rounded-2xl border border-[#DDD6CC] p-8">
        <h1 className="font-fraunces font-bold text-2xl text-[#1A1714] text-center mb-6">
          Admin Access
        </h1>
        <form action={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1A1714] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none transition-colors font-dm-sans font-light"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm font-dm-sans font-light">{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full border border-[#1A1714] bg-[#1A1714] text-white py-3 font-dm-sans font-medium hover:bg-[#2a2a2a] transition disabled:opacity-50"
          >
            {isLoading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}