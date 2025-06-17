'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  // 🔄 Check auth state on mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setAuthChecked(true)
    }

    checkSession()

    // Real-time auth state change listener
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'global' })
    router.push('/')
  }

  if (!authChecked) return null

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Title */}
          <Link href="/" className="text-xl font-bold text-black">
            SmartPlanner
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {isLoggedIn && (
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-500">
                Dashboard
              </Link>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 transition"
              >
                Log Out
              </button>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-blue-500">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {isLoggedIn && (
            <Link href="/dashboard" className="block text-gray-700 hover:text-blue-500">
              Dashboard
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block text-red-600 hover:text-red-800 w-full text-left"
            >
              Log Out
            </button>
          ) : (
            <Link href="/login" className="block text-gray-700 hover:text-blue-500">Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}
