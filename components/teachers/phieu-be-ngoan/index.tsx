'use client'

import { useState } from 'react'
import {
  DIEM_DANH_CLASSES,
  DIEM_DANH_STUDENTS,
  PHIEU_BE_NGOAN_RECORDS,
  PHIEU_TUAN_DEFAULT_ID,
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
  // Tuần chọn sẵn khi vào màn Phát phiếu mới qua "Phát bù ngay" — chỉ áp
  // dụng cho lần vào màn kế tiếp, không "dính" lại cho các lần tạo mới sau.
  const [phatBuChuKyId, setPhatBuChuKyId] = useState<string | undefined>(undefined)
  // Bumped after every mutation to PHIEU_BE_NGOAN_RECORDS so React re-renders
  // and re-reads the module-level array (mutated in place, no state of its own).
  const [, setRecordsVersion] = useState(0)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const showToast = (message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const records = PHIEU_BE_NGOAN_RECORDS.filter((r) => r.classId === selectedClass.id).sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  )

  // 1 tuần có thể gửi theo nhiều đợt — nếu lớp đã có phiếu cho đúng tuần này
  // rồi thì gộp (upsert) vào bản ghi đó thay vì tạo phiếu trùng cho cùng 1 tuần.
  const handleSend = (result: Omit<PhieuBeNgoan, 'id' | 'sentAt' | 'classId'>) => {
    const sentAt = new Date().toISOString()
    const idx = PHIEU_BE_NGOAN_RECORDS.findIndex(
      (r) => r.classId === selectedClass.id && r.chuKyId === result.chuKyId
    )
    if (idx !== -1) {
      PHIEU_BE_NGOAN_RECORDS[idx] = { ...PHIEU_BE_NGOAN_RECORDS[idx], ...result, sentAt }
    } else {
      PHIEU_BE_NGOAN_RECORDS.unshift({ id: `phieu-${Date.now()}`, classId: selectedClass.id, sentAt, ...result })
    }
    showToast('Đã gửi thông báo tới phụ huynh')
    setRecordsVersion((v) => v + 1)
    setEditingPhieu(undefined)
    setPhatBuChuKyId(undefined)
    setScreen('lich-su')
  }

  const handlePhatBuNgay = (chuKyId: string) => {
    setEditingPhieu(undefined)
    setPhatBuChuKyId(chuKyId)
    setScreen('phat-phieu')
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-white">
      {screen === 'phat-phieu' && (
        <PhatPhieuScreen
          selectedClass={selectedClass}
          students={DIEM_DANH_STUDENTS}
          records={records}
          existingPhieu={editingPhieu}
          initialChuKyId={phatBuChuKyId}
          onBack={() => {
            setPhatBuChuKyId(undefined)
            setScreen('lich-su')
          }}
          onChangeClass={() => setShowClassPicker(true)}
          onSend={handleSend}
          onOpenExistingRecord={(record) => setEditingPhieu(record)}
          onPhatBuNgay={handlePhatBuNgay}
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
            // Tuần mặc định (hiện tại) có thể đã được phát (1 phần hoặc đủ)
            // rồi — nếu vậy mở thẳng phiếu đó thay vì 1 form trống, tránh
            // tạo phiếu trùng cho cùng 1 tuần.
            const alreadySent = records.find((r) => r.chuKyId === PHIEU_TUAN_DEFAULT_ID)
            setEditingPhieu(alreadySent)
            setPhatBuChuKyId(undefined)
            setScreen('phat-phieu')
          }}
          onOpenRecord={(record) => {
            setEditingPhieu(record)
            setScreen('phat-phieu')
          }}
          onPhatBuNgay={handlePhatBuNgay}
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
