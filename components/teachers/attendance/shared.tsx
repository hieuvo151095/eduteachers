'use client'

import { ChevronLeft, ChevronDown, RefreshCw, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttendanceStatus, CheckoutStatus, ClassInfo, DiemDanhStudent } from '@/lib/mock-data'

export type Session = 'sang' | 'chieu'

// ─── Class subtitle ─────────────────────────────────────────────────────────
// Standardized order per diem-danh-flow-spec Open Question #1: "[Loại lớp] -
// Lớp [Tên]" everywhere. Non-homeroom classes have no secondary label
// (Open Question #7), so they render as just "Lớp [Tên]".
export function classSubtitle(cls: ClassInfo): string {
  return cls.isHomeroom ? `Lớp chủ nhiệm - Lớp ${cls.name}` : `Lớp ${cls.name}`
}

// ─── Status labels ──────────────────────────────────────────────────────────

export function checkInBadgeLabel(status: AttendanceStatus): string {
  switch (status) {
    case 'chưa-đón': return 'Chưa đón'
    case 'có-mặt': return 'Có mặt'
    case 'đến-muộn': return 'Đến muộn'
    case 'vắng-có-phép': return 'Vắng có phép'
    case 'vắng-không-phép': return 'Vắng không phép'
  }
}

// Open Question #3: keep the literal "Chưa đón" wording for the unconfirmed
// checkout badge, per user decision to preserve the original screenshot text.
export function checkOutBadgeLabel(status: CheckoutStatus): string {
  switch (status) {
    case 'chưa-về': return 'Chưa đón'
    case 'đã-về': return 'Đã về'
    case 'vắng-có-phép': return 'Vắng có phép'
    case 'vắng-không-phép': return 'Vắng không phép'
  }
}

export function badgeColorClass(status: AttendanceStatus | CheckoutStatus): string {
  switch (status) {
    case 'có-mặt':
    case 'đã-về':
      return 'bg-green-50 text-green-700'
    case 'đến-muộn':
      return 'bg-orange-100 text-orange-700'
    case 'vắng-không-phép':
      return 'bg-red-50 text-red-600'
    case 'vắng-có-phép':
      return 'bg-gray-200 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

// ─── Avatar ─────────────────────────────────────────────────────────────────

export function StudentAvatar({ student, size = 40 }: { student: DiemDanhStudent; size?: number }) {
  if (student.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={student.avatar}
        alt={student.name}
        className="shrink-0 rounded-full border border-gray-200 bg-gray-50 object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-400"
      style={{ width: size, height: size }}
    >
      <User size={size * 0.55} />
    </div>
  )
}

// ─── Empty state illustration ────────────────────────────────────────────────

export function EmptyStateIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="34" height="46" rx="4" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="2" />
      <line x1="18" y1="20" x2="40" y2="20" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="28" x2="40" y2="28" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="36" x2="32" y2="36" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" />
      <circle cx="44" cy="46" r="13" fill="white" stroke="#D1D5DB" strokeWidth="2" />
      <text x="44" y="51" textAnchor="middle" fontSize="14" fontWeight={700} fill="#9CA3AF">0</text>
    </svg>
  )
}

// ─── Header ─────────────────────────────────────────────────────────────────

export function AttendanceHeader({
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

// ─── Filter row (Lọc theo + Sĩ số) ───────────────────────────────────────────

export function FilterRow({
  dateLabel,
  onOpenDatePicker,
  siSo,
}: {
  dateLabel: string
  onOpenDatePicker: () => void
  siSo?: number
}) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-100 bg-white px-4 py-3">
      <span className="shrink-0 text-xs text-gray-500">Lọc theo</span>
      <button
        onClick={onOpenDatePicker}
        className="flex min-w-0 flex-1 items-center justify-between gap-1 rounded-full border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 active:bg-orange-100"
      >
        <span className="truncate">{dateLabel}</span>
        <ChevronDown size={14} className="shrink-0" />
      </button>
      {siSo !== undefined && (
        <div className="shrink-0 rounded-lg border border-orange-300 bg-orange-50 px-2.5 py-1.5 text-[11px] font-bold text-orange-700">
          Sĩ số: {siSo}
        </div>
      )}
    </div>
  )
}
