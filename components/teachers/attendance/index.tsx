'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, CheckCircle2, XCircle } from 'lucide-react'
import {
  MOCK_ATTENDANCE_TODAY,
  MOCK_CHECKOUT_TODAY,
  MOCK_ABSENCE_REQUESTS_TODAY,
  TODAY_STR,
  generateStudentsForClass,
  generateAttendanceRecords,
  generateAbsenceRequests,
  type AttendanceStatus,
  type CheckoutStatus,
} from '@/lib/mock-data'

type ScreenType = 'overview' | 'check-in' | 'check-out' | 'absence-requests'

interface AttendanceAppProps {
  onBack: () => void
}

export function AttendanceApp({ onBack }: AttendanceAppProps) {
  const [screen, setScreen] = useState<ScreenType>('overview')
  const [selectedDate, setSelectedDate] = useState(TODAY_STR)
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE_TODAY)
  const [checkout, setCheckout] = useState(MOCK_CHECKOUT_TODAY)
  const [absenceRequests, setAbsenceRequests] = useState(MOCK_ABSENCE_REQUESTS_TODAY)

  const students = generateStudentsForClass('class-7')
  const checkInCount = Object.values(attendance).filter(
    (a) => a.status === 'đúng-giờ' || a.status === 'đi-trễ'
  ).length
  const checkOutCount = Object.values(checkout).filter((c) => c.status).length
  const pendingRequests = absenceRequests.filter((r) => r.requestStatus === 'chờ-duyệt').length

  const handleCheckIn = (studentId: string, time: string, status: AttendanceStatus, note?: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        checkInTime: time,
        status,
        note,
      },
    }))
  }

  const handleCheckOut = (studentId: string, time: string, status: CheckoutStatus) => {
    setCheckout((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        checkOutTime: time,
        status,
      },
    }))
  }

  const handleApproveAbsence = (requestId: string, studentId: string) => {
    setAbsenceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, requestStatus: 'đã-duyệt' as const } : r))
    )
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status: 'vắng-có-phép' as const },
    }))
  }

  const handleRejectAbsence = (requestId: string) => {
    setAbsenceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, requestStatus: 'đã-hủy' as const } : r))
    )
  }

  return (
    <div className="flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4">
        <button onClick={onBack} className="p-1 text-gray-600 hover:text-black">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-black">Điểm danh</h1>
          <p className="text-xs text-gray-600">Lớp 6A2 • {selectedDate}</p>
        </div>
      </div>

      {/* Screen content */}
      <div className="flex-1 overflow-y-auto">
        {screen === 'overview' && (
          <OverviewScreen
            checkInCount={checkInCount}
            students={students}
            attendance={attendance}
            checkOutCount={checkOutCount}
            checkout={checkout}
            pendingRequests={pendingRequests}
            absenceRequests={absenceRequests}
            onCheckInClick={() => setScreen('check-in')}
            onCheckOutClick={() => setScreen('check-out')}
            onAbsenceClick={() => setScreen('absence-requests')}
          />
        )}
        {screen === 'check-in' && (
          <CheckInScreen
            students={students}
            attendance={attendance}
            onCheckIn={handleCheckIn}
            onBack={() => setScreen('overview')}
          />
        )}
        {screen === 'check-out' && (
          <CheckOutScreen
            students={students}
            attendance={attendance}
            checkout={checkout}
            onCheckOut={handleCheckOut}
            onBack={() => setScreen('overview')}
          />
        )}
        {screen === 'absence-requests' && (
          <AbsenceRequestScreen
            requests={absenceRequests}
            students={students}
            onApprove={handleApproveAbsence}
            onReject={handleRejectAbsence}
            onBack={() => setScreen('overview')}
          />
        )}
      </div>
    </div>
  )
}

// ─── Overview Screen ───────────────────────────────────────────────────────

interface OverviewScreenProps {
  checkInCount: number
  students: any[]
  attendance: any
  checkOutCount: number
  checkout: any
  pendingRequests: number
  absenceRequests: any[]
  onCheckInClick: () => void
  onCheckOutClick: () => void
  onAbsenceClick: () => void
}

function OverviewScreen({
  checkInCount,
  students,
  attendance,
  checkOutCount,
  checkout,
  pendingRequests,
  absenceRequests,
  onCheckInClick,
  onCheckOutClick,
  onAbsenceClick,
}: OverviewScreenProps) {
  const stats = {
    present: Object.values(attendance).filter((a: any) => a.status === 'đúng-giờ' || a.status === 'đi-trễ').length,
    absent: Object.values(attendance).filter((a: any) => a.status === 'vắng-có-phép' || a.status === 'vắng-không-phép').length,
    unmarked: Object.values(attendance).filter((a: any) => a.status === 'chưa-điểm-danh').length,
  }

  return (
    <div className="space-y-3 p-4">
      {/* Check-in card */}
      <button
        onClick={onCheckInClick}
        className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors active:bg-gray-50"
      >
        <p className="text-xs font-semibold text-gray-600">Đã đón</p>
        <p className="mt-1 text-2xl font-bold text-black">
          {checkInCount}/{students.length}
        </p>
      </button>

      {/* Check-out card */}
      <button
        onClick={onCheckOutClick}
        className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors active:bg-gray-50"
      >
        <p className="text-xs font-semibold text-gray-600">Đã trả</p>
        <p className="mt-1 text-2xl font-bold text-black">
          {checkOutCount}/{students.length}
        </p>
      </button>

      {/* Status breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="mb-3 text-xs font-semibold text-gray-600">Trạng thái học sinh</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-black">Có mặt</span>
            <span className="font-semibold text-black">{stats.present}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-black">Vắng</span>
            <span className="font-semibold text-black">{stats.absent}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-black">Chưa điểm danh</span>
            <span className="font-semibold text-black">{stats.unmarked}</span>
          </div>
        </div>
      </div>

      {/* Absence requests card */}
      <button
        onClick={onAbsenceClick}
        className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-colors active:bg-gray-50"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600">Đơn báo vắng</p>
            <p className="mt-1 text-lg font-bold text-black">{absenceRequests?.length || 0}</p>
          </div>
          {pendingRequests > 0 && (
            <div className="rounded-lg bg-gray-100 px-2.5 py-1">
              <p className="text-xs font-semibold text-black">Chờ duyệt: {pendingRequests}</p>
            </div>
          )}
        </div>
      </button>

      <div className="h-4" />
    </div>
  )
}

