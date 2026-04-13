import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Save-n-Deliver',
  description: 'Smart multi-store grocery shopping',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b p-4 flex justify-center gap-8 shadow-sm">
          <a href="/" className="text-green-600 font-bold hover:underline">Hub</a>
          <a href="/search" className="text-green-600 font-bold hover:underline">Search</a>
          <a href="/list" className="text-green-600 font-bold hover:underline">My List</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
