'use client'

import { ChevronLeft } from 'lucide-react'
import { type Ingredient } from '@/lib/mock-data'

interface IngredientDetailsProps {
  ingredient: Ingredient
  onClose: () => void
}

export function IngredientDetails({ ingredient, onClose }: IngredientDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 max-w-sm rounded-t-2xl bg-white p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Nguồn gốc thực phẩm</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-600 hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Ingredient info */}
        <div className="mb-6 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-600">Tên nguyên liệu</p>
            <p className="mt-1 text-sm font-medium text-black">{ingredient.name}</p>
          </div>

          <div className="rounded-lg bg-gray-100 p-4">
            <p className="text-xs font-semibold uppercase text-gray-600">Mã sản phẩm</p>
            <div className="mt-2 space-y-2">
              {ingredient.gtin && (
                <div>
                  <p className="text-xs text-gray-700">GTIN:</p>
                  <p className="font-mono text-sm font-semibold text-black">{ingredient.gtin}</p>
                </div>
              )}
              {ingredient.soLo && (
                <div>
                  <p className="text-xs text-gray-700">Số lô:</p>
                  <p className="font-mono text-sm font-semibold text-black">{ingredient.soLo}</p>
                </div>
              )}
              {ingredient.maTem && (
                <div>
                  <p className="text-xs text-gray-700">Mã tem nội bộ:</p>
                  <p className="font-mono text-sm font-semibold text-black">{ingredient.maTem}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-gray-600">Công ty sản xuất</p>
            <p className="mt-1 text-sm font-medium text-black">{ingredient.company}</p>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <span className="text-xs font-semibold uppercase text-gray-600">Đạt chuẩn</span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                ingredient.datChuanStatus === 'đạt'
                  ? 'bg-black text-white'
                  : 'bg-gray-400 text-white'
              }`}
            >
              {ingredient.datChuanStatus === 'đạt' ? '✓ Đạt' : '✗ Không đạt'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
