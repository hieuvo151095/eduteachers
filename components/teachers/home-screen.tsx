'use client'

import { ChevronRight } from 'lucide-react'

// ─── Entry-point icons (line-art, B&W) ──────────────────────────────────────

function IconDiemDanh() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="6" width="24" height="28" rx="3" />
      <line x1="13" y1="15" x2="27" y2="15" />
      <line x1="13" y1="20" x2="27" y2="20" />
      <line x1="13" y1="25" x2="21" y2="25" />
      <polyline points="22,27 25,30 31,23" />
    </svg>
  )
}

function IconDanhSach() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="14" r="5" />
      <path d="M6 34c0-6 4-10 10-10h8c6 0 10 4 10 10" />
    </svg>
  )
}

function IconHoatDong() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="24" height="24" rx="4" />
      <path d="M15 20l4 4 6-8" />
    </svg>
  )
}

function IconBaoVang() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7v3M10 11l2 2M8 20H5M30 11l-2 2M32 20h3" />
      <path d="M20 10a10 10 0 0 1 10 10c0 4-2 7-4 9H14c-2-2-4-5-4-9a10 10 0 0 1 10-10z" />
      <line x1="16" y1="33" x2="24" y2="33" />
    </svg>
  )
}

function IconThoiKhoa() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="9" width="26" height="24" rx="3" />
      <line x1="7" y1="16" x2="33" y2="16" />
      <line x1="14" y1="5" x2="14" y2="13" />
      <line x1="26" y1="5" x2="26" y2="13" />
      <line x1="13" y1="22" x2="27" y2="22" />
      <line x1="13" y1="28" x2="22" y2="28" />
    </svg>
  )
}

function IconBaiTap() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8h16a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
      <line x1="15" y1="16" x2="25" y2="16" />
      <line x1="15" y1="21" x2="25" y2="21" />
      <line x1="15" y1="26" x2="20" y2="26" />
    </svg>
  )
}

function IconThucDon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 8v8c0 3 2 5 6 6v10" />
      <path d="M14 8c0 0-3 2-3 6" />
      <path d="M14 8c0 0 3 2 3 6" />
      <path d="M26 8c0 0 0 5 0 8s-2 4-2 4v12" />
    </svg>
  )
}

function IconTraoDoI() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 8c-6 0-11 4-11 9v3H6l5 5 5-5h-3v-3c0-3 2-5 5-5s5 2 5 5v3h3v-3c0-5-5-9-11-9z" />
      <path d="M20 32c6 0 11-4 11-9v-3h3l-5-5-5 5h3v3c0 3-2 5-5 5s-5-2-5-5v-3h-3v3c0 5 5 9 11 9z" />
    </svg>
  )
}

// ─── Entry point config ──────────────────────────────────────────────────────

const ENTRY_POINTS = [
  { id: 'diem-danh',  label: 'Điểm danh',         Icon: IconDiemDanh },
  { id: 'danh-sach', label: 'Danh sách\nhọc sinh', Icon: IconDanhSach },
  { id: 'hoat-dong', label: 'Hoạt động',           Icon: IconHoatDong },
  { id: 'bao-vang',  label: 'Báo vắng',            Icon: IconBaoVang },
  { id: 'tkb',       label: 'Thời khoá\nbiểu',     Icon: IconThoiKhoa },
  { id: 'bai-tap',   label: 'Bài tập',             Icon: IconBaiTap },
  { id: 'thuc-don',  label: 'Thực đơn\nlớp',       Icon: IconThucDon },
  { id: 'trao-doi',  label: 'Trao đổi',            Icon: IconTraoDoI },
]

// ─── Attendance mock data ────────────────────────────────────────────────────

const ATTENDANCE_ROWS = [
  { label: 'Có mặt',    value: 5, total: 7 },
  { label: 'Vắng mặt',  value: 2, total: 7 },
  { label: 'Đi trễ',   value: 1, total: 7 },
]

// ─── Component ───────────────────────────────────────────────────────────────

interface TeachersHomeScreenProps {
  onNavigateToThucDon: () => void
  onNavigateToDiemDanh: () => void
  onNavigateToMessaging: () => void
}

