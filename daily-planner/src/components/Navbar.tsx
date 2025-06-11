'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
            <Link href="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
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
          <Link href="/dashboard" className="block text-gray-700 hover:text-blue-500">Dashboard</Link>
          <Link href="/login" className="block text-gray-700 hover:text-blue-500">Login</Link>
        </div>
      )}
    </nav>
  )
}
