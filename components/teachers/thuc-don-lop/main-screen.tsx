'use client'

import { ChevronRight, Download } from 'lucide-react'
import { AppHeader, classSubtitle } from '@/components/teachers/shared/header'
import type { ClassInfo, ThucDonMon, ThucDonNgay, ThucDonTuan } from '@/lib/mock-data'

const PERIOD_ICON: Record<string, string> = {
  'Ăn sáng': '🍽',
  'Ăn trưa': '🍲',
  'Ăn xế': '🧴',
}

interface MainScreenProps {
  selectedClass: ClassInfo
  week: ThucDonTuan
  day: ThucDonNgay
  selectedDayIndex: number
  onBack: () => void
  onChangeClass: () => void
  onOpenWeekPicker: () => void
  onSelectDay: (index: number) => void
  onFoodClick: (food: ThucDonMon) => void
  onOpenAttachment: () => void
}

export function MainScreen({
  selectedClass,
  week,
  day,
  selectedDayIndex,
  onBack,
  onChangeClass,
  onOpenWeekPicker,
  onSelectDay,
  onFoodClick,
  onOpenAttachment,
}: MainScreenProps) {
  return (
    <div className="flex flex-col bg-white">
      <AppHeader title="Thực đơn" subtitle={classSubtitle(selectedClass)} onBack={onBack} onChangeClass={onChangeClass} />

      {/* Row "Tuần" */}
      <button
        onClick={onOpenWeekPicker}
        className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-left active:bg-gray-50"
      >
        <span className="flex items-center gap-2 text-sm text-black">
          <span className="text-base">📔</span>
          Tuần : {week.label}
        </span>
        <ChevronRight size={16} className="shrink-0 text-gray-400" />
      </button>

      {/* Tab bar ngày */}
      <div className="flex gap-1.5 border-b border-gray-100 px-3 py-3">
        {week.days.map((d, idx) => {
          const isActive = idx === selectedDayIndex
          return (
            <button
              key={d.date}
              onClick={() => onSelectDay(idx)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 ${
                isActive ? 'border-2 border-blue-600' : 'border border-gray-200'
              }`}
            >
              <span className="text-[10px] font-medium leading-none text-gray-600">{d.thu}</span>
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold leading-none ${
                  isActive ? 'bg-blue-600 text-white' : 'text-black'
                }`}
              >
                {d.date.slice(0, 2)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Meal cards */}
      <div className="space-y-3 px-4 py-4">
        {day.buaAn.map((bua) => (
          <div key={bua.period} className="overflow-hidden rounded-xl border border-gray-200">
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-sm font-bold text-black">
                <span>{PERIOD_ICON[bua.period]}</span>
                {bua.period}
              </span>
              <span className="text-xs text-gray-500">{bua.foods.length} món</span>
            </div>
            <div className="divide-y divide-gray-100">
              {bua.foods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => onFoodClick(food)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left active:bg-gray-50"
                >
                  <span className="text-sm font-medium text-black">{food.name}</span>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                    {food.ingredients.length} nguyên liệu
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Ảnh đính kèm */}
      <div className="px-4 pb-6">
        <p className="mb-2 text-sm font-bold text-black">Ảnh đính kèm</p>
        <button
          onClick={onOpenAttachment}
          className="relative flex h-28 w-24 items-end overflow-hidden rounded-xl border border-gray-200 bg-gray-50 active:bg-gray-100"
        >
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-3xl">📄</span>
          </div>
          <span className="absolute bottom-1.5 left-1.5 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
            PDF
          </span>
        </button>

        <button className="mt-3 flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-blue-600">
          <Download size={15} />
          Tải xuống
        </button>
      </div>
    </div>
  )
}
