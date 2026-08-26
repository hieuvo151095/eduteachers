'use client'

import { useState } from 'react'
import { DANH_SACH_HOC_SINH, DIEM_DANH_CLASSES, type ClassInfo, type HocSinhProfile } from '@/lib/mock-data'
import { ClassPickerSheet } from '@/components/teachers/attendance/class-picker-sheet'
import { StudentListScreen } from './student-list-screen'
import { StudentProfileScreen } from './student-profile-screen'

interface DanhSachHocSinhAppProps {
  onBack: () => void
}

type InternalScreen = 'list' | 'profile'

export function DanhSachHocSinhApp({ onBack }: DanhSachHocSinhAppProps) {
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(DIEM_DANH_CLASSES[0])
  const [showClassPicker, setShowClassPicker] = useState(false)
  const [screen, setScreen] = useState<InternalScreen>('list')
  const [selectedStudent, setSelectedStudent] = useState<HocSinhProfile | undefined>(undefined)

  const students = DANH_SACH_HOC_SINH.filter((s) => s.classId === selectedClass.id)

  return (
    <div className="relative flex min-h-full flex-col bg-white">
      {screen === 'list' && (
        <StudentListScreen
          selectedClass={selectedClass}
          students={students}
          onBack={onBack}
          onChangeClass={() => setShowClassPicker(true)}
          onOpenStudent={(student) => {
            setSelectedStudent(student)
            setScreen('profile')
          }}
        />
      )}

      {screen === 'profile' && selectedStudent && (
        <StudentProfileScreen student={selectedStudent} onBack={() => setScreen('list')} />
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
    </div>
  )
}
