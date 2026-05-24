'use client'

import { useState } from 'react'
import { updateLeadStatus } from '@/app/actions/adminActions'

interface Lead {
  id: string
  created_at: string
  name: string
  phone: string
  email: string
  who_for: string
  community_name: string
  status: string
  notes: string
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    await updateLeadStatus(id, newStatus)
    setUpdatingId(null)
    window.location.reload()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#EDE8DF] border border-[#DDD6CC] text-[#1A1714]">New</span>
      case 'Contacted':
        return <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#1A1714] text-white">Contacted</span>
      case 'Placed':
        return <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#C4906A] text-[#1A1714]">Placed</span>
      default:
        return <span>{status}</span>
    }
  }

  return (
    <div className="bg-[#F7F3EE] rounded-2xl border border-[#DDD6CC] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#EDE8DF] border-b border-[#DDD6CC]">
            <tr>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[#7A6F65]">Date</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[#7A6F65]">Name</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[#7A6F65]">Phone</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[#7A6F65]">Email</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[#7A6F65]">Who For</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[#7A6F65]">Community</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[#7A6F65]">Status</th>
              <th className="px-4 py-3 text-xs uppercase tracking-[0.25em] font-medium text-[#7A6F65]">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDD6CC]">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#EDE8DF] transition-colors">
                <td className="px-4 py-3 text-sm text-[#1A1714] font-light">{formatDate(lead.created_at)}</td>
                <td className="px-4 py-3 text-sm font-medium text-[#1A1714]">{lead.name}</td>
                <td className="px-4 py-3 text-sm">
                  <a href={`tel:${lead.phone}`} className="text-[#1A1714] hover:text-[#C4906A] font-light">{lead.phone}</a>
                </td>
                <td className="px-4 py-3 text-sm">
                  <a href={`mailto:${lead.email}`} className="text-[#1A1714] hover:text-[#C4906A] font-light">{lead.email}</a>
                </td>
                <td className="px-4 py-3 text-sm text-[#1A1714] font-light">{lead.who_for}</td>
                <td className="px-4 py-3 text-sm text-[#1A1714] font-light">{lead.community_name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      disabled={updatingId === lead.id}
                      className="bg-white border border-[#DDD6CC] rounded-full px-2 py-1 text-sm font-light focus:outline-none"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Placed">Placed</option>
                    </select>
                    {getStatusBadge(lead.status)}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[#7A6F65] font-light max-w-xs truncate" title={lead.notes || ''}>
                  {lead.notes?.slice(0, 40) || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}