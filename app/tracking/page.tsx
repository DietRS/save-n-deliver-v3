'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase'

export default function TrackingPage() {
  const [orders, setOrders] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error("Error fetching orders:", error)
      }
      if (data) {
        setOrders(data)
      }
    }
    fetchOrders()
  }, [supabase])

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Order Tracking</h1>
        
        <div className="space-y-6">
          {orders.map((order) => {
            // Fix: Convert ID to string before slicing to prevent the error
            const displayId = String(order.id).slice(0, 8)
            
            return (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p className="font-mono text-sm">#{displayId}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {order.status || 'Processing'}
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-50 py-4 my-4">
                  <p className="text-sm text-gray-500">
                    {Array.isArray(order.items) ? order.items.length : 0} items from various stores
                  </p>
                  <p className="text-2xl font-black text-green-600">${Number(order.total_price).toFixed(2)}</p>
                </div>

                <div className="flex gap-2">
                  <div className="w-1/3 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
                  <div className="w-1/3 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">
                  Status: We are preparing your order summary.
                </p>
              </div>
            )
          })}

          {orders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-400">No active orders yet.</p>
              <a href="/list" className="text-green-600 font-bold hover:underline mt-2 inline-block">
                Go to my list to approve an order
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
