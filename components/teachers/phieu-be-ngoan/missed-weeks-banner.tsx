'use client'

import { AlertTriangle } from 'lucide-react'
import type { PhieuChuKyOption } from '@/lib/mock-data'

interface MissedWeeksBannerProps {
  weeks: PhieuChuKyOption[]
  onPhatBuNgay: () => void
}

export function MissedWeeksBanner({ weeks, onPhatBuNgay }: MissedWeeksBannerProps) {
  if (weeks.length === 0) return null

  return (
    <div className="mx-4 mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-800">Có {weeks.length} tuần chưa phát phiếu:</p>
          <ul className="mt-1 space-y-0.5">
            {weeks.map((w) => (
              <li key={w.id} className="text-xs text-amber-700">
                • Tuần {w.label}
              </li>
            ))}
          </ul>
          <button
            onClick={onPhatBuNgay}
            className="mt-2 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white active:bg-amber-700"
          >
            Phát bù ngay
          </button>
        </div>
      </div>
    </div>
  )
}
