import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase'

export default async function Home() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  // Check if there is a real user session
  const { data: { user } } = await supabase.auth.getUser()

  // If no user, kick them back to the login page
  if (!user) {
    redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-2">Save-n-Deliver</h1>
        <p className="text-gray-500 mb-8">Welcome back, {user.email}</p>
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1">Total Savings</div>
          <div className="text-5xl font-black text-green-600 mb-6">$0.00</div>
          
          <div className="grid grid-cols-1 gap-4">
            <button className="py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition">
              + New Search
            </button>
            <button className="py-4 bg-white text-green-600 font-bold border-2 border-green-600 rounded-xl hover:bg-green-50 transition">
              View Order History
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
