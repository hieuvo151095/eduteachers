'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  CAP23_TABS,
  DDGTX_COLUMNS,
  type Cap23CaNamData,
  type Cap23HocKyData,
  type Cap23TongKetRow,
} from '@/lib/mock-data'

interface Cap23ScreenProps {
  activeTabIndex: number
  onSelectTab: (index: number) => void
  hocKyData?: Cap23HocKyData // present when tab is "hk1" or "hk2"
  caNamData?: Cap23CaNamData // present when tab is "ca-nam"
  hocKyLabel: string // "Học kỳ I" | "Học kỳ II"
}

function TongKetTable({ columns, rows }: { columns: string[]; rows: Cap23TongKetRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="flex bg-gray-50 text-xs font-semibold text-gray-600">
        <div className="flex-1 px-3 py-2">Danh mục</div>
        {columns.map((col) => (
          <div key={col} className="w-20 shrink-0 px-2 py-2 text-center">
            {col}
          </div>
        ))}
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div key={row.danhMuc} className="flex items-center text-sm">
            <div className="flex-1 px-3 py-2 text-black">{row.danhMuc}</div>
            {row.values.map((v, i) => (
              <div key={i} className="w-20 shrink-0 px-2 py-2 text-center font-semibold text-black">
                {v}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Grid column widths (px): Môn học | 5× ĐĐGTX | ĐĐGGK | ĐĐGCK | TBHK
const MON_HOC_W = 120
const SUB_W = 56
const RESULT_W = 64
const GRID_COLS = `${MON_HOC_W}px repeat(5, ${SUB_W}px) ${RESULT_W}px ${RESULT_W}px ${RESULT_W}px`

function BangDiemHeader() {
  return (
    <div className="grid bg-gray-50 text-[11px] font-semibold text-gray-600" style={{ gridTemplateColumns: GRID_COLS }}>
      <div
        className="sticky left-0 z-10 flex items-center border-r border-gray-200 bg-gray-50 px-3 py-2"
        style={{ gridColumn: '1 / 2', gridRow: '1 / 3' }}
      >
        Môn học
      </div>
      <div
        className="flex items-center justify-center border-b border-gray-200 py-1.5"
        style={{ gridColumn: '2 / 7', gridRow: '1 / 2' }}
      >
        ĐĐGTX
      </div>
      <div
        className="flex items-center justify-center border-l border-gray-200 px-1 text-center leading-tight"
        style={{ gridColumn: '7 / 8', gridRow: '1 / 3' }}
      >
        ĐĐGGK
      </div>
      <div
        className="flex items-center justify-center border-l border-gray-200 px-1 text-center leading-tight"
        style={{ gridColumn: '8 / 9', gridRow: '1 / 3' }}
      >
        ĐĐGCK
      </div>
      <div
        className="flex items-center justify-center border-l border-gray-200 px-1 text-center leading-tight"
        style={{ gridColumn: '9 / 10', gridRow: '1 / 3' }}
      >
        TBHK
      </div>
      {DDGTX_COLUMNS.map((label, idx) => (
        <div
          key={idx}
          className="flex items-center justify-center px-1 text-center leading-tight"
          style={{ gridColumn: `${2 + idx} / ${3 + idx}`, gridRow: '2 / 3' }}
        >
          {label}
        </div>
      ))}
    </div>
  )
}

// Bảng vuốt ngang bằng cử chỉ chạm/trackpad hoạt động sẵn với overflow-x-auto,
// nhưng chuột thường (không trackpad) không tạo delta ngang — cần kéo-thả
// bằng chuột (drag-to-scroll) + 2 nút mũi tên làm phương án dự phòng, và giữ
// scrollbar hiển thị thay vì ẩn để có tín hiệu còn nội dung bị che.
function BangDiemTable({ hocKyData }: { hocKyData: Cap23HocKyData }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startScrollLeft: number } | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    dragRef.current = { startX: e.clientX, startScrollLeft: el.scrollLeft }
  }
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el || !dragRef.current) return
    e.preventDefault()
    el.scrollLeft = dragRef.current.startScrollLeft - (e.clientX - dragRef.current.startX)
  }
  const endDrag = () => {
    dragRef.current = null
  }
  const nudge = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * SUB_W * 2, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="cursor-grab select-none overflow-x-auto rounded-xl border border-gray-200 active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <div style={{ minWidth: MON_HOC_W + SUB_W * 5 + RESULT_W * 3 }}>
          <BangDiemHeader />
          <div className="divide-y divide-gray-100">
            {hocKyData.bangDiem.map((row) => (
              <div key={row.name} className="grid text-sm" style={{ gridTemplateColumns: GRID_COLS }}>
                <div className="sticky left-0 z-10 border-r border-gray-200 bg-white px-3 py-2 text-black">
                  {row.name}
                </div>
                {row.ddgtx.map((v, i) => (
                  <div key={i} className="px-1 py-2 text-center text-black">
                    {v}
                  </div>
                ))}
                <div className="border-l border-gray-100 px-1 py-2 text-center font-semibold text-black">
                  {row.ddggk}
                </div>
                <div className="border-l border-gray-100 px-1 py-2 text-center font-semibold text-black">
                  {row.ddgck}
                </div>
                <div className="border-l border-gray-100 px-1 py-2 text-center font-semibold text-black">
                  {row.tbhk}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nút cuộn ngang — phương án dự phòng cho chuột thường (không trackpad) */}
      <button
        onClick={() => nudge(-1)}
        aria-label="Cuộn trái"
        className="absolute -left-2 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm active:bg-gray-50"
      >
        <ChevronLeft size={15} />
      </button>
      <button
        onClick={() => nudge(1)}
        aria-label="Cuộn phải"
        className="absolute -right-2 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm active:bg-gray-50"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  )
}

export function Cap23Screen({ activeTabIndex, onSelectTab, hocKyData, caNamData, hocKyLabel }: Cap23ScreenProps) {
  const isCaNam = activeTabIndex === 2

  return (
    <div className="flex flex-col bg-gray-50">
      {/* Tab bar */}
      <div className="flex gap-1.5 border-b border-gray-100 bg-white px-3 py-3">
        {CAP23_TABS.map((tab, idx) => {
          const isActive = idx === activeTabIndex
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(idx)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isActive ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {isCaNam && caNamData && (
        <>
          <div className="bg-white px-4 py-3">
            <p className="mb-2 text-sm font-bold text-black">Tổng kết học kỳ, năm học</p>
            <TongKetTable columns={['Học kỳ I', 'Học kỳ II', 'Tổng kết']} rows={caNamData.tongKet} />
          </div>

          <div className="bg-white px-4 pb-3">
            <p className="text-sm font-bold text-black">Ghi chú</p>
            <p className="mt-1 text-xs text-gray-500">T: Tốt, K: Khá, Đ: Đạt, CD: Chưa đạt</p>
            <p className="text-xs text-gray-500">G: Giỏi, TT: Tiên tiến, XS: Xuất sắc</p>
          </div>

          <div className="mt-2 bg-white px-4 py-3">
            <p className="mb-2 text-sm font-bold text-black">Kết quả học tập</p>
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 py-10 text-center">
              <div className="h-10 w-10 rounded-full border-2 border-dashed border-gray-300" />
              <p className="text-sm text-gray-400">Chưa có dữ liệu kết quả học tập.</p>
            </div>
          </div>
        </>
      )}

      {!isCaNam && hocKyData && (
        <>
          <div className="bg-white px-4 py-3">
            <p className="mb-2 text-sm font-bold text-black">Tổng kết học kỳ</p>
            <TongKetTable columns={[hocKyLabel]} rows={hocKyData.tongKet} />
          </div>

          <div className="bg-white px-4 pb-3">
            <p className="text-sm font-bold text-black">Ghi chú</p>
            <p className="mt-1 text-xs text-gray-500">T: Tốt, K: Khá, Đ: Đạt, CD: Chưa đạt</p>
            <p className="text-xs text-gray-500">G: Giỏi, TT: Tiên tiến, XS: Xuất sắc</p>
          </div>

          <div className="mt-2 bg-white px-4 py-3">
            <p className="mb-2 text-sm font-bold text-black">Kết quả học tập</p>
            <BangDiemTable hocKyData={hocKyData} />
          </div>

          <div className="bg-white px-4 pb-3">
            <p className="text-sm font-bold text-black">Ghi chú</p>
            <p className="mt-1 text-xs text-gray-500">ĐĐGTX: Điểm đánh giá thường xuyên</p>
            <p className="text-xs text-gray-500">ĐĐGGK: Điểm đánh giá giữa kỳ</p>
            <p className="text-xs text-gray-500">ĐĐGCK: Điểm đánh giá cuối kỳ</p>
            <p className="text-xs text-gray-500">TBHK: Trung bình học kỳ</p>
            <p className="text-xs text-gray-500">KTĐK: Kiểm tra định kỳ</p>
          </div>

          <div className="mt-2 bg-white px-4 py-4">
            <p className="mb-2 text-sm font-bold text-black">Nhận xét của giáo viên bộ môn</p>
            {hocKyData.nhanXet.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">Chưa có nhận xét từ giáo viên bộ môn.</p>
            ) : (
              <div className="space-y-2">
                {hocKyData.nhanXet.map((nx) => (
                  <div key={nx.subject} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500">{nx.subject}</p>
                    <p className="mt-1 text-sm font-semibold text-black">{nx.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-4" />
        </>
      )}
    </div>
  )
}
