'use client'

import { useState } from 'react'
import { MOCK_CLASSES, MOCK_THUC_DON_WEEKS, type ClassInfo, type ThucDonMon } from '@/lib/mock-data'
import { ClassPickerSheet } from '@/components/teachers/attendance/class-picker-sheet'
import { MainScreen } from './main-screen'
import { WeekPickerSheet } from './week-picker-sheet'
import { IngredientSheet } from './ingredient-sheet'
import { ImageViewer } from './image-viewer'

interface ThucDonLopAppProps {
  onBack: () => void
}

export function ThucDonLopApp({ onBack }: ThucDonLopAppProps) {
  // Menu data is shared across all classes (school kitchen cooks one menu for
  // everyone) — "Đổi lớp" only changes the header subtitle, per Phase 2 decision.
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(
    MOCK_CLASSES.find((c) => c.id === 'class-7') ?? MOCK_CLASSES[0]
  )
  const [selectedWeekId, setSelectedWeekId] = useState(MOCK_THUC_DON_WEEKS[0].id)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0) // mặc định Thứ 2

  const [showClassPicker, setShowClassPicker] = useState(false)
  const [showWeekPicker, setShowWeekPicker] = useState(false)
  const [selectedFood, setSelectedFood] = useState<ThucDonMon | null>(null)
  const [showImageViewer, setShowImageViewer] = useState(false)

  const selectedWeek = MOCK_THUC_DON_WEEKS.find((w) => w.id === selectedWeekId) ?? MOCK_THUC_DON_WEEKS[0]
  const selectedDay = selectedWeek.days[selectedDayIndex]

  return (
    <div className="relative flex min-h-full flex-col bg-white">
      <MainScreen
        selectedClass={selectedClass}
        week={selectedWeek}
        day={selectedDay}
        selectedDayIndex={selectedDayIndex}
        onBack={onBack}
        onChangeClass={() => setShowClassPicker(true)}
        onOpenWeekPicker={() => setShowWeekPicker(true)}
        onSelectDay={setSelectedDayIndex}
        onFoodClick={setSelectedFood}
        onOpenAttachment={() => setShowImageViewer(true)}
      />

      {showClassPicker && (
        <ClassPickerSheet
          classes={MOCK_CLASSES}
          selectedClassId={selectedClass.id}
          onSelect={(cls) => {
            setSelectedClass(cls)
            setShowClassPicker(false)
          }}
          onClose={() => setShowClassPicker(false)}
        />
      )}

      {showWeekPicker && (
        <WeekPickerSheet
          weeks={MOCK_THUC_DON_WEEKS}
          selectedWeekId={selectedWeekId}
          onSelect={(week) => {
            setSelectedWeekId(week.id)
            setSelectedDayIndex(0)
            setShowWeekPicker(false)
          }}
          onClose={() => setShowWeekPicker(false)}
        />
      )}

      {selectedFood && <IngredientSheet food={selectedFood} onClose={() => setSelectedFood(null)} />}

      {showImageViewer && <ImageViewer week={selectedWeek} onClose={() => setShowImageViewer(false)} />}
    </div>
  )
}
