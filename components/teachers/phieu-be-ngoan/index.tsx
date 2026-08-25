'use client'

import { useState } from 'react'
import {
  DIEM_DANH_CLASSES,
  DIEM_DANH_STUDENTS,
  PHIEU_BE_NGOAN_RECORDS,
  type ClassInfo,
  type PhieuBeNgoan,
} from '@/lib/mock-data'
import { ClassPickerSheet } from '@/components/teachers/attendance/class-picker-sheet'
import { PhatPhieuScreen } from './phat-phieu-screen'
import { LichSuScreen } from './lich-su-screen'

interface PhieuBeNgoanAppProps {
  onBack: () => void
}

type InternalScreen = 'phat-phieu' | 'lich-su'

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-4 py-2 shadow-lg transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <span className="whitespace-nowrap text-xs font-semibold text-white">{message}</span>
    </div>
  )
}

export function PhieuBeNgoanApp({ onBack }: PhieuBeNgoanAppProps) {
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(DIEM_DANH_CLASSES[0])
  const [showClassPicker, setShowClassPicker] = useState(false)
  const [screen, setScreen] = useState<InternalScreen>('lich-su')
  const [editingPhieu, setEditingPhieu] = useState<PhieuBeNgoan | undefined>(undefined)
  // Bumped after every mutation to PHIEU_BE_NGOAN_RECORDS so React re-renders
  // and re-reads the module-level array (mutated in place, no state of its own).
  const [, setRecordsVersion] = useState(0)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const showToast = (message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const records = [...PHIEU_BE_NGOAN_RECORDS].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  )
  const latestRecordId = records[0]?.id
  // Chỉ phiếu gần nhất được sửa/gửi lại; các phiếu cũ hơn mở ở chế độ chỉ xem.
  const isEditingReadOnly = !!editingPhieu && editingPhieu.id !== latestRecordId

  const handleSend = (result: Omit<PhieuBeNgoan, 'id' | 'sentAt'>) => {
    const sentAt = new Date().toISOString()
    if (editingPhieu) {
      const idx = PHIEU_BE_NGOAN_RECORDS.findIndex((r) => r.id === editingPhieu.id)
      if (idx !== -1) {
        PHIEU_BE_NGOAN_RECORDS[idx] = { ...editingPhieu, ...result, sentAt }
      }
      showToast('Đã gửi lại thông báo tới phụ huynh')
    } else {
      PHIEU_BE_NGOAN_RECORDS.unshift({ id: `phieu-${Date.now()}`, sentAt, ...result })
      showToast('Đã gửi thông báo tới phụ huynh')
    }
    setRecordsVersion((v) => v + 1)
    setEditingPhieu(undefined)
    setScreen('lich-su')
  }

  return (
    <div className="relative flex min-h-full flex-col bg-white">
      {screen === 'phat-phieu' && (
        <PhatPhieuScreen
          selectedClass={selectedClass}
          students={DIEM_DANH_STUDENTS}
          existingPhieu={editingPhieu}
          readOnly={isEditingReadOnly}
          onBack={() => setScreen('lich-su')}
          onChangeClass={() => setShowClassPicker(true)}
          onSend={handleSend}
        />
      )}

      {screen === 'lich-su' && (
        <LichSuScreen
          selectedClass={selectedClass}
          students={DIEM_DANH_STUDENTS}
          records={records}
          onBack={onBack}
          onChangeClass={() => setShowClassPicker(true)}
          onCreateNew={() => {
            setEditingPhieu(undefined)
            setScreen('phat-phieu')
          }}
          onOpenRecord={(record) => {
            setEditingPhieu(record)
            setScreen('phat-phieu')
          }}
        />
      )}

      {showClassPicker && (
        <ClassPickerSheet
          classes={DIEM_DANH_CLASSES}
          selectedClassId={selectedClass.id}
          onSelect={(cls) => {
            setSelectedClass(cls)
            setShowClassPicker(false)
          }}
          onClose={() => setShowClassPicker(false)}
        />
      )}

      <Toast visible={toast.visible} message={toast.message} />
    </div>
  )
}
