'use client'

import { ChevronRight } from 'lucide-react'
import type { FoodItem, Ingredient } from '@/lib/mock-data'

interface IngredientListModalProps {
  food: FoodItem
  onIngredientClick: (ingredient: Ingredient) => void
  onClose: () => void
}

export function IngredientListModal({ food, onIngredientClick, onClose }: IngredientListModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm mx-auto rounded-t-2xl bg-white px-5 py-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Nguyên liệu</p>
            <h2 className="text-base font-bold text-black">{food.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
          >
            <span className="text-sm leading-none">✕</span>
          </button>
        </div>

        {/* Ingredient list */}
        <div className="space-y-2">
          {food.ingredients.map((ing) => (
            <button
              key={ing.id}
              onClick={() => onIngredientClick(ing)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left hover:bg-gray-100"
            >
              <div>
                <p className="text-sm font-semibold text-black">{ing.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {ing.gtin
                    ? `GTIN: ${ing.gtin}`
                    : ing.maTem
                      ? `Mã tem nội bộ: ${ing.maTem}`
                      : ''}
                </p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-gray-400" />
            </button>
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
