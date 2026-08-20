'use client'

import { X, Check } from 'lucide-react'
import type { ThucDonTuan } from '@/lib/mock-data'

interface WeekPickerSheetProps {
  weeks: ThucDonTuan[]
  selectedWeekId: string
  onSelect: (week: ThucDonTuan) => void
  onClose: () => void
}

export function WeekPickerSheet({ weeks, selectedWeekId, onSelect, onClose }: WeekPickerSheetProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div className="mx-auto w-full max-w-sm rounded-t-2xl bg-white px-5 py-5" onClick={(e) => e.stopPropagation()}>
        <div className="relative mb-4 flex items-center justify-center">
          <h2 className="text-base font-bold text-black">Chọn tuần</h2>
          <button
            onClick={onClose}
            className="absolute right-0 flex h-7 w-7 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {weeks.map((week) => {
            const isActive = week.id === selectedWeekId
            return (
              <button
                key={week.id}
                onClick={() => onSelect(week)}
                className={`relative flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left ${
                  isActive ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white active:bg-gray-50'
                }`}
              >
                <span className="text-base">📅</span>
                <span className="text-sm font-medium text-black">{week.label}</span>
                {isActive && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
