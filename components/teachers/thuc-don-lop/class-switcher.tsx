'use client'

import type { ClassInfo } from '@/lib/mock-data'

interface ClassSwitcherProps {
  selectedClass: string
  classes: ClassInfo[]
  onSelect: (classId: string) => void
  onClose: () => void
}

export function ClassSwitcher({
  selectedClass,
  classes,
  onSelect,
  onClose,
}: ClassSwitcherProps) {
  // Group classes in rows of 3
  const groupedClasses = []
  for (let i = 0; i < classes.length; i += 3) {
    groupedClasses.push(classes.slice(i, i + 3))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Chọn lớp</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {groupedClasses.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-3 gap-2">
              {row.map((classInfo) => (
                <button
                  key={classInfo.id}
                  onClick={() => onSelect(classInfo.id)}
                  className={`rounded-lg px-3 py-3 text-center text-xs font-semibold transition-all ${
                    selectedClass === classInfo.id
                      ? 'border-2 border-black bg-black text-white'
                      : 'border border-gray-300 bg-white text-gray-800 hover:border-black'
                  }`}
                >
                  {classInfo.name}
                </button>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}
