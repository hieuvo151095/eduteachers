'use client'

import { type ClassInfo } from '@/lib/mock-data'

interface ClassSwitcherProps {
  classes: ClassInfo[]
  onSelect: (classInfo: ClassInfo) => void
}

export function ClassSwitcher({ classes, onSelect }: ClassSwitcherProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute bottom-0 left-0 right-0 max-w-sm rounded-t-2xl bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-lg font-bold text-black">Chọn lớp</h2>
        </div>

        <div className="space-y-2">
          {classes.map((classInfo) => (
            <button
              key={classInfo.id}
              onClick={() => onSelect(classInfo)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left font-medium text-black hover:bg-gray-100"
            >
              {classInfo.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => {/* Close handled by parent screen state */}}
          className="mt-6 w-full rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
