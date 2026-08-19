'use client'

import { useState } from 'react'
import { Clock, Search } from 'lucide-react'
import type { CheckInRecord, CheckOutRecord, ClassInfo } from '@/lib/mock-data'
import { DIEM_DANH_STUDENTS } from '@/lib/mock-data'
import { AttendanceHeader, badgeColorClass, checkInBadgeLabel, checkOutBadgeLabel, classSubtitle, FilterRow, StudentAvatar } from './shared'

type Group = 'unmarked' | 'present' | 'absent'
type TabKey = 'all' | Group

function groupOfDon(status: CheckInRecord['status']): Group {
  if (status === 'chưa-đón') return 'unmarked'
  if (status === 'có-mặt' || status === 'đến-muộn') return 'present'
  return 'absent'
}

function groupOfTra(status: CheckOutRecord['status']): Group {
  if (status === 'chưa-về') return 'unmarked'
  if (status === 'đã-về') return 'present'
  return 'absent'
}

interface StudentListScreenProps {
  mode: 'don' | 'tra'
  selectedClass: ClassInfo
  dateLabel: string
  checkInRecords: Record<string, CheckInRecord>
  checkOutRecords: Record<string, CheckOutRecord>
  selectedIds: string[]
  onToggleSelect: (ids: string[]) => void
  onBack: () => void
  onChangeClass: () => void
  onOpenDatePicker: () => void
  onProceed: () => void
}

export function StudentListScreen({
  mode,
  selectedClass,
  dateLabel,
  checkInRecords,
  checkOutRecords,
  selectedIds,
  onToggleSelect,
  onBack,
  onChangeClass,
  onOpenDatePicker,
  onProceed,
}: StudentListScreenProps) {
  const [tab, setTab] = useState<TabKey>('all')
  const [search, setSearch] = useState('')

  const title = mode === 'don' ? 'Đón học sinh' : 'Trả học sinh'
  const tabLabels: Record<TabKey, string> =
    mode === 'don'
      ? { all: 'Tất cả', unmarked: 'Chưa đón', present: 'Có mặt', absent: 'Vắng' }
      : { all: 'Tất cả', unmarked: 'Chưa về', present: 'Đã về', absent: 'Vắng mặt' }

  const rows = DIEM_DANH_STUDENTS.map((student) => {
    if (mode === 'don') {
      const record = checkInRecords[student.id]
      return {
        student,
        group: groupOfDon(record.status),
        time: record.checkInTime,
        badge: checkInBadgeLabel(record.status),
        badgeColor: badgeColorClass(record.status),
      }
    }
    const record = checkOutRecords[student.id]
    return {
      student,
      group: groupOfTra(record.status),
      time: record.checkOutTime,
      badge: checkOutBadgeLabel(record.status),
      badgeColor: badgeColorClass(record.status),
    }
  })

  // Unmarked students float to the top; everyone else keeps original order.
  const sortedRows = [...rows].sort((a, b) => {
    const aUnmarked = a.group === 'unmarked' ? 0 : 1
    const bUnmarked = b.group === 'unmarked' ? 0 : 1
    return aUnmarked - bUnmarked
  })

  const counts: Record<TabKey, number> = {
    all: rows.length,
    unmarked: rows.filter((r) => r.group === 'unmarked').length,
    present: rows.filter((r) => r.group === 'present').length,
    absent: rows.filter((r) => r.group === 'absent').length,
  }

  const q = search.trim().toLowerCase()
  const filtered = sortedRows.filter((r) => {
    const matchesTab = tab === 'all' || r.group === tab
    const matchesSearch = !q || r.student.name.toLowerCase().includes(q) || r.student.studentCode.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  const filteredIds = filtered.map((r) => r.student.id)
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id))

  const toggleOne = (id: string) => {
    onToggleSelect(selectedIds.includes(id) ? selectedIds.filter((sid) => sid !== id) : [...selectedIds, id])
  }

  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      onToggleSelect(selectedIds.filter((id) => !filteredIds.includes(id)))
    } else {
      onToggleSelect(Array.from(new Set([...selectedIds, ...filteredIds])))
    }
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gray-50">
      <AttendanceHeader title={title} subtitle={classSubtitle(selectedClass)} onBack={onBack} onChangeClass={onChangeClass} />
      <FilterRow dateLabel={dateLabel} onOpenDatePicker={onOpenDatePicker} siSo={DIEM_DANH_STUDENTS.length} />

      {/* Search */}
      <div className="bg-white px-4 pb-3 pt-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <Search size={15} className="shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhập tên, mã học sinh"
            className="w-full bg-transparent text-sm text-black placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 pb-3 scrollbar-hide">
        {(['all', 'unmarked', 'present', 'absent'] as TabKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              tab === key ? 'border-orange-400 bg-orange-400 text-white' : 'border-gray-300 bg-white text-gray-600'
            }`}
          >
            {tabLabels[key]} ({counts[key]})
          </button>
        ))}
      </div>

      {/* Select all */}
      <div className="flex items-center justify-end gap-2 px-4 py-2">
        <span className="text-xs text-gray-600">Chọn tất cả</span>
        <input
          type="checkbox"
          checked={allFilteredSelected}
          onChange={toggleAllFiltered}
          className="h-4 w-4 accent-orange-400"
        />
      </div>

      {/* List */}
      <div className="flex-1 space-y-2 px-3 pb-24">
        {filtered.length === 0 && <p className="py-8 text-center text-sm text-gray-400">Không có học sinh</p>}
        {filtered.map(({ student, time, badge, badgeColor }) => {
          const checked = selectedIds.includes(student.id)
          return (
            <div key={student.id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
              <StudentAvatar student={student} size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-black">{student.name}</p>
                <p className="text-[11px] text-gray-500">{student.studentCode}</p>
                <span className="mt-1 flex items-center gap-1.5">
                  {time && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                      <Clock size={10} />
                      {time}
                    </span>
                  )}
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}>{badge}</span>
                </span>
              </div>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleOne(student.id)}
                className="h-4 w-4 shrink-0 accent-orange-400"
              />
            </div>
          )
        })}
      </div>

      {/* Bottom fixed button */}
      <div className="absolute inset-x-0 bottom-0 border-t border-gray-200 bg-white p-3">
        <button
          onClick={onProceed}
          disabled={selectedIds.length === 0}
          className={`w-full rounded-xl py-3 text-sm font-bold ${
            selectedIds.length === 0 ? 'bg-gray-200 text-gray-400' : 'bg-orange-400 text-white active:opacity-90'
          }`}
        >
          Điểm danh
        </button>
      </div>
    </div>
  )
}
