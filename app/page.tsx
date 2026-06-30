'use client'

import { ThucDonLopApp } from '@/components/teachers/thuc-don-lop'

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-lg">
        <ThucDonLopApp />
      </div>
    </main>
  )
}
