import { supabaseAdmin } from '@/lib/supabase-admin'
import LeadsTable from '@/components/admin/LeadsTable'

export default async function AdminLeadsPage() {
  const { data: leads, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return <div className="text-red-600">Failed to load leads</div>
  }

  const total = leads.length
  const newCount = leads.filter(l => l.status === 'New').length
  const placedCount = leads.filter(l => l.status === 'Placed').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-fraunces font-bold text-3xl text-[#1A1714] mb-4">Leads</h1>
        <div className="flex gap-4">
          <StatPill label="Total" value={total} />
          <StatPill label="New" value={newCount} />
          <StatPill label="Placed" value={placedCount} />
        </div>
      </div>
      <LeadsTable leads={leads} />
    </div>
  )
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#F7F3EE] border border-[#DDD6CC] rounded-full px-5 py-2">
      <div className="text-xs text-[#7A6F65] font-dm-sans uppercase tracking-[0.25em] font-medium">{label}</div>
      <div className="text-2xl font-fraunces font-bold text-[#1A1714]">{value}</div>
    </div>
  )
}