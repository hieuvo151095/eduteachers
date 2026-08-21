'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  KET_QUA_HOC_TAP_CLASSES,
  KET_QUA_HOC_TAP_STUDENTS,
  capHocFromGrade,
  getCap1TabData,
  getCap23CaNamData,
  getCap23HocKyData,
  CAP23_TABS,
} from '@/lib/mock-data'
import { AppHeader, classSubtitle } from '@/components/teachers/shared/header'
import { ClassPickerSheet } from '@/components/teachers/attendance/class-picker-sheet'
import { StudentPickerSheet } from './student-picker-sheet'
import { Cap1Screen } from './cap1-screen'
import { Cap23Screen } from './cap23-screen'

interface KetQuaHocTapAppProps {
  onBack: () => void
}

// Ưu tiên chọn học sinh đã có điểm số thật làm mặc định, để vào màn hình là
// thấy ngay dữ liệu mẫu thay vì phải tự mở "Đổi học sinh" mới thấy — học sinh
// còn lại (toàn "—") vẫn chọn được qua picker để xem trạng thái rỗng.
function defaultStudentFor(classId: string): string {
  const inClass = KET_QUA_HOC_TAP_STUDENTS.filter((s) => s.classId === classId)
  return (inClass.find((s) => s.hasScores) ?? inClass[0]).id
}

export function KetQuaHocTapApp({ onBack }: KetQuaHocTapAppProps) {
  const [selectedClassId, setSelectedClassId] = useState(KET_QUA_HOC_TAP_CLASSES[0].id)
  const studentsInClass = KET_QUA_HOC_TAP_STUDENTS.filter((s) => s.classId === selectedClassId)
  const [selectedStudentId, setSelectedStudentId] = useState(() => defaultStudentFor(selectedClassId))
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const [showClassPicker, setShowClassPicker] = useState(false)
  const [showStudentPicker, setShowStudentPicker] = useState(false)

  const selectedClass = KET_QUA_HOC_TAP_CLASSES.find((c) => c.id === selectedClassId) ?? KET_QUA_HOC_TAP_CLASSES[0]
  const selectedStudent =
    KET_QUA_HOC_TAP_STUDENTS.find((s) => s.id === selectedStudentId) ?? studentsInClass[0]
  const capHoc = capHocFromGrade(selectedClass.grade)

  const handleSelectClass = (cls: { id: string }) => {
    setSelectedClassId(cls.id)
    setSelectedStudentId(defaultStudentFor(cls.id))
    setActiveTabIndex(0)
    setShowClassPicker(false)
  }

  const handleSelectStudent = (student: { id: string }) => {
    setSelectedStudentId(student.id)
    setShowStudentPicker(false)
  }

  return (
    <div className="relative flex min-h-full flex-col bg-white">
      <AppHeader
        title="Kết quả học tập"
        subtitle={classSubtitle(selectedClass)}
        onBack={onBack}
        onChangeClass={() => setShowClassPicker(true)}
      />

      {/* Chọn học sinh — lớp có thể có nhiều học sinh, "Kết quả học tập" là dữ
          liệu theo từng em, nên cần thêm 1 tầng chọn bên dưới "Đổi lớp". */}
      <button
        onClick={() => setShowStudentPicker(true)}
        className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-left active:bg-gray-50"
      >
        <span className="flex items-center gap-2 text-sm text-black">
          <span className="text-base">👤</span>
          Học sinh : {selectedStudent.name}
        </span>
        <ChevronRight size={16} className="shrink-0 text-gray-400" />
      </button>

      {/* Row "Năm học" — giữ nguyên theo spec, không đổi */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 text-sm text-black">
        <span className="text-base">📔</span>
        Năm học 2025 - 2026
      </div>

      {capHoc === 1 ? (
        <Cap1Screen
          activeTabIndex={activeTabIndex}
          onSelectTab={setActiveTabIndex}
          data={getCap1TabData(selectedStudent.id, selectedClass.id, activeTabIndex)}
        />
      ) : (
        <Cap23Screen
          activeTabIndex={activeTabIndex}
          onSelectTab={setActiveTabIndex}
          hocKyLabel={CAP23_TABS[activeTabIndex]?.label ?? 'Học kỳ I'}
          hocKyData={
            activeTabIndex !== 2
              ? getCap23HocKyData(selectedStudent.id, selectedClass.id, activeTabIndex as 0 | 1)
              : undefined
          }
          caNamData={activeTabIndex === 2 ? getCap23CaNamData(selectedStudent.id) : undefined}
        />
      )}

      {showClassPicker && (
        <ClassPickerSheet
          classes={KET_QUA_HOC_TAP_CLASSES}
          selectedClassId={selectedClassId}
          onSelect={handleSelectClass}
          onClose={() => setShowClassPicker(false)}
        />
      )}

      {showStudentPicker && (
        <StudentPickerSheet
          students={studentsInClass}
          selectedStudentId={selectedStudentId}
          onSelect={handleSelectStudent}
          onClose={() => setShowStudentPicker(false)}
        />
      )}
    </div>
  )
}
