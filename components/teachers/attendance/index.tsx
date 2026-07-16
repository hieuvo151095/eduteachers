'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Camera,
  ChevronDown,
  X,
} from 'lucide-react'
import {
  MOCK_ATTENDANCE_TODAY,
  MOCK_CHECKOUT_TODAY,
  MOCK_ABSENCE_REQUESTS_TODAY,
  TODAY_STR,
  generateStudentsForClass,
  getApprovedAbsenceStudentIds,
  getPendingAbsenceStudentIds,
  type AttendanceStatus,
  type CheckoutStatus,
  type AbsenceRequest,
  type Student,
  type CheckInRecord,
  type CheckOutRecord,
} from '@/lib/mock-data'

// ─── Types ────────────────────────────────────────────────────────────────

type ScreenType = 'overview' | 'check-in' | 'check-out' | 'absence-requests' | 'absence-detail'
type CheckInFilter = 'all' | 'present' | 'absent' | 'unmarked'
type CheckOutFilter = 'all' | 'checked-out' | 'pending'

// ─── Helpers ─────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function nowTime(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function statusLabel(status: AttendanceStatus): string {
  switch (status) {
    case 'đúng-giờ': return 'Có mặt'
    case 'đi-trễ': return 'Đi trễ'
    case 'vắng-có-phép': return 'Vắng có phép'
    case 'vắng-không-phép': return 'Vắng không phép'
    case 'chưa-điểm-danh': return 'Chưa điểm danh'
    case 'chờ-duyệt': return 'Chờ duyệt'
  }
}

function statusColor(status: AttendanceStatus): string {
  switch (status) {
    case 'đúng-giờ': return 'bg-black text-white'
    case 'đi-trễ': return 'bg-gray-700 text-white'
    case 'vắng-có-phép': return 'bg-gray-200 text-gray-800'
    case 'vắng-không-phép': return 'bg-gray-400 text-white'
    case 'chưa-điểm-danh': return 'bg-gray-100 text-gray-600'
    case 'chờ-duyệt': return 'bg-gray-300 text-gray-700'
  }
}

// ─── Avatar ───────────────────────────────────────────────────────────────

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {getInitials(name)}
    </div>
  )
}

// ─── Section Header ────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string
  subtitle?: string
  onBack: () => void
}) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
      <button onClick={onBack} className="p-1 text-gray-600 active:text-black">
        <ChevronLeft size={22} />
      </button>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-bold text-black">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  )
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────

function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40">
      <div className="rounded-t-2xl bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <p className="text-sm font-bold text-black">{title}</p>
          <button onClick={onClose} className="p-1 text-gray-500 active:text-black">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Main AttendanceApp ───────────────────────────────────────────────────

interface AttendanceAppProps {
  onBack: () => void
}

