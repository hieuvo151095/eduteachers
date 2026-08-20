'use client'

import { ChevronLeft, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ClassInfo } from '@/lib/mock-data'

// Standardized order per diem-danh-flow-spec Open Question #1: "[Loại lớp] -
// Lớp [Tên]" everywhere. Non-homeroom classes have no secondary label
// (Open Question #7), so they render as just "Lớp [Tên]".
export function classSubtitle(cls: ClassInfo): string {
  return cls.isHomeroom ? `Lớp chủ nhiệm - Lớp ${cls.name}` : `Lớp ${cls.name}`
}

// Shared header used across teacher-app features (originated in "Điểm danh",
// reused as-is by "Thực đơn lớp" — see thuc-don-flow-spec "Header dùng chung").
export function AppHeader({
  title,
  subtitle,
  onBack,
  onChangeClass,
  centered = false,
}: {
  title: string
  subtitle?: string
  onBack: () => void
  onChangeClass?: () => void
  centered?: boolean
}) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
      <button onClick={onBack} className="shrink-0 p-1 text-gray-600 active:text-black">
        <ChevronLeft size={22} />
      </button>
      <div className={cn('min-w-0 flex-1', centered && 'text-center')}>
        <h1 className="truncate text-base font-bold text-black">{title}</h1>
        {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
      </div>
      {onChangeClass && (
        <button
          onClick={onChangeClass}
          className="flex shrink-0 items-center gap-1 rounded-full border border-blue-500 px-3 py-1.5 text-xs font-semibold text-blue-600 active:bg-blue-50"
        >
          <RefreshCw size={13} />
          Đổi lớp
        </button>
      )}
    </div>
  )
}
