'use client'

import { ChevronLeft, CheckCircle } from 'lucide-react'
import type { Ingredient } from '@/lib/mock-data'

interface IngredientDetailsModalProps {
  ingredient: Ingredient
  onBack: () => void
}

export function IngredientDetailsModal({
  ingredient,
  onBack,
}: IngredientDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-40 bg-black/50" onClick={onBack}>
      <div
        className="absolute bottom-0 left-0 right-0 max-h-96 rounded-t-2xl bg-white p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 text-gray-600 hover:text-black"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-bold text-black">Nguồn gốc thực phẩm</h2>
        </div>

        <div className="space-y-4">
          {/* Ingredient name */}
          <div>
            <p className="mb-1 text-xs font-semibold text-gray-600">Tên nguyên liệu</p>
            <p className="text-sm font-medium text-black">{ingredient.name}</p>
          </div>

          {/* Product code */}
          <div>
            <p className="mb-1 text-xs font-semibold text-gray-600">Mã sản phẩm</p>
            {ingredient.gtin && ingredient.soLo ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-xs text-gray-600">GTIN</span>
                  <span className="font-mono text-sm font-semibold text-black">
                    {ingredient.gtin}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-xs text-gray-600">Số lô</span>
                  <span className="font-mono text-sm font-semibold text-black">
                    {ingredient.soLo}
                  </span>
                </div>
              </div>
            ) : ingredient.maTem ? (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                <span className="text-xs text-gray-600">Mã tem nội bộ</span>
                <span className="font-mono text-sm font-semibold text-black">
                  {ingredient.maTem}
                </span>
              </div>
            ) : null}
          </div>

          {/* Company */}
          <div>
            <p className="mb-1 text-xs font-semibold text-gray-600">Đơn vị sản xuất</p>
            <p className="text-sm font-medium text-black">{ingredient.company}</p>
          </div>

          {/* Quality status */}
          <div>
            <p className="mb-1 text-xs font-semibold text-gray-600">Tiêu chuẩn chất lượng</p>
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {ingredient.datChuanStatus === 'đạt' ? 'Đạt chuẩn' : 'Không đạt chuẩn'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
        >
          Quay lại
        </button>
      </div>
    </div>
  )
}