export function AttendanceApp({ onBack }: AttendanceAppProps) {
  const [screen, setScreen] = useState<ScreenType>('overview')
  const [selectedDate] = useState(TODAY_STR)
  const [attendance, setAttendance] = useState<Record<string, CheckInRecord>>(MOCK_ATTENDANCE_TODAY)
  const [checkout, setCheckout] = useState<Record<string, CheckOutRecord>>(MOCK_CHECKOUT_TODAY)
  const [absenceRequests, setAbsenceRequests] = useState<AbsenceRequest[]>(MOCK_ABSENCE_REQUESTS_TODAY)
  const [selectedAbsenceId, setSelectedAbsenceId] = useState<string | null>(null)

  const students = generateStudentsForClass('class-7')

  const checkedInCount = Object.values(attendance).filter(
    (a) => a.status === 'đúng-giờ' || a.status === 'đi-trễ'
  ).length
  const checkedOutCount = Object.values(checkout).filter((c) => c.checkOutTime).length
  const pendingRequests = absenceRequests.filter((r) => r.requestStatus === 'chờ-duyệt').length

  const handleCheckIn = (studentId: string, status: AttendanceStatus, note?: string) => {
    const time = nowTime()
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], checkInTime: status !== 'vắng-có-phép' && status !== 'vắng-không-phép' ? time : undefined, status, note },
    }))
  }

  const handleCheckOut = (studentId: string) => {
    const time = nowTime()
    setCheckout((prev) => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || {}), studentId, date: selectedDate, checkOutTime: time, status: 'về-đúng-giờ' as CheckoutStatus },
    }))
  }

  const handleApproveAbsence = (requestId: string, studentId: string) => {
    setAbsenceRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, requestStatus: 'đã-duyệt' as const } : r)
    )
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status: 'vắng-có-phép' as const },
    }))
  }

  const handleRejectAbsence = (requestId: string) => {
    setAbsenceRequests((prev) =>
      prev.map((r) => r.id === requestId ? { ...r, requestStatus: 'đã-hủy' as const } : r)
    )
  }

  const handleApproveAll = () => {
    const pending = absenceRequests.filter((r) => r.requestStatus === 'chờ-duyệt')
    pending.forEach((r) => handleApproveAbsence(r.id, r.studentId))
  }

  return (
    <div className="relative flex min-h-full flex-col bg-gray-50 font-sans">
      {/* Top header — always visible */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <button
          onClick={screen === 'overview' ? onBack : () => setScreen('overview')}
          className="p-1 text-gray-600 active:text-black"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-base font-bold text-black">
            {screen === 'overview' ? 'Điểm danh' :
             screen === 'check-in' ? 'Đón học sinh' :
             screen === 'check-out' ? 'Trả học sinh' :
             screen === 'absence-requests' ? 'Đơn báo vắng' : 'Chi tiết đơn'}
          </h1>
          <p className="text-xs text-gray-500">Lớp 6A2 • {selectedDate}</p>
        </div>
      </div>

      {/* Screen content */}
      <div className="flex-1">
        {screen === 'overview' && (
          <OverviewScreen
            students={students}
            attendance={attendance}
            checkedInCount={checkedInCount}
            checkedOutCount={checkedOutCount}
            pendingRequests={pendingRequests}
            absenceRequestsCount={absenceRequests.length}
            onCheckInClick={() => setScreen('check-in')}
            onCheckOutClick={() => setScreen('check-out')}
            onAbsenceClick={() => setScreen('absence-requests')}
          />
        )}
        {screen === 'check-in' && (
          <CheckInScreen
            students={students}
            attendance={attendance}
            absenceRequests={absenceRequests}
            onCheckIn={handleCheckIn}
            onApproveAbsence={handleApproveAbsence}
            onViewAbsenceDetail={(id) => { setSelectedAbsenceId(id); setScreen('absence-detail') }}
          />
        )}
        {screen === 'check-out' && (
          <CheckOutScreen
            students={students}
            attendance={attendance}
            checkout={checkout}
            onCheckOut={handleCheckOut}
          />
        )}
        {screen === 'absence-requests' && (
          <AbsenceRequestScreen
            requests={absenceRequests}
            students={students}
            onApprove={handleApproveAbsence}
            onReject={handleRejectAbsence}
            onApproveAll={handleApproveAll}
            onViewDetail={(id) => { setSelectedAbsenceId(id); setScreen('absence-detail') }}
          />
        )}
        {screen === 'absence-detail' && selectedAbsenceId && (
          <AbsenceDetailScreen
            request={absenceRequests.find((r) => r.id === selectedAbsenceId)!}
            student={students.find((s) => s.id === absenceRequests.find((r) => r.id === selectedAbsenceId)?.studentId)!}
            onApprove={(id, sid) => { handleApproveAbsence(id, sid); setScreen('absence-requests') }}
            onReject={(id) => { handleRejectAbsence(id); setScreen('absence-requests') }}
          />
        )}
      </div>
    </div>
  )
}

// ─── Overview Screen ──────────────────────────────────────────────────────