export function TeachersHomeScreen({ onNavigateToThucDon, onNavigateToDiemDanh, onNavigateToMessaging }: TeachersHomeScreenProps) {
  return (
    <div className="flex flex-col bg-gray-50 font-sans">

      {/* ── Top header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300">
            <ChevronRight size={14} className="rotate-180 text-gray-600" />
          </div>
          <span className="text-sm font-semibold text-black">ECO School Giao viên</span>
        </div>
        {/* Notification bell */}
        <button className="relative flex h-8 w-8 items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
            3
          </span>
        </button>
      </div>

      {/* ── Promo banner ───────────────────────────────────────────────────── */}
      <div className="mx-4 mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* Banner body */}
        <div className="flex items-center gap-3 px-4 py-4">
          {/* SSC logo placeholder */}
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-black bg-black text-white">
            <span className="text-[10px] font-black leading-none tracking-widest">SSC</span>
            <span className="mt-0.5 text-[8px] leading-none text-gray-300">S·smart card</span>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase leading-tight text-gray-500">
              Miễn phí dịch vụ
            </p>
            <p className="text-sm font-black uppercase leading-tight text-black">
              Thanh toán học phí SSC
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-black">
              <span className="font-black">1 năm</span>
              <span className="ml-1 text-gray-500">· Áp dụng đến 31.05.2025</span>
            </p>
          </div>
        </div>
        {/* Banner CTA */}
        <div className="border-t border-gray-100 px-4 py-2">
          <button className="text-xs font-semibold text-black underline underline-offset-2">
            Tìm hiểu thêm →
          </button>
        </div>
      </div>

      {/* ── School card ────────────────────────────────────────────────────── */}
      <div className="mx-4 mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 21h18M6 21V7l6-4 6 4v14M9 21v-6h6v6" />
            </svg>
            <span className="text-sm font-bold text-black">Trường THCS Độc Lập</span>
          </div>
          <button className="flex items-center gap-0.5 text-xs font-medium text-black">
            Đổi trường <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* ── Class selector ─────────────────────────────────────────────────── */}
      <div className="mx-4 mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
        <p className="mb-2.5 text-xs text-gray-500">Thầy/Cô đang ở lớp</p>
        <div className="flex gap-2.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>

          {/* Active class */}
          <div className="flex min-w-[136px] shrink-0 items-center gap-2 rounded-xl border-2 border-black bg-white px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black">
              <svg viewBox="0 0 20 20" fill="white" className="h-4 w-4">
                <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v10h10V5H5zm2 2h6v1H7V7zm0 3h6v1H7v-1zm0 3h4v1H7v-1z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight text-black">Lớp 6A2</p>
              <p className="text-[10px] leading-tight text-gray-500">Lớp chủ nhiệm</p>
            </div>
            <svg viewBox="0 0 16 16" className="ml-auto h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3,8 7,12 13,4" />
            </svg>
          </div>

          {/* Other classes */}
          {['8A1', '8A2'].map((name) => (
            <div key={name} className="flex min-w-[80px] shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gray-500">
                  <path d="M4 3h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v10h10V5H5zm2 2h6v1H7V7zm0 3h6v1H7v-1zm0 3h4v1H7v-1z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-black">{name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature entry points ───────────────────────────────────────────── */}
      <div className="mx-4 mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-4">
        <div className="grid grid-cols-4 gap-x-2 gap-y-5">
          {ENTRY_POINTS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={
                id === 'thuc-don' ? onNavigateToThucDon :
                id === 'diem-danh' ? onNavigateToDiemDanh :
                id === 'trao-doi' ? onNavigateToMessaging :
                undefined
              }
              className="relative flex flex-col items-center gap-1.5 transition-opacity active:opacity-60"
            >
              {/* Unread badge for Trao đổi */}
              {id === 'trao-doi' && (
                <div className="absolute right-2 top-0 h-2 w-2 rounded-full bg-red-500" />
              )}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-2.5 text-black">
                <Icon />
              </div>
              <span className="whitespace-pre-line text-center text-[11px] leading-tight text-black">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Điểm danh hôm nay ──────────────────────────────────────────────── */}
      <div className="mx-4 mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-black">Điểm danh hôm nay</p>
          <button className="text-xs font-medium text-black underline underline-offset-2">
            Xem chi tiết
          </button>
        </div>

        {/* Class + date row */}
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full border border-black px-3 py-1 text-xs font-semibold text-black">
            Lớp 6A2
          </span>
          <div className="text-right">
            <p className="text-xs text-gray-500">Thứ 7, 27/06/2026</p>
            <p className="text-xs text-gray-700">
              Sĩ số: <span className="font-bold text-black">7</span>
            </p>
          </div>
        </div>

        {/* Attendance summary bar */}
        <div className="mb-3 flex h-3 w-full overflow-hidden rounded-full">
          {/* Present: 5/7 */}
          <div className="h-full bg-black" style={{ width: `${(5 / 7) * 100}%` }} />
          {/* Absent: 2/7 */}
          <div className="h-full bg-gray-400" style={{ width: `${(2 / 7) * 100}%` }} />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-gray-200 rounded-xl border border-gray-200">
          <div className="flex flex-col items-center py-2.5">
            <span className="text-base font-black text-black">5</span>
            <span className="text-[10px] text-gray-500">Có mặt</span>
          </div>
          <div className="flex flex-col items-center py-2.5">
            <span className="text-base font-black text-black">2</span>
            <span className="text-[10px] text-gray-500">Vắng mặt</span>
          </div>
          <div className="flex flex-col items-center py-2.5">
            <span className="text-base font-black text-black">1</span>
            <span className="text-[10px] text-gray-500">Đi trễ</span>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-5" />
    </div>
  )
}
