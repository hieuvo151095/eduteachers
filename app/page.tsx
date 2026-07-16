'use client'

import { useState } from 'react'
import { TeachersHomeScreen } from '@/components/teachers/home-screen'
import { ThucDonLopApp } from '@/components/teachers/thuc-don-lop'
import { AttendanceApp } from '@/components/teachers/attendance'
import { MessagingApp } from '@/components/teachers/messaging'

export default function Page() {
  const [screen, setScreen] = useState<'home' | 'thuc-don' | 'attendance' | 'messaging'>('home')

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-300 p-6">
      {/* Phone frame — fixed 390×844, never changes between screens */}
      <div
        className="relative flex shrink-0 flex-col overflow-hidden bg-black"
        style={{
          width: 390,
          height: 844,
          borderRadius: 52,
          boxShadow:
            '0 0 0 1px #444, 0 0 0 3px #222, 0 30px 80px rgba(0,0,0,0.55), inset 0 0 0 1px #555',
        }}
      >
        {/* Side buttons — purely decorative */}
        {/* Volume up */}
        <div className="absolute -left-[3px] top-[160px] h-10 w-[3px] rounded-l-sm bg-gray-600" />
        {/* Volume down */}
        <div className="absolute -left-[3px] top-[210px] h-10 w-[3px] rounded-l-sm bg-gray-600" />
        {/* Power */}
        <div className="absolute -right-[3px] top-[185px] h-14 w-[3px] rounded-r-sm bg-gray-600" />

        {/* Screen area */}
        <div
          className="relative flex flex-1 flex-col overflow-hidden bg-white"
          style={{ borderRadius: 44 }}
        >
          {/* Status bar */}
          <div className="flex shrink-0 items-center justify-between bg-white px-7 pt-3 pb-1">
            <span className="text-[13px] font-semibold text-black">16:22</span>
            <div className="absolute left-1/2 top-3 -translate-x-1/2">
              {/* Dynamic Island pill */}
              <div className="h-[26px] w-[110px] rounded-full bg-black" />
            </div>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <svg viewBox="0 0 20 14" className="h-3 w-4" fill="currentColor">
                <rect x="0" y="10" width="3" height="4" rx="0.5" />
                <rect x="4.25" y="7" width="3" height="7" rx="0.5" />
                <rect x="8.5" y="4" width="3" height="10" rx="0.5" />
                <rect x="12.75" y="1" width="3" height="13" rx="0.5" />
              </svg>
              {/* Wifi */}
              <svg viewBox="0 0 20 14" className="h-3 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 5c5-5 13-5 18 0" opacity="0.4" />
                <path d="M4 8.5c3-3 9-3 12 0" opacity="0.7" />
                <path d="M7.5 12c1.5-1.5 4-1.5 5 0" />
                <circle cx="10" cy="13.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              {/* Battery */}
              <div className="flex items-center gap-0.5">
                <div className="relative h-3 w-6 rounded-[3px] border border-black">
                  <div className="absolute inset-[1.5px] right-[2px] rounded-[1px] bg-black" />
                </div>
                <div className="h-1.5 w-[2px] rounded-r-sm bg-black" />
              </div>
            </div>
          </div>

          {/* Scrollable screen content */}
          <div className="relative flex-1 overflow-y-auto overflow-x-hidden">
            {screen === 'home' && (
              <TeachersHomeScreen 
                onNavigateToThucDon={() => setScreen('thuc-don')}
                onNavigateToDiemDanh={() => setScreen('attendance')}
                onNavigateToMessaging={() => setScreen('messaging')}
              />
            )}
            {screen === 'thuc-don' && (
              <ThucDonLopApp onBack={() => setScreen('home')} />
            )}
            {screen === 'attendance' && (
              <AttendanceApp onBack={() => setScreen('home')} />
            )}
            {screen === 'messaging' && (
              <MessagingApp onBack={() => setScreen('home')} />
            )}
          </div>

          {/* Home indicator */}
          <div className="flex shrink-0 items-center justify-center bg-white py-2">
            <div className="h-1 w-28 rounded-full bg-black/20" />
          </div>
        </div>
      </div>
    </main>
  )
}
