'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface DatePickerProps {
  onDateSelect: (date: string) => void
}

export function DatePicker({ onDateSelect }: DatePickerProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 30)) // June 30, 2026

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDayClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const formatted = `${String(day).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`
    onDateSelect(formatted)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthName = currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })
  const today = new Date(2026, 5, 30)
  const isToday = (day: number | null) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 max-w-sm rounded-t-2xl bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black">Chọn ngày</h2>
          <p className="mt-1 text-xs text-gray-600">Chỉ có thể xem lịch sử từ các ngày trong quá khứ</p>
        </div>

        {/* Calendar Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="rounded-lg border border-gray-300 p-1 text-gray-700 hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-semibold text-black">{monthName}</span>
          <button
            onClick={nextMonth}
            disabled={currentDate >= today}
            className="rounded-lg border border-gray-300 p-1 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days of week header */}
        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div key={day} className="text-xs font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="mb-6 grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day && handleDayClick(day)}
              disabled={!day || (day && currentDate > today)}
              className={`aspect-square rounded-lg text-xs font-medium ${
                day === null
                  ? 'invisible'
                  : isToday(day)
                    ? 'bg-black text-white hover:bg-gray-800'
                    : currentDate > today
                      ? 'cursor-not-allowed text-gray-300'
                      : 'border border-gray-300 text-black hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            /* Close modal */
          }}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
