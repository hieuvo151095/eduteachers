'use client'

import { useEffect, useRef } from 'react'
import { TODAY_STR } from '@/lib/mock-data'

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function buildDays() {
  const TODAY = new Date(2026, 5, 30)
  const days: { dateStr: string; dayLabel: string; dayNum: number; offset: number }[] = []
  for (let i = -7; i <= 7; i++) {
    const d = new Date(TODAY)
    d.setDate(d.getDate() + i)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    days.push({
      dateStr: `${dd}/${mm}/${yyyy}`,
      dayLabel: DAY_LABELS[d.getDay()],
      dayNum: d.getDate(),
      offset: i,
    })
  }
  return days
}

const DAYS = buildDays()

interface DateCarouselProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

export function DateCarousel({ selectedDate, onDateChange }: DateCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // Today is index 7 (offset 0 in the DAYS array)
  const todayIndex = 7

  // On mount, scroll so today is centred
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const itemWidth = 56 // approx item width + gap
    const todayOffset = todayIndex * itemWidth
    const centre = todayOffset - container.clientWidth / 2 + itemWidth / 2
    container.scrollLeft = centre
  }, [])

  return (
    <div className="border-t border-gray-200 bg-white">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto px-3 py-3 scrollbar-none"
        style={{ scrollbarWidth: 'none' }}
      >
        {DAYS.map((day) => {
          const isToday = day.offset === 0
          const isSelected = day.dateStr === selectedDate
          const isFuture = day.offset > 0

          return (
            <button
              key={day.dateStr}
              onClick={() => !isFuture && onDateChange(day.dateStr)}
              disabled={isFuture}
              className={`flex min-w-[48px] flex-col items-center rounded-xl px-2 py-2 transition-all disabled:opacity-35 ${
                isSelected
                  ? 'bg-black text-white'
                  : isToday
                    ? 'border-2 border-black bg-white text-black'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-[10px] font-medium leading-none">{day.dayLabel}</span>
              <span className={`mt-1 text-sm font-bold leading-none ${isSelected ? 'text-white' : 'text-black'}`}>
                {day.dayNum}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
