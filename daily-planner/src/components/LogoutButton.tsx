'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabaseClient'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/') // or '/login' if you prefer a login page
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Log Out
    </button>
  )
}