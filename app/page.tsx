'use client'

import { useState } from 'react'
import { TeachersHomeScreen } from '@/components/teachers/home-screen'
import { ThucDonLopApp } from '@/components/teachers/thuc-don-lop'

export default function Page() {
  const [screen, setScreen] = useState<'home' | 'thuc-don'>('home')

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-xl">
        {screen === 'home' && (
          <TeachersHomeScreen onNavigateToThucDon={() => setScreen('thuc-don')} />
        )}
        {screen === 'thuc-don' && (
          <ThucDonLopApp onBack={() => setScreen('home')} />
        )}
      </div>
    </main>
  )
}
