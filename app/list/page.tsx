'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function GroceryList() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchCart = async () => {
      const { data, error } = await supabase.from('cart').select('*')
      if (error) console.error("Error fetching cart:", error)
      if (data) setItems(data)
    }
    fetchCart()
  }, [supabase])

  const storeTotals = items.reduce((acc, item) => {
    acc[item.store_name] = (acc[item.store_name] || 0) + item.price
    return acc
  }, {} as Record<string, number>)

  const grandTotal = items.reduce((sum, item) => sum + item.price, 0)

  const handleCheckout = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert("Please log in to finalize your order.")
      setLoading(false)
      return
    }

    // 1. Save the order to the 'orders' table
    const { error: orderError } = await supabase.from('orders').insert([
      {
        user_id: user.id,
        items: items, // This saves the snapshot of all items
        total_price: grandTotal,
        status: 'Processing'
      }
    ])

    if (orderError) {
      console.error("Order Error:", orderError)
      alert("Failed to save order.")
      setLoading(false)
      return
    }

    // 2. Clear the cart for this user
    const { error: clearError } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id)

    if (clearError) {
      console.error("Clear Cart Error:", clearError)
    }

    // 3. Send to Tracking Page
    router.push('/tracking')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-2">My Grocery List</h1>
        
        {items.length > 0 && (
          <div className="mb-8 p-4 bg-green-100 border-l-4 border-green-600 rounded-r-lg shadow-sm">
            <p className="text-green-800 text-sm font-bold uppercase tracking-wider">Estimated Total Cost</p>
            <p className="text-4xl font-black text-green-700">${grandTotal.toFixed(2)}</p>
          </div>
        )}

        <div className="space-y-6">
          {Object.keys(storeTotals).map((store) => (
            <div key={store} className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden">
              <div className="bg-green-600 p-3 flex justify-between items-center text-white">
                <h2 className="font-bold uppercase tracking-wide">{store}</h2>
                <div className="text-right">
                    <p className="text-xs opacity-80 leading-none">Store Total</p>
                    <span className="text-xl font-black">${storeTotals[store].toFixed(2)}</span>
                </div>
              </div>
              <ul className="p-4 space-y-2">
                {items.filter(i => i.store_name === store).map((item, idx) => (
                  <li key={idx} className="flex justify-between text-gray-700 border-b border-gray-50 pb-1 last:border-0">
                    <span>{item.product_name}</span>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {items.length > 0 ? (
            <div className="mt-10 p-6 bg-white rounded-2xl shadow-xl border-2 border-green-600 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Save?</h3>
              <p className="text-gray-500 mb-6 text-sm">This will finalize your multi-store order and clear your current list.</p>
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 shadow-lg transition disabled:bg-gray-400"
              >
                {loading ? 'PROCESSING...' : 'APPROVE ORDER & TRACK'}
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Your list is empty.</p>
              <a href="/search" className="text-green-600 font-bold underline">Go find some deals!</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
