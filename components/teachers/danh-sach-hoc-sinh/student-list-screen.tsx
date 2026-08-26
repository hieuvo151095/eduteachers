'use client'

import { useMemo, useState } from 'react'
import { ChevronRight, IdCard, Search, User } from 'lucide-react'
import type { ClassInfo, HocSinhProfile } from '@/lib/mock-data'
import { AppHeader, classSubtitle } from '@/components/teachers/shared/header'

interface StudentListScreenProps {
  selectedClass: ClassInfo
  students: HocSinhProfile[]
  onBack: () => void
  onChangeClass: () => void
  onOpenStudent: (student: HocSinhProfile) => void
}

function StudentAvatar({ student }: { student: HocSinhProfile }) {
  if (student.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={student.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
  }
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
      <User size={22} />
    </div>
  )
}

export function StudentListScreen({
  selectedClass,
  students,
  onBack,
  onChangeClass,
  onOpenStudent,
}: StudentListScreenProps) {
  const [query, setQuery] = useState('')

  const namCount = students.filter((s) => s.gender === 'Nam').length
  const nuCount = students.filter((s) => s.gender === 'Nữ').length

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) => s.name.toLowerCase().includes(q))
  }, [students, query])

  return (
    <div className="flex flex-col bg-white">
      <AppHeader
        title="Danh sách học sinh"
        subtitle={classSubtitle(selectedClass)}
        onBack={onBack}
        onChangeClass={onChangeClass}
      />

      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        <div className="rounded-lg border-2 border-amber-400 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
          Sĩ số: {students.length}
        </div>
        <div className="flex items-center gap-1 rounded-full border border-sky-300 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
          Nam: {namCount}
        </div>
        <div className="flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
          Nữ: {nuCount}
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5">
          <Search size={16} className="shrink-0 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập tên học sinh"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-400">Chưa có học sinh nào trong lớp này.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-400">Không tìm thấy học sinh phù hợp.</p>
        </div>
      ) : (
        <div className="space-y-2.5 px-4 pb-6">
          {filtered.map((student) => (
            <button
              key={student.id}
              onClick={() => onOpenStudent(student)}
              className={`flex w-full items-center gap-3 rounded-xl border-l-4 bg-white py-3 pl-3 pr-3 text-left shadow-sm ring-1 ring-gray-100 active:bg-gray-50 ${
                student.gender === 'Nam' ? 'border-l-sky-400' : 'border-l-red-400'
              }`}
            >
              <StudentAvatar student={student} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-black">{student.name}</p>
                <p className="text-xs text-gray-500">{student.dob}</p>
                <p className="flex items-center gap-1 text-xs text-gray-500">
                  <IdCard size={12} />
                  {student.studentCode}
                </p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
