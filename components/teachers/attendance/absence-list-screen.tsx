'use client'

import { useState } from 'react'
import type { AbsenceRequest, AbsenceRequestStatus, ClassInfo, DiemDanhStudent } from '@/lib/mock-data'
import { AttendanceHeader, classSubtitle, EmptyStateIllustration, FilterRow } from './shared'

type TabKey = 'all' | AbsenceRequestStatus

const TAB_LABELS: Record<TabKey, string> = {
  all: 'Tất cả',
  'chờ-duyệt': 'Chờ duyệt',
  'đã-duyệt': 'Đã duyệt',
  'đã-huỷ': 'Đã huỷ',
}

interface AbsenceListScreenProps {
  selectedClass: ClassInfo
  dateLabel: string
  requests: AbsenceRequest[]
  students: DiemDanhStudent[]
  onBack: () => void
  onChangeClass: () => void
  onOpenDatePicker: () => void
}

export function AbsenceListScreen({
  selectedClass,
  dateLabel,
  requests,
  students,
  onBack,
  onChangeClass,
  onOpenDatePicker,
}: AbsenceListScreenProps) {
  const [tab, setTab] = useState<TabKey>('all')
  const studentMap = Object.fromEntries(students.map((s) => [s.id, s]))

  const counts: Record<TabKey, number> = {
    all: requests.length,
    'chờ-duyệt': requests.filter((r) => r.requestStatus === 'chờ-duyệt').length,
    'đã-duyệt': requests.filter((r) => r.requestStatus === 'đã-duyệt').length,
    'đã-huỷ': requests.filter((r) => r.requestStatus === 'đã-huỷ').length,
  }

  const filtered = requests.filter((r) => tab === 'all' || r.requestStatus === tab)

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <AttendanceHeader title="Báo vắng" subtitle={classSubtitle(selectedClass)} onBack={onBack} onChangeClass={onChangeClass} />
      {/* No "Sĩ số" badge on this screen — diem-danh-flow-spec Open Question #4 */}
      <FilterRow dateLabel={dateLabel} onOpenDatePicker={onOpenDatePicker} />

      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 py-3 scrollbar-hide">
        {(['all', 'chờ-duyệt', 'đã-duyệt', 'đã-huỷ'] as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              tab === key ? 'border-orange-400 bg-orange-400 text-white' : 'border-gray-300 bg-white text-gray-600'
            }`}
          >
            {TAB_LABELS[key]} ({counts[key]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
          <EmptyStateIllustration />
          <p className="text-sm text-gray-500">Chưa có đơn báo vắng</p>
        </div>
      ) : (
        <div className="space-y-2 p-3">
          {filtered.map((req) => (
            <div key={req.id} className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-sm font-semibold text-black">{studentMap[req.studentId]?.name}</p>
              <p className="mt-0.5 text-xs text-gray-600">{req.reason}</p>
              <p className="mt-0.5 text-[11px] text-gray-400">{req.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
