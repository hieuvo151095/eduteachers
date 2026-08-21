'use client'

import { X, ArrowUpRight } from 'lucide-react'
import type { ThucDonMon, ThucDonNguyenLieu } from '@/lib/mock-data'

interface IngredientSheetProps {
  food: ThucDonMon
  onClose: () => void
}

function IngredientCard({ ingredient, defaultExpanded }: { ingredient: ThucDonNguyenLieu; defaultExpanded: boolean }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left">
      <p className="text-sm font-semibold text-black">{ingredient.name}</p>
      {defaultExpanded && (
        <div className="mt-2 space-y-1.5 border-t border-gray-200 pt-2">
          {ingredient.coSoSanXuat && (
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-xs text-gray-500">Cơ sở sản xuất</span>
              <span className="text-right text-xs font-medium text-black">{ingredient.coSoSanXuat}</span>
            </div>
          )}
          {ingredient.maNguyenLieu && (
            <div className="flex items-start justify-between gap-3">
              <span className="shrink-0 text-xs text-gray-500">Mã nguyên liệu</span>
              <span className="text-right font-mono text-xs font-medium text-black">{ingredient.maNguyenLieu}</span>
            </div>
          )}
          {ingredient.xemChiTiet && (
            <div className="flex justify-end pt-0.5">
              <span className="flex items-center gap-0.5 text-xs font-semibold text-blue-600">
                Xem chi tiết <ArrowUpRight size={12} />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function IngredientSheet({ food, onClose }: IngredientSheetProps) {
  const count = food.ingredients.length

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div
        className="mx-auto max-h-[80vh] w-full max-w-sm overflow-y-auto rounded-t-2xl bg-white px-5 py-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />

        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-black">{food.name}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{count} nguyên liệu</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {count === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="h-10 w-10 rounded-full border-2 border-dashed border-gray-300" />
            <p className="text-sm text-gray-400">Chưa có thông tin nguyên liệu</p>
          </div>
        ) : (
          <div className="space-y-2 pb-2">
            {food.ingredients.map((ing) => (
              <IngredientCard key={ing.id} ingredient={ing} defaultExpanded={!!ing.expandedByDefault} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
