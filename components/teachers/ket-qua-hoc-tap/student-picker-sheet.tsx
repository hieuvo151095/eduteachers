'use client'

import { Check, X } from 'lucide-react'
import type { KetQuaHocTapStudent } from '@/lib/mock-data'

interface StudentPickerSheetProps {
  students: KetQuaHocTapStudent[]
  selectedStudentId: string
  onSelect: (student: KetQuaHocTapStudent) => void
  onClose: () => void
}

export function StudentPickerSheet({ students, selectedStudentId, onSelect, onClose }: StudentPickerSheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div className="rounded-t-2xl bg-white pb-6" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-gray-300" />
        <div className="relative flex items-center justify-center px-4 py-3">
          <p className="text-sm font-bold text-black">Chọn học sinh</p>
          <button onClick={onClose} className="absolute right-4 p-1 text-gray-500 active:text-black">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 px-4 pt-2">
          {students.map((student) => {
            const isActive = student.id === selectedStudentId
            const initial = student.name.trim().split(' ').pop()?.[0] ?? '?'
            return (
              <button
                key={student.id}
                onClick={() => onSelect(student)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${
                  isActive ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white active:bg-gray-50'
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                  {initial}
                </div>
                <p className="flex-1 truncate text-sm font-semibold text-black">{student.name}</p>
                {isActive && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-400 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
