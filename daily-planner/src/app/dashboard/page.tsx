'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import LogoutButton from '@/components/LogoutButton'
import NewTaskButton from "@/components/NewTaskButton";

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setIsLoggedIn(!!session)
    }

    getSession()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">My Tasks</h1>
      <NewTaskButton />
      {/* Later: Add Task List here */}
    </div>
  )
}
