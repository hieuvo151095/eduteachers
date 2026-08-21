'use client'

import { Lock, Plus } from 'lucide-react'
import type { ClassInfo, DiemDanhStudent, PhieuBeNgoan } from '@/lib/mock-data'
import { AppHeader, classSubtitle } from '@/components/teachers/shared/header'

interface LichSuScreenProps {
  selectedClass: ClassInfo
  students: DiemDanhStudent[]
  records: PhieuBeNgoan[] // sorted newest first
  onBack: () => void
  onChangeClass: () => void
  onCreateNew: () => void
  onOpenRecord: (record: PhieuBeNgoan) => void
}

function formatSentAt(iso: string): string {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${min} ${dd}/${mm}/${yyyy}`
}

export function LichSuScreen({
  selectedClass,
  students,
  records,
  onBack,
  onChangeClass,
  onCreateNew,
  onOpenRecord,
}: LichSuScreenProps) {
  return (
    <div className="flex flex-col bg-white">
      <AppHeader
        title="Lịch sử phát phiếu"
        subtitle={classSubtitle(selectedClass)}
        onBack={onBack}
        onChangeClass={onChangeClass}
      />

      <div className="px-4 py-3">
        <button
          onClick={onCreateNew}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-blue-500 py-2.5 text-sm font-semibold text-blue-600 active:bg-blue-50"
        >
          <Plus size={16} />
          Phát phiếu mới
        </button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <span className="text-3xl">🌟</span>
          <p className="text-sm text-gray-400">Chưa có phiếu bé ngoan nào được gửi.</p>
        </div>
      ) : (
        <div className="space-y-2 px-4 pb-6">
          {records.map((record, idx) => {
            const isLatest = idx === 0
            const datCount = record.ketQua.filter((k) => k.dat).length
            return (
              <button
                key={record.id}
                onClick={() => onOpenRecord(record)}
                className="flex w-full flex-col items-start gap-1.5 rounded-xl border border-gray-200 px-4 py-3 text-left active:bg-gray-50"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-black">
                    <span className="text-base">🌟</span>
                    {record.chuKyLoai === 'tuan' ? 'Tuần' : 'Tháng'}: {record.chuKyLabel}
                  </span>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                    Đạt {datCount}/{students.length}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between">
                  <p className="text-xs text-gray-500">Đã gửi lúc {formatSentAt(record.sentAt)}</p>
                  {isLatest ? (
                    <span className="text-xs font-semibold text-blue-600">Mới nhất · có thể sửa</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Lock size={11} />
                      Chỉ xem
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
