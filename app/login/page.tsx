'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/utils/supabase'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [origin, setOrigin] = useState('')
  const supabase = createClient()

  useEffect(() => {
    // This detect if we are on localhost or the live Vercel site
    setOrigin(window.location.origin)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50 text-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-600 tracking-tight">Save-n-Deliver Login</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['github']}
          // This tells Supabase exactly where to send the user back to
          redirectTo={`${origin}/auth/callback`}
        />
      </div>
    </div>
  )
}
