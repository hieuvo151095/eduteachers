'use client'

import { ChevronLeft } from 'lucide-react'
import type { Ingredient } from '@/lib/mock-data'

interface IngredientDetailsProps {
  ingredient: Ingredient
  /** Called when the user presses the back arrow — returns to ingredient list */
  onBack: () => void
}

export function IngredientDetails({ ingredient, onBack }: IngredientDetailsProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-end bg-black/40">
      <div className="w-full max-w-sm mx-auto rounded-t-2xl bg-white px-5 py-5">
        {/* Handle bar */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-base font-bold text-black">Nguồn gốc thực phẩm</h2>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Ingredient name */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Tên nguyên liệu</p>
            <p className="mt-1 text-sm font-bold text-black">{ingredient.name}</p>
          </div>

          {/* Product code */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Mã sản phẩm</p>
            {ingredient.gtin && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">GTIN</span>
                <span className="font-mono text-xs font-bold text-black">{ingredient.gtin}</span>
              </div>
            )}
            {ingredient.soLo && (
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xs text-gray-500">Số lô</span>
                <span className="font-mono text-xs font-bold text-black">{ingredient.soLo}</span>
              </div>
            )}
            {ingredient.maTem && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Mã tem nội bộ</span>
                <span className="font-mono text-xs font-bold text-black">{ingredient.maTem}</span>
              </div>
            )}
          </div>

          {/* Company */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Đơn vị sản xuất</p>
            <p className="mt-1 text-sm font-medium text-black">{ingredient.company}</p>
          </div>

          {/* Standard badge */}
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Tiêu chuẩn chất lượng</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                ingredient.datChuanStatus === 'đạt'
                  ? 'bg-black text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {ingredient.datChuanStatus === 'đạt' ? 'Dat chuan' : 'Khong dat'}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={onBack}
            className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-black hover:bg-gray-50"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  )
}
