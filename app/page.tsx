'use client'

import { useState } from 'react'
import { TeachersHomeScreen } from '@/components/teachers/home-screen'
import { ThucDonLopScreen } from '@/components/teachers/thuc-don-lop'

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'menu'>('home')

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg shadow-lg overflow-hidden">
        {currentScreen === 'home' && (
          <TeachersHomeScreen onNavigateToThucDon={() => setCurrentScreen('menu')} />
        )}
        {currentScreen === 'menu' && (
          <div className="bg-white">
            <button
              onClick={() => setCurrentScreen('home')}
              className="sticky top-0 left-0 p-4 text-gray-600 z-50"
            >
              ← Quay lại
            </button>
            <ThucDonLopScreen />
          </div>
        )}
      </div>
    </main>
  )
}
