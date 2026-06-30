'use client'

import { Info, X } from 'lucide-react'
import type { Ingredient } from '@/lib/mock-data'

interface IngredientListModalProps {
  food: {
    name: string
    ingredients: Ingredient[]
  }
  onIngredientClick: (ingredient: Ingredient) => void
  onClose: () => void
}

export function IngredientListModal({
  food,
  onIngredientClick,
  onClose,
}: IngredientListModalProps) {
  return (
    <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">{food.name}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={20} />
          </button>
        </div>

        <p className="mb-4 text-xs text-gray-600">Nguyên liệu</p>

        <div className="space-y-2">
          {food.ingredients.length === 0 ? (
            <p className="text-xs text-gray-500">Không có nguyên liệu</p>
          ) : (
            food.ingredients.map((ingredient) => (
              <div
                key={ingredient.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-black">{ingredient.name}</p>
                  <p className="text-xs text-gray-600">{ingredient.company}</p>
                </div>
                <button
                  onClick={() => onIngredientClick(ingredient)}
                  className="p-2 text-gray-600 hover:text-black"
                  title="Xem chi tiết"
                >
                  <Info size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
