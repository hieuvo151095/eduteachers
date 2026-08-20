'use client'

import { X, Download } from 'lucide-react'
import { THUC_DON_SCHOOL_INFO, type ThucDonTuan } from '@/lib/mock-data'

interface ImageViewerProps {
  week: ThucDonTuan
  onClose: () => void
}

const PERIOD_ROW_LABELS = ['Ăn sáng', 'Ăn trưa', 'Ăn xế'] as const

export function ImageViewer({ week, onClose }: ImageViewerProps) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between px-4 py-3">
        <button onClick={onClose} className="flex h-8 w-8 items-center justify-center text-white active:opacity-70">
          <X size={20} />
        </button>
        <span className="text-sm font-medium text-white">1/1</span>
        <button className="flex h-8 w-8 items-center justify-center text-white active:opacity-70">
          <Download size={18} />
        </button>
      </div>

      {/* Rendered "file" content — this app has no real PDF asset, so the
          attached file's content is rendered from the same week data shown
          on the main screen (thuc-don-flow-spec Thuc don 4 wireframe). */}
      <div className="flex-1 overflow-y-auto px-3 pb-6">
        <div className="rounded-lg bg-white p-4 text-black">
          <div className="text-center">
            <p className="text-sm font-bold">{THUC_DON_SCHOOL_INFO.name}</p>
            <p className="mt-0.5 text-[10px] text-gray-600">Địa chỉ: {THUC_DON_SCHOOL_INFO.address}</p>
            <p className="text-[10px] text-gray-600">Email: {THUC_DON_SCHOOL_INFO.email}</p>
          </div>

          <p className="mt-3 text-center text-xs font-bold uppercase tracking-wide">
            Thực đơn tuần: {week.label}
          </p>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[10px]">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Bữa ăn</th>
                  {week.days.map((day) => (
                    <th key={day.date} className="border border-gray-300 bg-gray-100 px-2 py-1.5 font-semibold">
                      Thứ {day.thu === 'T2' ? 2 : day.thu === 'T3' ? 3 : day.thu === 'T4' ? 4 : day.thu === 'T5' ? 5 : day.thu === 'T6' ? 6 : 7}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERIOD_ROW_LABELS.map((period) => (
                  <tr key={period}>
                    <td className="border border-gray-300 px-2 py-1.5 font-semibold">{period}</td>
                    {week.days.map((day) => {
                      const bua = day.buaAn.find((b) => b.period === period)
                      const names = bua?.foods.map((f) => f.name).join(', ') ?? '—'
                      return (
                        <td key={day.date} className="border border-gray-300 px-2 py-1.5">
                          {names}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[10px] italic text-gray-500">
            Ghi chú: * Thực đơn có thể linh hoạt thay đổi do nguồn cung cấp thực phẩm, để đảm bảo thực phẩm sạch, tươi ngon nhất cho trẻ.
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-2 text-[10px] text-gray-400">
            <span>Thiết kế bởi ECO School</span>
            <span>Trang 1/1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
