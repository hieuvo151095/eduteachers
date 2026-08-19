'use client'

import { useState } from 'react'
import {
  DIEM_DANH_ABSENCE_REQUESTS,
  DIEM_DANH_CLASSES,
  DIEM_DANH_STUDENTS,
  SCHOOL_CHECK_IN_TIME,
  TODAY_STR,
  createInitialCheckInRecords,
  createInitialCheckOutRecords,
  type CheckInRecord,
  type CheckOutRecord,
  type ClassInfo,
} from '@/lib/mock-data'
import { OverviewScreen } from './overview-screen'
import { StudentListScreen } from './student-list-screen'
import { AbsenceListScreen } from './absence-list-screen'
import { ConfirmScreen, type ConfirmStatus } from './confirm-screen'
import { DatePickerSheet } from './date-picker-sheet'
import { ClassPickerSheet } from './class-picker-sheet'
import type { Session } from './shared'

type ScreenType = 'overview' | 'checkin-list' | 'checkout-list' | 'absence-list' | 'confirm'

interface AttendanceAppProps {
  onBack: () => void
}

function initialCheckInBySession(date: string): Record<Session, Record<string, CheckInRecord>> {
  return { sang: createInitialCheckInRecords(date), chieu: createInitialCheckInRecords(date) }
}

function initialCheckOutBySession(date: string): Record<Session, Record<string, CheckOutRecord>> {
  return { sang: createInitialCheckOutRecords(date), chieu: createInitialCheckOutRecords(date) }
}

