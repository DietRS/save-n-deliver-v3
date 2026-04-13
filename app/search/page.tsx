'use client'

import React, { useState } from 'react'
import { createClient } from '@/utils/supabase'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [status, setStatus] = useState('') 
  const supabase = createClient()

  const handleSearch = async () => {
    setStatus('')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`) 
      .order('price', { ascending: true }) 
      .limit(3) 

    if (data) setResults(data)
    if (error) console.error("Search Error:", error)
  }

  const addItemToCart = async (item: any) => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setStatus('Please log in first!')
      return
    }

    const { error } = await supabase
      .from('cart')
      .insert([
        { 
          user_id: user.id, 
          product_name: item.name, 
          price: item.price, 
          store_name: item.store_name 
        }
      ])

    if (error) {
      console.error("Add to cart error:", error)
      setStatus('Error adding item.')
    } else {
      setStatus(`Added ${item.name} from ${item.store_name} to your list!`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-green-600 mb-6">Price Finder</h1>
        
        <div className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for Milk, Eggs..." 
            className="flex-1 p-3 border rounded-lg shadow-sm"
          />
          <button 
            onClick={handleSearch}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition"
          >
            Search
          </button>
        </div>

        {status && <p className="mb-4 text-center font-bold text-blue-600 bg-blue-50 p-2 rounded">{status}</p>}

        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-gray-500">{item.store_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-green-600">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addItemToCart(item)}
                    className="block mt-2 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-100"
                  >
                    + Add to List
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">Search to find the lowest prices.</p>
          )}
        </div>
      </div>
    </div>
  )
}