// ─── Check-in Screen ───────────────────────────────────────────────────────

interface CheckInScreenProps {
  students: any[]
  attendance: any
  onCheckIn: (studentId: string, time: string, status: AttendanceStatus, note?: string) => void
  onBack: () => void
}

function CheckInScreen({ students, attendance, onCheckIn, onBack }: CheckInScreenProps) {
  return (
    <div className="space-y-2 p-4">
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black"
      >
        <ChevronLeft size={18} /> Quay lại
      </button>

      {students.map((student) => {
        const record = attendance[student.id]
        const isCheckedIn = record.status === 'đúng-giờ' || record.status === 'đi-trễ'

        return (
          <div
            key={student.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-black">{student.name}</p>
              <p className="text-xs text-gray-600">{student.studentCode}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-black">
                {record.status === 'đúng-giờ'
                  ? '✓ Đúng giờ'
                  : record.status === 'đi-trễ'
                    ? '⏱ Đi trễ'
                    : record.status === 'vắng-có-phép'
                      ? 'Vắng có phép'
                      : record.status === 'vắng-không-phép'
                        ? 'Vắng không phép'
                        : 'Chưa điểm danh'}
              </p>
              {record.checkInTime && <p className="text-xs text-gray-600">{record.checkInTime}</p>}
            </div>
          </div>
        )
      })}

      <div className="h-4" />
    </div>
  )
}

// ─── Check-out Screen ───────────────────────────────────────────────────────

interface CheckOutScreenProps {
  students: any[]
  attendance: any
  checkout: any
  onCheckOut: (studentId: string, time: string, status: CheckoutStatus) => void
  onBack: () => void
}

function CheckOutScreen({ students, attendance, checkout, onCheckOut, onBack }: CheckOutScreenProps) {
  const checkedInStudents = students.filter(
    (s) =>
      attendance[s.id].status === 'đúng-giờ' ||
      attendance[s.id].status === 'đi-trễ'
  )

  return (
    <div className="space-y-2 p-4">
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black"
      >
        <ChevronLeft size={18} /> Quay lại
      </button>

      {checkedInStudents.map((student) => {
        const record = checkout[student.id]

        return (
          <div
            key={student.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-black">{student.name}</p>
              <p className="text-xs text-gray-600">Đến: {attendance[student.id].checkInTime || '—'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-black">
                {record?.status === 'về-đúng-giờ'
                  ? '✓ Về đúng giờ'
                  : record?.status === 'về-muộn'
                    ? '⏱ Về muộn'
                    : 'Chưa trả'}
              </p>
              {record?.checkOutTime && <p className="text-xs text-gray-600">{record.checkOutTime}</p>}
            </div>
          </div>
        )
      })}

      <div className="h-4" />
    </div>
  )
}

// ─── Absence Request Screen ─────────────────────────────────────────────

interface AbsenceRequestScreenProps {
  requests: any[]
  students: any[]
  onApprove: (requestId: string, studentId: string) => void
  onReject: (requestId: string) => void
  onBack: () => void
}

function AbsenceRequestScreen({
  requests,
  students,
  onApprove,
  onReject,
  onBack,
}: AbsenceRequestScreenProps) {
  const studentMap = Object.fromEntries(students.map((s) => [s.id, s]))

  return (
    <div className="space-y-3 p-4">
      <button
        onClick={onBack}
        className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black"
      >
        <ChevronLeft size={18} /> Quay lại
      </button>

      {requests.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-600">Không có đơn báo vắng</p>
      ) : (
        requests.map((req) => {
          const student = studentMap[req.studentId]
          const isPending = req.requestStatus === 'chờ-duyệt'

          return (
            <div
              key={req.id}
              className="rounded-lg border border-gray-200 bg-white p-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">{student.name}</p>
                  <p className="mt-1 text-xs text-gray-600">{req.reason}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Ngày: {req.date} • Gửi lúc: {new Date(req.requestedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="ml-2 text-right">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                      req.requestStatus === 'chờ-duyệt'
                        ? 'bg-yellow-100 text-yellow-700'
                        : req.requestStatus === 'đã-duyệt'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {req.requestStatus === 'chờ-duyệt'
                      ? 'Chờ duyệt'
                      : req.requestStatus === 'đã-duyệt'
                        ? 'Đã duyệt'
                        : 'Đã hủy'}
                  </span>
                </div>
              </div>

              {isPending && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onApprove(req.id, req.studentId)}
                    className="flex-1 rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700 transition-colors active:bg-green-200"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => onReject(req.id)}
                    className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors active:bg-gray-200"
                  >
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          )
        })
      )}

      <div className="h-4" />
    </div>
  )
}