export function AttendanceApp({ onBack }: AttendanceAppProps) {
  const [screen, setScreen] = useState<ScreenType>('overview')
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(DIEM_DANH_CLASSES[0])
  const [selectedDate, setSelectedDate] = useState(TODAY_STR)

  // Học sinh cần điểm danh vào + ra riêng cho mỗi buổi (sáng/chiều), nên mọi
  // dữ liệu điểm danh được lưu theo từng buổi độc lập.
  const [session, setSession] = useState<Session>('sang')
  const [checkInBySession, setCheckInBySession] = useState<Record<Session, Record<string, CheckInRecord>>>(() =>
    initialCheckInBySession(TODAY_STR)
  )
  const [checkOutBySession, setCheckOutBySession] = useState<Record<Session, Record<string, CheckOutRecord>>>(() =>
    initialCheckOutBySession(TODAY_STR)
  )
  const [absenceRequests] = useState(DIEM_DANH_ABSENCE_REQUESTS)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showClassPicker, setShowClassPicker] = useState(false)

  const [confirmMode, setConfirmMode] = useState<'don' | 'tra'>('don')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const dateLabel = selectedDate === TODAY_STR ? `Hôm nay, ${selectedDate}` : selectedDate
  const checkInRecords = checkInBySession[session]
  const checkOutRecords = checkOutBySession[session]

  const resetRecordsForDate = (date: string) => {
    setCheckInBySession(initialCheckInBySession(date))
    setCheckOutBySession(initialCheckOutBySession(date))
  }

  const handleDateConfirm = (date: string) => {
    setSelectedDate(date)
    resetRecordsForDate(date)
    setShowDatePicker(false)
  }

  const handleClassSelect = (cls: ClassInfo) => {
    setSelectedClass(cls)
    resetRecordsForDate(selectedDate)
    setSelectedIds([])
    setShowClassPicker(false)
  }

  const handleSessionChange = (next: Session) => {
    setSession(next)
    setSelectedIds([])
  }

  const openCheckInList = () => {
    setSelectedIds([])
    setScreen('checkin-list')
  }
  const openCheckOutList = () => {
    setSelectedIds([])
    setScreen('checkout-list')
  }
  const openAbsenceList = () => setScreen('absence-list')

  const proceedToConfirm = (mode: 'don' | 'tra') => {
    setConfirmMode(mode)
    setScreen('confirm')
  }

  const handleEditFromConfirm = () => {
    setScreen(confirmMode === 'don' ? 'checkin-list' : 'checkout-list')
  }

  // Open Question #5: "Có mặt" auto-derives "Đến muộn" when the check-in time
  // is later than SCHOOL_CHECK_IN_TIME (08:00) — the confirm screen always
  // starts on "Có mặt", but the resulting badge reflects the actual time.
  const handleConfirmSubmit = (status: ConfirmStatus, time: string, note: string) => {
    if (confirmMode === 'don') {
      setCheckInBySession((prev) => {
        const next = { ...prev[session] }
        selectedIds.forEach((id) => {
          if (status === 'có-mặt') {
            next[id] = {
              studentId: id,
              date: selectedDate,
              checkInTime: time,
              status: time > SCHOOL_CHECK_IN_TIME ? 'đến-muộn' : 'có-mặt',
              note: note || undefined,
            }
          } else {
            next[id] = { studentId: id, date: selectedDate, status, note: note || undefined }
          }
        })
        return { ...prev, [session]: next }
      })
    } else {
      setCheckOutBySession((prev) => {
        const next = { ...prev[session] }
        selectedIds.forEach((id) => {
          if (status === 'có-mặt') {
            next[id] = { studentId: id, date: selectedDate, checkOutTime: time, status: 'đã-về', note: note || undefined }
          } else {
            next[id] = { studentId: id, date: selectedDate, status, note: note || undefined }
          }
        })
        return { ...prev, [session]: next }
      })
    }
    setSelectedIds([])
    setScreen(confirmMode === 'don' ? 'checkin-list' : 'checkout-list')
  }

  const selectedStudents = DIEM_DANH_STUDENTS.filter((s) => selectedIds.includes(s.id))

  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-gray-50 font-sans">
      {screen === 'overview' && (
        <OverviewScreen
          selectedClass={selectedClass}
          dateLabel={dateLabel}
          session={session}
          onSessionChange={handleSessionChange}
          checkInRecords={checkInRecords}
          checkOutRecords={checkOutRecords}
          absenceRequests={absenceRequests}
          onBack={onBack}
          onChangeClass={() => setShowClassPicker(true)}
          onOpenDatePicker={() => setShowDatePicker(true)}
          onViewCheckIn={openCheckInList}
          onViewCheckOut={openCheckOutList}
          onViewAbsence={openAbsenceList}
        />
      )}

      {(screen === 'checkin-list' || screen === 'checkout-list') && (
        <StudentListScreen
          mode={screen === 'checkin-list' ? 'don' : 'tra'}
          selectedClass={selectedClass}
          dateLabel={dateLabel}
          checkInRecords={checkInRecords}
          checkOutRecords={checkOutRecords}
          selectedIds={selectedIds}
          onToggleSelect={setSelectedIds}
          onBack={() => setScreen('overview')}
          onChangeClass={() => setShowClassPicker(true)}
          onOpenDatePicker={() => setShowDatePicker(true)}
          onProceed={() => proceedToConfirm(screen === 'checkin-list' ? 'don' : 'tra')}
        />
      )}

      {screen === 'absence-list' && (
        <AbsenceListScreen
          selectedClass={selectedClass}
          dateLabel={dateLabel}
          requests={absenceRequests}
          students={DIEM_DANH_STUDENTS}
          onBack={() => setScreen('overview')}
          onChangeClass={() => setShowClassPicker(true)}
          onOpenDatePicker={() => setShowDatePicker(true)}
        />
      )}

      {screen === 'confirm' && (
        <ConfirmScreen students={selectedStudents} onEdit={handleEditFromConfirm} onConfirm={handleConfirmSubmit} />
      )}

      {showDatePicker && (
        <DatePickerSheet
          selectedDate={selectedDate}
          todayStr={TODAY_STR}
          onConfirm={handleDateConfirm}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {showClassPicker && (
        <ClassPickerSheet
          classes={DIEM_DANH_CLASSES}
          selectedClassId={selectedClass.id}
          onSelect={handleClassSelect}
          onClose={() => setShowClassPicker(false)}
        />
      )}
    </div>
  )
}
