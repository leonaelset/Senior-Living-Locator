'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCommunity } from '@/app/actions/adminActions'

const cities = ['Houston', 'Austin', 'San Antonio'] as const
const careTypes = ['Independent Living', 'Assisted Living', 'Memory Care', 'Skilled Nursing']

export default function CommunityForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [amenities, setAmenities] = useState<string[]>([])
  const [amenityInput, setAmenityInput] = useState('')
  const [images, setImages] = useState<string[]>([''])
  const [slug, setSlug] = useState('')
  const [name, setName] = useState('')

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === generateSlug(slug)) {
      setSlug(generateSlug(value))
    }
  }

  const addAmenity = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && amenityInput.trim()) {
      e.preventDefault()
      setAmenities([...amenities, amenityInput.trim()])
      setAmenityInput('')
    }
  }

  const removeAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index))
  }

  const addImageField = () => {
    if (images.length < 5) setImages([...images, ''])
  }

  const updateImage = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      city: formData.get('city') as string,
      address: formData.get('address') as string,
      careTypes: careTypes.filter(type => formData.getAll('careTypes').includes(type)),
      priceMin: parseInt(formData.get('priceMin') as string),
      priceMax: parseInt(formData.get('priceMax') as string),
      description: formData.get('description') as string,
      amenities: amenities,
      images: images.filter(url => url.trim() !== ''),
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      rating: 0,
      reviewCount: 0,
    }
    const result = await createCommunity(data)
    if (result.success) {
      router.push('/admin/communities')
    } else {
      alert(result.error || 'Failed to create community')
    }
    setIsSubmitting(false)
  }

  return (
    <form action={handleSubmit} className="bg-[#F7F3EE] rounded-2xl border border-[#DDD6CC] p-6 space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">Name *</label>
        <input
          type="text"
          name="name"
          required
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none transition-colors font-dm-sans font-light"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">Slug *</label>
        <input
          type="text"
          name="slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none transition-colors font-dm-sans font-light"
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">City *</label>
        <select
          name="city"
          required
          className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none font-dm-sans font-light"
        >
          <option value="">Select city</option>
          {cities.map(city => <option key={city}>{city}</option>)}
        </select>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">Address *</label>
        <input type="text" name="address" required className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none font-dm-sans font-light" />
      </div>

      {/* Care Types */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-2">Care Types *</label>
        <div className="flex flex-wrap gap-4">
          {careTypes.map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="careTypes" value={type} className="w-4 h-4 accent-[#1A1714]" />
              <span className="text-sm font-light">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Min / Max */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1714] mb-1">Min Price ($) *</label>
          <input type="number" name="priceMin" required className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1A1714] mb-1">Max Price ($) *</label>
          <input type="number" name="priceMax" required className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">Description *</label>
        <textarea name="description" rows={5} required className="w-full bg-white border-2 border-[#DDD6CC] rounded-2xl px-4 py-3 focus:border-[#1A1714] outline-none font-dm-sans font-light" />
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">Amenities</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {amenities.map((a, i) => (
            <span key={i} className="bg-[#EDE8DF] border border-[#DDD6CC] rounded-full px-3 py-1 text-sm flex items-center gap-1 font-light">
              {a}
              <button type="button" onClick={() => removeAmenity(i)} className="text-[#7A6F65] hover:text-[#1A1714]">×</button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={amenityInput}
          onChange={(e) => setAmenityInput(e.target.value)}
          onKeyDown={addAmenity}
          placeholder="Type an amenity and press Enter"
          className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none font-dm-sans font-light"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">Images (URLs)</label>
        {images.map((url, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="url"
              value={url}
              onChange={(e) => updateImage(idx, e.target.value)}
              placeholder="https://..."
              className="flex-1 bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none font-dm-sans font-light"
            />
            {images.length > 1 && (
              <button type="button" onClick={() => removeImage(idx)} className="px-3 text-red-500">Remove</button>
            )}
          </div>
        ))}
        {images.length < 5 && (
          <button type="button" onClick={addImageField} className="text-sm text-[#1A1714] underline hover:text-[#C4906A] transition">+ Add Another Image</button>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">Phone *</label>
        <input type="tel" name="phone" required className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none font-dm-sans font-light" />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[#1A1714] mb-1">Email *</label>
        <input type="email" name="email" required className="w-full bg-white border-2 border-[#DDD6CC] rounded-full px-4 py-3 focus:border-[#1A1714] outline-none font-dm-sans font-light" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full border border-[#1A1714] bg-[#1A1714] text-white font-dm-sans font-medium px-6 py-3 hover:bg-[#2a2a2a] transition disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Community'}
      </button>
    </form>
  )
}