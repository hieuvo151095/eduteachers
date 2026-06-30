'use client'

import { Info } from 'lucide-react'
import type { FoodMenu } from '@/lib/mock-data'

interface FoodMenuScreenProps {
  className: string
  selectedDate: string
  currentMenu: FoodMenu | undefined
  onClassSwitch: () => void
  onFoodClick: (food: any) => void
}

export function FoodMenuScreen({
  className,
  selectedDate,
  currentMenu,
  onClassSwitch,
  onFoodClick,
}: FoodMenuScreenProps) {
  const hasSections = currentMenu?.timeSections && currentMenu.timeSections.length > 0

  return (
    <div className="flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <h1 className="text-lg font-bold text-black">Thực đơn lớp</h1>
      </div>

      {/* Class info and switcher */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-black">{className}</p>
            <p className="text-xs text-gray-600">Ngày: {selectedDate}</p>
          </div>
          <button
            onClick={onClassSwitch}
            className="rounded-full border border-gray-400 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Đổi lớp
          </button>
        </div>
      </div>

      {/* Food items list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {!hasSections || currentMenu.timeSections.every((s) => s.foods.length === 0) ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <p className="text-sm text-gray-500">Không có dữ liệu thực đơn cho ngày này</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentMenu.timeSections.map((section) => {
              if (section.foods.length === 0) return null

              return (
                <div key={section.period} className="space-y-2">
                  <h2 className="border-l-2 border-black pl-2 text-sm font-bold text-black">
                    {section.period}
                  </h2>
                  <div className="ml-2 space-y-1">
                    {section.foods.map((food) => (
                      <div
                        key={food.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                      >
                        <p className="text-sm font-medium text-black">{food.name}</p>
                        <button
                          onClick={() => onFoodClick(food)}
                          className="p-1 text-gray-600 hover:text-black"
                          title="Xem nguyên liệu"
                        >
                          <Info size={18} />
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
