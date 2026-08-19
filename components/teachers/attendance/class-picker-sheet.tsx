'use client'

import { Check, X } from 'lucide-react'
import type { ClassInfo } from '@/lib/mock-data'

interface ClassPickerSheetProps {
  classes: ClassInfo[]
  selectedClassId: string
  onSelect: (cls: ClassInfo) => void
  onClose: () => void
}

export function ClassPickerSheet({ classes, selectedClassId, onSelect, onClose }: ClassPickerSheetProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div className="rounded-t-2xl bg-white pb-6" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
        <div className="relative flex items-center justify-center px-4 py-3">
          <p className="text-sm font-bold text-black">Chọn lớp</p>
          <button onClick={onClose} className="absolute right-4 p-1 text-gray-500 active:text-black">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4 pt-2">
          {classes.map((cls) => {
            const isActive = cls.id === selectedClassId
            return (
              <button
                key={cls.id}
                onClick={() => onSelect(cls)}
                className={`relative rounded-xl border px-2 py-3 text-center ${
                  isActive ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white active:bg-gray-50'
                }`}
              >
                {isActive && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
                <p className="text-xs font-bold text-black">{cls.name}</p>
                {cls.isHomeroom && <p className="mt-0.5 text-[10px] text-gray-500">Lớp chủ nhiệm</p>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