function OverviewScreen({
  students,
  attendance,
  checkedInCount,
  checkedOutCount,
  pendingRequests,
  absenceRequestsCount,
  onCheckInClick,
  onCheckOutClick,
  onAbsenceClick,
}: {
  students: Student[]
  attendance: Record<string, CheckInRecord>
  checkedInCount: number
  checkedOutCount: number
  pendingRequests: number
  absenceRequestsCount: number
  onCheckInClick: () => void
  onCheckOutClick: () => void
  onAbsenceClick: () => void
}) {
  const total = students.length
  const present = Object.values(attendance).filter((a) => a.status === 'đúng-giờ' || a.status === 'đi-trễ').length
  const absent = Object.values(attendance).filter((a) => a.status === 'vắng-có-phép' || a.status === 'vắng-không-phép').length
  const unmarked = Object.values(attendance).filter((a) => a.status === 'chưa-điểm-danh').length

  const unmarkedStudents = students.filter((s) => attendance[s.id]?.status === 'chưa-điểm-danh')

  return (
    <div className="space-y-3 p-4 pb-6">
      {/* Check-in row */}
      <button
        onClick={onCheckInClick}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left active:bg-gray-50"
      >
        <div>
          <p className="text-xs font-medium text-gray-500">Đón học sinh</p>
          <p className="mt-0.5 text-2xl font-bold text-black">
            {checkedInCount}<span className="text-base font-normal text-gray-400">/{total}</span>
          </p>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </button>

      {/* Check-out row */}
      <button
        onClick={onCheckOutClick}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left active:bg-gray-50"
      >
        <div>
          <p className="text-xs font-medium text-gray-500">Trả học sinh</p>
          <p className="mt-0.5 text-2xl font-bold text-black">
            {checkedOutCount}<span className="text-base font-normal text-gray-400">/{total}</span>
          </p>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </button>

      {/* Status breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tổng quan điểm danh</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Có mặt', count: present },
            { label: 'Vắng', count: absent },
            { label: 'Chưa ĐD', count: unmarked },
          ].map(({ label, count }) => (
            <div key={label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
              <p className="text-xl font-bold text-black">{count}</p>
              <p className="mt-0.5 text-[11px] text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Unmarked students list */}
        {unmarkedStudents.length > 0 && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="mb-2 text-[11px] font-semibold text-gray-500">Chưa điểm danh:</p>
            <div className="flex flex-wrap gap-1.5">
              {unmarkedStudents.map((s) => (
                <span key={s.id} className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-700">
                  {s.name.split(' ').pop()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Absence requests */}
      <button
        onClick={onAbsenceClick}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left active:bg-gray-50"
      >
        <div>
          <p className="text-xs font-medium text-gray-500">Đơn báo vắng</p>
          <p className="mt-0.5 text-2xl font-bold text-black">
            {absenceRequestsCount}<span className="text-base font-normal text-gray-400"> đơn</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pendingRequests > 0 && (
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[11px] font-bold text-white">
              {pendingRequests} chờ duyệt
            </span>
          )}
          <ChevronRight size={18} className="text-gray-400" />
        </div>
      </button>
    </div>
  )
}

// ─── Check-In Screen ──────────────────────────────────────────────────────

function CheckInScreen({
  students,
  attendance,
  absenceRequests,
  onCheckIn,
  onApproveAbsence,
  onViewAbsenceDetail,
}: {
  students: Student[]
  attendance: Record<string, CheckInRecord>
  absenceRequests: AbsenceRequest[]
  onCheckIn: (studentId: string, status: AttendanceStatus, note?: string) => void
  onApproveAbsence: (requestId: string, studentId: string) => void
  onViewAbsenceDetail: (requestId: string) => void
}) {
  const [filter, setFilter] = useState<CheckInFilter>('all')
  const [search, setSearch] = useState('')
  const [sheetStudentId, setSheetStudentId] = useState<string | null>(null)
  const [sheetNote, setSheetNote] = useState('')
  const [sheetAbsenceType, setSheetAbsenceType] = useState<'vắng-có-phép' | 'vắng-không-phép'>('vắng-có-phép')

  const approvedIds = getApprovedAbsenceStudentIds(absenceRequests)
  const pendingIds = getPendingAbsenceStudentIds(absenceRequests)

  const filtered = students.filter((s) => {
    const status = attendance[s.id]?.status
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.includes(search)
    const matchFilter =
      filter === 'all' ? true :
      filter === 'present' ? (status === 'đúng-giờ' || status === 'đi-trễ') :
      filter === 'absent' ? (status === 'vắng-có-phép' || status === 'vắng-không-phép') :
      status === 'chưa-điểm-danh'
    return matchSearch && matchFilter
  })

  const sheetStudent = students.find((s) => s.id === sheetStudentId)
  const sheetRecord = sheetStudentId ? attendance[sheetStudentId] : null
  const sheetAbsenceReq = absenceRequests.find((r) => r.studentId === sheetStudentId)

  const filterCounts = {
    all: students.length,
    present: students.filter((s) => { const st = attendance[s.id]?.status; return st === 'đúng-giờ' || st === 'đi-trễ' }).length,
    absent: students.filter((s) => { const st = attendance[s.id]?.status; return st === 'vắng-có-phép' || st === 'vắng-không-phép' }).length,
    unmarked: students.filter((s) => attendance[s.id]?.status === 'chưa-điểm-danh').length,
  }

  const openSheet = (studentId: string) => {
    setSheetStudentId(studentId)
    setSheetNote(attendance[studentId]?.note || '')
    setSheetAbsenceType('vắng-có-phép')
  }

  return (
    <div className="relative flex flex-col bg-gray-50">
      {/* Search */}
      <div className="bg-white px-4 pb-3 pt-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <Search size={15} className="shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên hoặc mã HS..."
            className="w-full bg-transparent text-sm text-black placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto bg-white px-4 pb-3 scrollbar-hide">
        {([
          { key: 'all', label: 'Tất cả' },
          { key: 'present', label: 'Có mặt' },
          { key: 'absent', label: 'Vắng' },
          { key: 'unmarked', label: 'Chưa ĐD' },
        ] as { key: CheckInFilter; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filter === key ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-600'
            }`}
          >
            {label} ({filterCounts[key]})
          </button>
        ))}
      </div>

      {/* Student list */}
      <div className="space-y-2 p-3 pb-6">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">Không có học sinh</p>
        )}
        {filtered.map((student) => {
          const record = attendance[student.id]
          const status = record?.status || 'chưa-điểm-danh'
          const hasApprovedAbsence = approvedIds.has(student.id)
          const hasPendingAbsence = pendingIds.has(student.id)
          const isCheckedIn = status === 'đúng-giờ' || status === 'đi-trễ'
          const isAbsent = status === 'vắng-có-phép' || status === 'vắng-không-phép'
          const isUnmarked = status === 'chưa-điểm-danh'

          return (
            <div key={student.id} className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <Avatar name={student.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-black">{student.name}</p>
                  <p className="text-[11px] text-gray-500">{student.studentCode}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColor(status)}`}>
                  {statusLabel(status)}
                </span>
              </div>

              {record?.checkInTime && (
                <p className="mt-1.5 text-[11px] text-gray-500">
                  <Clock size={10} className="mr-0.5 inline" />
                  Vào lúc {record.checkInTime}
                </p>
              )}

              {record?.note && (
                <p className="mt-1 text-[11px] italic text-gray-500">Ghi chú: {record.note}</p>
              )}

              {/* Actions based on state */}
              <div className="mt-2.5 flex flex-wrap gap-2">
                {/* Unmarked — no absence request */}
                {isUnmarked && !hasApprovedAbsence && !hasPendingAbsence && (
                  <>
                    <button
                      onClick={() => { onCheckIn(student.id, 'đúng-giờ'); openSheet(student.id) }}
                      className="flex-1 rounded-lg border border-black bg-black py-1.5 text-[12px] font-semibold text-white active:opacity-80"
                    >
                      Xac nhan don
                    </button>
                    <button
                      onClick={() => openSheet(student.id)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-[12px] font-semibold text-gray-700 active:bg-gray-50"
                    >
                      Vang
                    </button>
                  </>
                )}

                {/* Unmarked — has approved absence request → default to vắng có phép */}
                {isUnmarked && hasApprovedAbsence && (
                  <div className="flex w-full flex-wrap items-center gap-2">
                    <span className="text-[11px] text-gray-500">Đơn đã duyệt → mặc định Vắng có phép</span>
                    <button
                      onClick={() => openSheet(student.id)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-[12px] font-semibold text-gray-700 active:bg-gray-50"
                    >
                      Chinh sua
                    </button>
                  </div>
                )}

                {/* Unmarked — has pending absence request */}
                {isUnmarked && hasPendingAbsence && (
                  <div className="flex w-full flex-wrap gap-2">
                    <span className="flex w-full items-center gap-1 text-[11px] text-gray-500">
                      <AlertCircle size={11} />
                      Đon bao vang chua duyet
                    </span>
                    <button
                      onClick={() => {
                        onCheckIn(student.id, 'đúng-giờ')
                      }}
                      className="flex-1 rounded-lg border border-black bg-black py-1.5 text-[12px] font-semibold text-white active:opacity-80"
                    >
                      Xac nhan don
                    </button>
                    <button
                      onClick={() => {
                        const req = absenceRequests.find((r) => r.studentId === student.id && r.requestStatus === 'chờ-duyệt')
                        if (req) onViewAbsenceDetail(req.id)
                      }}
                      className="flex-1 rounded-lg border border-gray-300 py-1.5 text-[12px] font-semibold text-gray-700 active:bg-gray-50"
                    >
                      Xem don vang
                    </button>
                  </div>
                )}

                {/* Checked in — can edit */}
                {isCheckedIn && (
                  <button
                    onClick={() => openSheet(student.id)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-semibold text-gray-600 active:bg-gray-50"
                  >
                    Chinh sua
                  </button>
                )}

                {/* Absent — can edit */}
                {isAbsent && (
                  <button
                    onClick={() => openSheet(student.id)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-semibold text-gray-600 active:bg-gray-50"
                  >
                    Chinh sua
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit/Detail Bottom Sheet */}
      <BottomSheet
        open={!!sheetStudentId}
        onClose={() => setSheetStudentId(null)}
        title={sheetStudent ? sheetStudent.name : ''}
      >
        {sheetStudent && (
          <div className="p-4 pb-8 space-y-4">
            {/* Student info */}
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <Avatar name={sheetStudent.name} size={44} />
              <div>
                <p className="text-sm font-semibold text-black">{sheetStudent.name}</p>
                <p className="text-xs text-gray-500">{sheetStudent.studentCode}</p>
              </div>
            </div>

            {/* Status select */}
            <div>
              <p className="mb-2 text-xs font-semibold text-gray-500">Trang thai</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'đúng-giờ', label: 'Co mat' },
                  { value: 'đi-trễ', label: 'Di tre' },
                  { value: 'vắng-có-phép', label: 'Vang co phep' },
                  { value: 'vắng-không-phép', label: 'Vang khong phep' },
                ] as { value: AttendanceStatus; label: string }[]).map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => onCheckIn(sheetStudent.id, value, sheetNote || undefined)}
                    className={`rounded-lg border py-2 text-xs font-semibold transition-colors ${
                      sheetRecord?.status === value
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 bg-white text-gray-700 active:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-500">Ghi chu (khong bat buoc)</p>
              <textarea
                value={sheetNote}
                onChange={(e) => setSheetNote(e.target.value)}
                rows={2}
                placeholder="Them ghi chu..."
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black placeholder-gray-400 outline-none focus:border-gray-400"
              />
            </div>

            {/* Photo placeholder */}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 active:bg-gray-50">
              <Camera size={16} />
              Chup hinh hoc sinh (tuy chon)
            </button>

            <button
              onClick={() => {
                onCheckIn(sheetStudent.id, sheetRecord?.status || 'đúng-giờ', sheetNote || undefined)
                setSheetStudentId(null)
              }}
              className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white active:opacity-80"
            >
              Luu
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}

// ─── Check-Out Screen ─────────────────────────────────────────────────────

function CheckOutScreen({
  students,
  attendance,
  checkout,
  onCheckOut,
}: {
  students: Student[]
  attendance: Record<string, CheckInRecord>
  checkout: Record<string, CheckOutRecord>
  onCheckOut: (studentId: string) => void
}) {
  const [filter, setFilter] = useState<CheckOutFilter>('all')
  const [search, setSearch] = useState('')
  const [sheetStudentId, setSheetStudentId] = useState<string | null>(null)
  const [sheetNote, setSheetNote] = useState('')

  const eligibleStudents = students.filter((s) => {
    const status = attendance[s.id]?.status
    return status === 'đúng-giờ' || status === 'đi-trễ'
  })

  const filtered = eligibleStudents.filter((s) => {
    const checkedOut = !!checkout[s.id]?.checkOutTime
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.studentCode.includes(search)
    const matchFilter =
      filter === 'all' ? true :
      filter === 'checked-out' ? checkedOut :
      !checkedOut
    return matchSearch && matchFilter
  })

  const checkedOutCount = eligibleStudents.filter((s) => !!checkout[s.id]?.checkOutTime).length
  const sheetStudent = students.find((s) => s.id === sheetStudentId)

  return (
    <div className="relative flex flex-col bg-gray-50">
      {/* Search */}
      <div className="bg-white px-4 pb-3 pt-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <Search size={15} className="shrink-0 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tim ten hoac ma HS..."
            className="w-full bg-transparent text-sm text-black placeholder-gray-400 outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Da tra: {checkedOutCount}/{eligibleStudents.length} hoc sinh
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto bg-white px-4 pb-3 scrollbar-hide">
        {([
          { key: 'all', label: 'Tat ca', count: eligibleStudents.length },
          { key: 'checked-out', label: 'Da tra', count: checkedOutCount },
          { key: 'pending', label: 'Chua tra', count: eligibleStudents.length - checkedOutCount },
        ] as { key: CheckOutFilter; label: string; count: number }[]).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
              filter === key ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-600'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Student list */}
      <div className="space-y-2 p-3 pb-6">
        {filtered.map((student) => {
          const record = checkout[student.id]
          const checkedOut = !!record?.checkOutTime

          return (
            <div key={student.id} className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-3">
                <Avatar name={student.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-black">{student.name}</p>
                  <p className="text-[11px] text-gray-500">
                    {student.studentCode} • Vao: {attendance[student.id]?.checkInTime || '--'}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  checkedOut ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {checkedOut ? 'Da tra' : 'Chua tra'}
                </span>
              </div>

              {checkedOut && (
                <p className="mt-1.5 text-[11px] text-gray-500">
                  <Clock size={10} className="mr-0.5 inline" />
                  Ra luc {record.checkOutTime}
                </p>
              )}
              {record?.note && <p className="mt-1 text-[11px] italic text-gray-500">Ghi chu: {record.note}</p>}

              <div className="mt-2.5 flex gap-2">
                {!checkedOut ? (
                  <button
                    onClick={() => { onCheckOut(student.id); setSheetStudentId(student.id) }}
                    className="flex-1 rounded-lg border border-black bg-black py-1.5 text-[12px] font-semibold text-white active:opacity-80"
                  >
                    Xac nhan tra
                  </button>
                ) : null}
                <button
                  onClick={() => setSheetStudentId(student.id)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-[12px] font-semibold text-gray-600 active:bg-gray-50"
                >
                  {checkedOut ? 'Chinh sua' : 'Chi tiet'}
                </button>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">Khong co hoc sinh</p>
        )}
      </div>

      {/* Bottom sheet */}
      <BottomSheet
        open={!!sheetStudentId}
        onClose={() => setSheetStudentId(null)}
        title={sheetStudent ? sheetStudent.name : ''}
      >
        {sheetStudent && (
          <div className="p-4 pb-8 space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <Avatar name={sheetStudent.name} size={44} />
              <div>
                <p className="text-sm font-semibold text-black">{sheetStudent.name}</p>
                <p className="text-xs text-gray-500">{sheetStudent.studentCode}</p>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-500">Ghi chu (khong bat buoc)</p>
              <textarea
                value={sheetNote}
                onChange={(e) => setSheetNote(e.target.value)}
                rows={2}
                placeholder="Them ghi chu..."
                className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-black placeholder-gray-400 outline-none focus:border-gray-400"
              />
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 active:bg-gray-50">
              <Camera size={16} />
              Chup hinh hoc sinh (tuy chon)
            </button>
            <button
              onClick={() => setSheetStudentId(null)}
              className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white active:opacity-80"
            >
              Luu
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}

// ─── Absence Request Screen ────────────────────────────────────────────────

function AbsenceRequestScreen({
  requests,
  students,
  onApprove,
  onReject,
  onApproveAll,
  onViewDetail,
}: {
  requests: AbsenceRequest[]
  students: Student[]
  onApprove: (id: string, studentId: string) => void
  onReject: (id: string) => void
  onApproveAll: () => void
  onViewDetail: (id: string) => void
}) {
  const [dateMode, setDateMode] = useState<'today' | 'range'>('today')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const studentMap = Object.fromEntries(students.map((s) => [s.id, s]))
  const pendingRequests = requests.filter((r) => r.requestStatus === 'chờ-duyệt')

  return (
    <div className="relative flex flex-col bg-gray-50">
      {/* Date filter bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
        <button
          onClick={() => setDateMode('today')}
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            dateMode === 'today' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-600'
          }`}
        >
          Hom nay
        </button>
        <button
          onClick={() => { setDateMode('range'); setShowDatePicker(true) }}
          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
            dateMode === 'range' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-600'
          }`}
        >
          <Calendar size={12} />
          Chon ngay
          <ChevronDown size={12} />
        </button>
        {pendingRequests.length > 0 && (
          <button
            onClick={onApproveAll}
            className="ml-auto rounded-full border border-gray-900 px-3 py-1 text-xs font-bold text-gray-900 active:bg-gray-100"
          >
            Duyet tat ca ({pendingRequests.length})
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2 p-3 pb-6">
        {requests.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">Khong co don bao vang</p>
        )}
        {requests.map((req) => {
          const student = studentMap[req.studentId]
          const isPending = req.requestStatus === 'chờ-duyệt'

          return (
            <button
              key={req.id}
              onClick={() => onViewDetail(req.id)}
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-left active:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <Avatar name={student?.name || ''} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-black">{student?.name}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isPending ? 'bg-gray-200 text-gray-700' :
                      req.requestStatus === 'đã-duyệt' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isPending ? 'Cho duyet' : req.requestStatus === 'đã-duyệt' ? 'Da duyet' : 'Da huy'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-600">{req.reason}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Ngay: {req.date} • {new Date(req.requestedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <ChevronRight size={16} className="mt-0.5 shrink-0 text-gray-400" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Date picker bottom sheet (simplified) */}
      <BottomSheet
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="Chon ngay"
      >
        <div className="p-4 pb-8 space-y-3">
          <p className="text-sm text-gray-600">Chon 1 ngay cu the:</p>
          {['23/06/2026', '24/06/2026', '25/06/2026', '26/06/2026', '27/06/2026', TODAY_STR].map((d) => (
            <button
              key={d}
              onClick={() => { setShowDatePicker(false); setDateMode('range') }}
              className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium ${
                d === TODAY_STR ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-black active:bg-gray-50'
              }`}
            >
              {d === TODAY_STR ? `${d} (Hom nay)` : d}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}

// ─── Absence Detail Screen ────────────────────────────────────────────────

function AbsenceDetailScreen({
  request,
  student,
  onApprove,
  onReject,
}: {
  request: AbsenceRequest
  student: Student
  onApprove: (id: string, studentId: string) => void
  onReject: (id: string) => void
}) {
  if (!request || !student) return null
  const isPending = request.requestStatus === 'chờ-duyệt'

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Student card */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <Avatar name={student.name} size={48} />
        <div>
          <p className="text-base font-bold text-black">{student.name}</p>
          <p className="text-xs text-gray-500">{student.studentCode}</p>
        </div>
      </div>

      {/* Request info */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Chi tiet don</p>
        {[
          { label: 'Ngay vang', value: request.date },
          { label: 'Ly do', value: request.reason },
          { label: 'Thoi gian gui', value: new Date(request.requestedAt).toLocaleString('vi-VN') },
          { label: 'Trang thai', value: isPending ? 'Cho duyet' : request.requestStatus === 'đã-duyệt' ? 'Da duyet' : 'Da huy' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-semibold text-black text-right">{value}</span>
          </div>
        ))}
      </div>

      {isPending && (
        <div className="flex gap-3">
          <button
            onClick={() => onReject(request.id)}
            className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-bold text-gray-700 active:bg-gray-50"
          >
            Tu choi
          </button>
          <button
            onClick={() => onApprove(request.id, request.studentId)}
            className="flex-1 rounded-xl bg-black py-3 text-sm font-bold text-white active:opacity-80"
          >
            Duyet don
          </button>
        </div>
      )}

      {!isPending && (
        <div className={`rounded-xl p-3 text-center text-sm font-semibold ${
          request.requestStatus === 'đã-duyệt' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {request.requestStatus === 'đã-duyệt' ? 'Don da duoc duyet' : 'Don da bi huy'}
        </div>
      )}
    </div>
  )
}
