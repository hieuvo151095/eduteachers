'use client'

import { useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DateCarouselProps {
  selectedDate: string
  onDateChange: (date: string) => void
}

export function DateCarousel({ selectedDate, onDateChange }: DateCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate dates: 7 days before to 7 days after today (30/06/2026)
  const generateDates = () => {
    const dates = []
    const today = new Date(2026, 5, 30) // June 30, 2026
    for (let i = -7; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const formatted = date.toLocaleDateString('vi-VN')
      dates.push(formatted)
    }
    return dates
  }

  const dates = generateDates()
  const todayIndex = 7 // Today is at index 7 in our 15-day array

  // Scroll to center today on mount
  useEffect(() => {
    if (containerRef.current) {
      const scrollAmount = todayIndex * 70 - (containerRef.current.clientWidth / 2 - 35)
      containerRef.current.scrollLeft = scrollAmount
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === 'left' ? -140 : 140,
        behavior: 'smooth',
      })
    }
  }

  const formatDateDisplay = (date: string) => {
    const [day, month, year] = date.split('/')
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const dayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][dateObj.getDay()]
    return { day, dayOfWeek }
  }

  return (
    <div className="sticky bottom-0 border-t bg-white">
      <div className="relative flex items-center justify-between px-2 py-2">
        <button
          onClick={() => scroll('left')}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 mx-1"
        >
          {dates.map((date, index) => {
            const isToday = date === '30/06/2026'
            const isSelected = date === selectedDate
            const { day, dayOfWeek } = formatDateDisplay(date)

            return (
              <button
                key={date}
                onClick={() => onDateChange(date)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium text-xs whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-black text-white'
                    : isToday
                      ? 'border-2 border-black bg-white text-black'
                      : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div>{dayOfWeek}</div>
                <div className="text-xs">{day}</div>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => scroll('right')}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
}
