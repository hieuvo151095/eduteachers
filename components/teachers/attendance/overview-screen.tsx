'use client'

import { ChevronRight } from 'lucide-react'
import type { AbsenceRequest, CheckInRecord, CheckOutRecord, ClassInfo } from '@/lib/mock-data'
import { DIEM_DANH_STUDENTS } from '@/lib/mock-data'
import { AttendanceHeader, classSubtitle, EmptyStateIllustration, FilterRow, type Session } from './shared'

const SESSION_LABELS: Record<Session, string> = { sang: 'Buổi sáng', chieu: 'Buổi chiều' }

interface OverviewScreenProps {
  selectedClass: ClassInfo
  dateLabel: string
  session: Session
  onSessionChange: (session: Session) => void
  checkInRecords: Record<string, CheckInRecord>
  checkOutRecords: Record<string, CheckOutRecord>
  absenceRequests: AbsenceRequest[]
  onBack: () => void
  onChangeClass: () => void
  onOpenDatePicker: () => void
  onViewCheckIn: () => void
  onViewCheckOut: () => void
  onViewAbsence: () => void
}

export function OverviewScreen({
  selectedClass,
  dateLabel,
  session,
  onSessionChange,
  checkInRecords,
  checkOutRecords,
  absenceRequests,
  onBack,
  onChangeClass,
  onOpenDatePicker,
  onViewCheckIn,
  onViewCheckOut,
  onViewAbsence,
}: OverviewScreenProps) {
  const total = DIEM_DANH_STUDENTS.length
  const checkIns = Object.values(checkInRecords)
  const present = checkIns.filter((r) => r.status === 'có-mặt' || r.status === 'đến-muộn').length
  const absent = checkIns.filter((r) => r.status === 'vắng-có-phép' || r.status === 'vắng-không-phép').length
  const unmarked = checkIns.filter((r) => r.status === 'chưa-đón').length

  const checkOuts = Object.values(checkOutRecords)
  const returned = checkOuts.filter((r) => r.status === 'đã-về').length
  const notYetReturned = checkOuts.filter((r) => r.status === 'chưa-về').length
  const hasCheckOutActivity = returned > 0 || checkOuts.some((r) => r.status === 'vắng-có-phép' || r.status === 'vắng-không-phép')

  return (
    <div className="flex flex-col bg-gray-50">
      <AttendanceHeader
        title="Điểm danh"
        subtitle={classSubtitle(selectedClass)}
        onBack={onBack}
        onChangeClass={onChangeClass}
      />
      <FilterRow dateLabel={dateLabel} onOpenDatePicker={onOpenDatePicker} siSo={total} />

      {/* Buổi sáng / Buổi chiều — mỗi buổi có luồng đón + trả điểm danh riêng */}
      <div className="flex border-b border-gray-200 bg-white">
        {(['sang', 'chieu'] as Session[]).map((key) => (
          <button
            key={key}
            onClick={() => onSessionChange(key)}
            className={`flex-1 border-b-2 py-2.5 text-sm font-semibold transition-colors ${
              session === key ? 'border-orange-400 text-orange-600' : 'border-transparent text-gray-500'
            }`}
          >
            {SESSION_LABELS[key]}
          </button>
        ))}
      </div>

      <div className="space-y-4 p-4 pb-6">
        {/* Section 1 — Đón học sinh */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-black">Đón học sinh</p>
            <button onClick={onViewCheckIn} className="flex items-center gap-0.5 text-xs font-semibold text-blue-600">
              Xem danh sách <ChevronRight size={14} />
            </button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-blue-50 p-3 text-center">
                <p className="text-2xl font-bold text-black">{present}</p>
                <p className="mt-0.5 text-xs text-gray-600">Có mặt</p>
              </div>
              <div className="rounded-lg bg-orange-50 p-3 text-center">
                <p className="text-2xl font-bold text-black">{absent}</p>
                <p className="mt-0.5 text-xs text-gray-600">Vắng mặt</p>
              </div>
            </div>
            {unmarked > 0 && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-blue-500">
                  <span className="font-bold text-black">{unmarked}</span> học sinh chưa điểm danh
                </p>
                <button onClick={onViewCheckIn} className="text-xs font-semibold text-blue-600">
                  Tiếp tục đón
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 — Trả học sinh */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-black">Trả học sinh</p>
            <button onClick={onViewCheckOut} className="flex items-center gap-0.5 text-xs font-semibold text-blue-600">
              Xem danh sách <ChevronRight size={14} />
            </button>
          </div>
          {!hasCheckOutActivity ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-6">
              <EmptyStateIllustration />
              <p className="text-xs text-gray-500">Chưa có học sinh cần trả hôm nay</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              {notYetReturned > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-blue-500">
                    <span className="font-bold text-black">{notYetReturned}</span> học sinh chưa về
                  </p>
                  <button onClick={onViewCheckOut} className="text-xs font-semibold text-blue-600">
                    Tiếp tục trả
                  </button>
                </div>
              )}
              {notYetReturned === 0 && <p className="text-xs text-gray-500">Đã trả hết học sinh hôm nay</p>}
            </div>
          )}
        </div>

        {/* Section 3 — Đơn báo vắng hôm nay */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-black">Đơn báo vắng hôm nay</p>
            <button onClick={onViewAbsence} className="flex items-center gap-0.5 text-xs font-semibold text-blue-600">
              Xem danh sách <ChevronRight size={14} />
            </button>
          </div>
          {absenceRequests.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-6">
              <EmptyStateIllustration />
              <p className="text-xs text-gray-500">Không có đơn báo vắng hôm nay</p>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-xs text-gray-600">{absenceRequests.length} đơn báo vắng</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
