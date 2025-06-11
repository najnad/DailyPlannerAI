'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login') // Removed 'magic'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // 🧠 Validate password match in signup mode
    if (mode === 'signup' && password !== confirmPassword) {
      setMessage('Passwords do not match.')
      setLoading(false)
      return
    }

    let result:
      | Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>
      | Awaited<ReturnType<typeof supabase.auth.signUp>>
      | undefined

    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password })
      if (result.error) {
        setMessage(result.error.message)
      } else {
        router.push('/dashboard')
      }
    } else if (mode === 'signup') {
      result = await supabase.auth.signUp({ email, password })
    }

    if (!result) {
      setMessage('Unexpected error. Please try again.')
    } else if (result.error) {
      setMessage(result.error.message)
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded text-black"
        />

        {mode === 'signup' && (
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded text-black"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Loading...' : mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}

      <div className="mt-6 text-center space-x-2 text-sm">
        {mode !== 'login' && (
          <button onClick={() => setMode('login')} className="text-blue-600 hover:underline">
            Switch to Login
          </button>
        )}
        {mode !== 'signup' && (
          <button onClick={() => setMode('signup')} className="text-blue-600 hover:underline">
            Sign Up
          </button>
        )}
      </div>
    </div>
  )
}
