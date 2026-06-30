'use client'

import { ChevronLeft, Info, RefreshCw } from 'lucide-react'
import type { ClassInfo, FoodItem, FoodMenu } from '@/lib/mock-data'

interface FoodMenuScreenProps {
  selectedClass: ClassInfo
  foodMenu: FoodMenu | undefined
  selectedDate: string
  onBack: () => void
  onClassSwitch: () => void
  onFoodClick: (food: FoodItem) => void
}

export function FoodMenuScreen({
  selectedClass,
  foodMenu,
  selectedDate,
  onBack,
  onClassSwitch,
  onFoodClick,
}: FoodMenuScreenProps) {
  const hasSections =
    foodMenu?.timeSections && foodMenu.timeSections.some((s) => s.foods.length > 0)

  return (
    <div className="flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="text-base font-bold text-black">Thực đơn lớp</h1>
        <div className="w-8" />
      </div>

      {/* Class + switcher row */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-black">{selectedClass.name}</p>
          {selectedClass.isHomeroom && (
            <p className="text-xs text-gray-500">Lớp chủ nhiệm</p>
          )}
        </div>
        <button
          onClick={onClassSwitch}
          className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw size={12} />
          Đổi lớp
        </button>
      </div>

      {/* Food items */}
      <div className="min-h-[320px] px-4 py-4">
        {!hasSections ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-2 h-12 w-12 rounded-full border-2 border-dashed border-gray-300" />
            <p className="text-sm text-gray-400">Không có thực đơn cho ngày này</p>
          </div>
        ) : (
          <div className="space-y-5">
            {foodMenu!.timeSections.map((section) => {
              if (section.foods.length === 0) return null
              return (
                <div key={section.period}>
                  {/* Section heading */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-black" />
                    <h2 className="text-xs font-bold uppercase tracking-wide text-black">
                      {section.period}
                    </h2>
                  </div>
                  <div className="space-y-1.5">
                    {section.foods.map((food) => (
                      <div
                        key={food.id}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5"
                      >
                        <p className="text-sm font-medium text-black">{food.name}</p>
                        <button
                          onClick={() => onFoodClick(food)}
                          className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
                          title="Xem nguyên liệu"
                        >
                          <Info size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
