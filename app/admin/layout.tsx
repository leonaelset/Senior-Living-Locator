import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { adminLogout } from '@/app/actions/adminActions'
import NavLink from '@/components/admin/NavLink'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('admin_auth')?.value === 'true'

  if (!isAuthenticated) {
    redirect('/admin-login')
  }

  return (
    <div className="flex min-h-screen bg-[#EDE8DF]">
      <aside className="w-56 bg-[#F7F3EE] border-r border-[#DDD6CC] flex flex-col">
        <div className="p-6 border-b border-[#DDD6CC]">
          <h1 className="font-fraunces font-bold text-xl text-[#1A1714]">
            Texas Senior<br />Living Admin
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/admin/leads">Leads</NavLink>
          <NavLink href="/admin/communities">Communities</NavLink>
        </nav>
        <div className="p-4 border-t border-[#DDD6CC]">
          <form action={adminLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-dm-sans font-light text-[#1A1714] rounded-full hover:bg-[#EDE8DF] transition-colors"
            >
              <LogOut size={16} />
              Log Out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}