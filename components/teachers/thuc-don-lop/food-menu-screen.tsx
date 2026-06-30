'use client'

import { ChevronLeft, Info } from 'lucide-react'
import { type ClassInfo, type FoodMenu, type Ingredient } from '@/lib/mock-data'

interface FoodMenuScreenProps {
  selectedClass: ClassInfo
  foodMenu: FoodMenu
  selectedDate: string
  onClassSwitch: () => void
  onDateChange: () => void
  onIngredientClick: (ingredient: Ingredient) => void
}

export function FoodMenuScreen({
  selectedClass,
  foodMenu,
  selectedDate,
  onClassSwitch,
  onDateChange,
  onIngredientClick,
}: FoodMenuScreenProps) {
  const hasSections = foodMenu.timeSections && foodMenu.timeSections.length > 0

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <button className="p-1 text-gray-700 hover:text-black">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-black">Thực đơn lớp</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Class info and switcher */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-black">{selectedClass.name}</p>
          </div>
          <button
            onClick={onClassSwitch}
            className="rounded-full border border-gray-400 bg-white px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
          >
            Đổi lớp
          </button>
        </div>
      </div>

      {/* Date selector */}
      <div className="border-b border-gray-200 px-4 py-3">
        <button
          onClick={onDateChange}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          <span>📅</span>
          <span>Ngày: {selectedDate}</span>
        </button>
      </div>

      {/* Food items list */}
      <div className="flex-1 overflow-y-auto">
        {!hasSections || foodMenu.timeSections.every((s) => s.foods.length === 0) ? (
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-8 text-center">
            <p className="text-sm text-gray-500">Không có dữ liệu thực đơn cho ngày này</p>
          </div>
        ) : (
          <div className="space-y-4 px-4 py-4">
            {foodMenu.timeSections.map((section) => {
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
                          onClick={() =>
                            onIngredientClick(food.ingredients[0] || { id: '', name: '', company: '', datChuanStatus: 'đạt' })
                          }
                          className="p-1 text-gray-600 hover:text-black"
                          title="Xem thành phần"
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
