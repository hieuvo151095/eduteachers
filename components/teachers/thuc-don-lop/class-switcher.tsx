'use client'

import type { ClassInfo } from '@/lib/mock-data'

interface ClassSwitcherProps {
  selectedClassId: string
  classes: ClassInfo[]
  onSelect: (classInfo: ClassInfo) => void
  onClose: () => void
}

export function ClassSwitcher({ selectedClassId, classes, onSelect, onClose }: ClassSwitcherProps) {
  // Group into rows of 3
  const rows: ClassInfo[][] = []
  for (let i = 0; i < classes.length; i += 3) {
    rows.push(classes.slice(i, i + 3))
  }

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
          <h2 className="text-base font-bold text-black">Chọn lớp</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100"
          >
            <span className="text-sm leading-none">✕</span>
          </button>
        </div>

        {/* 3-column class grid */}
        <div className="space-y-2">
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-2">
              {row.map((cls) => {
                const isSelected = cls.id === selectedClassId
                return (
                  <button
                    key={cls.id}
                    onClick={() => onSelect(cls)}
                    className={`rounded-xl border py-3 text-center text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-gray-50 text-black hover:border-black hover:bg-gray-100'
                    }`}
                  >
                    {cls.name}
                  </button>
                )
              })}
            </div>
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
