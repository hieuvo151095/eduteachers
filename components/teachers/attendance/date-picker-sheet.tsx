'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface DatePickerSheetProps {
  selectedDate: string // dd/MM/yyyy
  todayStr: string
  onConfirm: (date: string) => void
  onClose: () => void
}

function parseDate(str: string): Date {
  const [d, m, y] = str.split('/').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export function DatePickerSheet({ selectedDate, todayStr, onConfirm, onClose }: DatePickerSheetProps) {
  const initial = parseDate(selectedDate)
  const [viewMonth, setViewMonth] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1))
  const [pending, setPending] = useState(selectedDate)

  const firstWeekday = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay()

  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1 + (i - firstWeekday))
    return { day: d.getDate(), inMonth: d.getMonth() === viewMonth.getMonth(), dateStr: formatDate(d) }
  })

  const monthLabel = `Tháng ${viewMonth.getMonth() + 1} ${viewMonth.getFullYear()}`

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div className="rounded-t-2xl bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
        <div className="relative flex items-center justify-center px-4 py-3">
          <button onClick={onClose} className="absolute left-4 p-1 text-gray-500 active:text-black">
            <X size={18} />
          </button>
          <p className="text-sm font-bold text-black">Chọn ngày</p>
        </div>

        <div className="px-4 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <button
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
              className="p-1 text-gray-500 active:text-black"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-sm font-semibold text-black">{monthLabel}</p>
            <button
              onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              className="p-1 text-gray-500 active:text-black"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-[11px] font-semibold text-gray-400">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1 pb-2">
            {cells.map((c, i) => {
              const isSelected = c.dateStr === pending
              return (
                <button
                  key={i}
                  onClick={() => setPending(c.dateStr)}
                  className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                    isSelected
                      ? 'bg-orange-400 font-bold text-white'
                      : c.inMonth
                        ? 'font-medium text-black active:bg-gray-100'
                        : 'text-gray-300'
                  }`}
                >
                  {c.day}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 p-4 pb-6">
          <button
            onClick={() => {
              setPending(todayStr)
              setViewMonth(new Date(parseDate(todayStr).getFullYear(), parseDate(todayStr).getMonth(), 1))
            }}
            className="flex-1 rounded-xl border border-gray-300 bg-white py-3 text-sm font-semibold text-black active:bg-gray-50"
          >
            Đặt lại
          </button>
          <button
            onClick={() => onConfirm(pending)}
            className="flex-1 rounded-xl bg-orange-400 py-3 text-sm font-bold text-white active:opacity-90"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}
