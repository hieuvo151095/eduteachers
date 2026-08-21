'use client'

import { useState } from 'react'
import { Check, ChevronRight, History, Lock } from 'lucide-react'
import {
  PHIEU_GHI_CHU_MAX_LENGTH,
  PHIEU_THANG_DEFAULT_ID,
  PHIEU_THANG_OPTIONS,
  PHIEU_TUAN_DEFAULT_ID,
  PHIEU_TUAN_OPTIONS,
  type DiemDanhStudent,
  type PhieuBeNgoan,
  type PhieuChuKyLoai,
  type PhieuChuKyOption,
  type PhieuHocSinhKetQua,
} from '@/lib/mock-data'
import { AppHeader, classSubtitle } from '@/components/teachers/shared/header'
import type { ClassInfo } from '@/lib/mock-data'
import { ChuKyPickerSheet } from './chu-ky-picker-sheet'

interface RowState {
  dat: boolean
  nhanXet: string
  noteOpen: boolean
}

function buildInitialRows(students: DiemDanhStudent[], existing?: PhieuBeNgoan): Record<string, RowState> {
  const rows: Record<string, RowState> = {}
  students.forEach((s) => {
    const existingRow = existing?.ketQua.find((k) => k.studentId === s.id)
    const nhanXet = existingRow?.nhanXet ?? ''
    rows[s.id] = {
      dat: existingRow?.dat ?? true,
      nhanXet,
      noteOpen: nhanXet.length > 0,
    }
  })
  return rows
}

interface PhatPhieuScreenProps {
  selectedClass: ClassInfo
  students: DiemDanhStudent[]
  existingPhieu?: PhieuBeNgoan
  /** Chỉ phiếu gần nhất mới được sửa/gửi lại — các phiếu cũ hơn mở ở chế độ chỉ xem. */
  readOnly?: boolean
  onBack: () => void
  onChangeClass: () => void
  onOpenLichSu: () => void
  onSave: () => void
  onSend: (result: Omit<PhieuBeNgoan, 'id' | 'sentAt'>) => void
}

function StudentAvatar({ student }: { student: DiemDanhStudent }) {
  if (student.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={student.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
  }
  const initial = student.name.trim().split(' ').pop()?.[0] ?? '?'
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
      {initial}
    </div>
  )
}

export function PhatPhieuScreen({
  selectedClass,
  students,
  existingPhieu,
  readOnly = false,
  onBack,
  onChangeClass,
  onOpenLichSu,
  onSave,
  onSend,
}: PhatPhieuScreenProps) {
  const [chuKyLoai, setChuKyLoai] = useState<PhieuChuKyLoai>(existingPhieu?.chuKyLoai ?? 'tuan')
  const [chuKyId, setChuKyId] = useState(
    existingPhieu?.chuKyId ?? (chuKyLoai === 'tuan' ? PHIEU_TUAN_DEFAULT_ID : PHIEU_THANG_DEFAULT_ID)
  )
  const [rows, setRows] = useState<Record<string, RowState>>(() => buildInitialRows(students, existingPhieu))
  const [showTuanPicker, setShowTuanPicker] = useState(false)
  const [showThangPicker, setShowThangPicker] = useState(false)

  const options = chuKyLoai === 'tuan' ? PHIEU_TUAN_OPTIONS : PHIEU_THANG_OPTIONS
  const selectedOption = options.find((o) => o.id === chuKyId) ?? options[0]

  const allChecked = students.every((s) => rows[s.id]?.dat)
  const datCount = students.filter((s) => rows[s.id]?.dat).length

  const handleToggleChuKyLoai = (loai: PhieuChuKyLoai) => {
    setChuKyLoai(loai)
    setChuKyId(loai === 'tuan' ? PHIEU_TUAN_DEFAULT_ID : PHIEU_THANG_DEFAULT_ID)
  }

  const handleSelectChuKy = (option: PhieuChuKyOption) => {
    setChuKyId(option.id)
    setShowTuanPicker(false)
    setShowThangPicker(false)
  }

  const handleToggleAll = () => {
    const next = !allChecked
    setRows((prev) => {
      const updated = { ...prev }
      students.forEach((s) => {
        updated[s.id] = { ...updated[s.id], dat: next }
      })
      return updated
    })
  }

  const handleToggleStudent = (studentId: string) => {
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], dat: !prev[studentId].dat } }))
  }

  const handleToggleNote = (studentId: string) => {
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], noteOpen: !prev[studentId].noteOpen } }))
  }

  const handleNoteChange = (studentId: string, value: string) => {
    if (value.length > PHIEU_GHI_CHU_MAX_LENGTH) return
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], nhanXet: value } }))
  }

  // Sao chép nhận xét của 1 học sinh sang tất cả học sinh đang "Đạt" khác —
  // học sinh không đạt không có ô nhận xét nên bỏ qua.
  const handleApplyToAll = (sourceStudentId: string) => {
    const text = rows[sourceStudentId]?.nhanXet ?? ''
    if (!text.trim()) return
    setRows((prev) => {
      const updated = { ...prev }
      students.forEach((s) => {
        if (updated[s.id]?.dat) {
          updated[s.id] = { ...updated[s.id], nhanXet: text }
        }
      })
      return updated
    })
  }

  const buildKetQua = (): PhieuHocSinhKetQua[] =>
    students.map((s) => {
      const row = rows[s.id]
      return {
        studentId: s.id,
        dat: row.dat,
        nhanXet: row.dat && row.nhanXet.trim() ? row.nhanXet.trim() : undefined,
      }
    })

  const handleSend = () => {
    onSend({
      chuKyLoai,
      chuKyId,
      chuKyLabel: selectedOption.label,
      ketQua: buildKetQua(),
    })
  }

  return (
    <div className="flex flex-col bg-white">
      <AppHeader
        title="Phiếu bé ngoan"
        subtitle={classSubtitle(selectedClass)}
        onBack={onBack}
        onChangeClass={onChangeClass}
      />

      <button
        onClick={onOpenLichSu}
        className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-left active:bg-gray-50"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-blue-600">
          <History size={16} />
          Lịch sử phát phiếu
        </span>
        <ChevronRight size={16} className="shrink-0 text-gray-400" />
      </button>

      {readOnly && (
        <div className="flex items-center gap-2 border-b border-gray-100 bg-amber-50 px-4 py-2.5">
          <Lock size={14} className="shrink-0 text-amber-600" />
          <p className="text-xs text-amber-700">Phiếu đã gửi trước đó — chỉ xem, không thể chỉnh sửa.</p>
        </div>
      )}

      {/* I. Chọn chu kỳ */}
      <div className={`border-b border-gray-100 px-4 py-3 ${readOnly ? 'pointer-events-none opacity-60' : ''}`}>
        <div className="mb-2 flex gap-2">
          {(['tuan', 'thang'] as PhieuChuKyLoai[]).map((loai) => (
            <button
              key={loai}
              onClick={() => handleToggleChuKyLoai(loai)}
              className={`flex-1 rounded-full px-3 py-1.5 text-sm font-semibold ${
                chuKyLoai === loai ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600'
              }`}
            >
              {loai === 'tuan' ? 'Tuần' : 'Tháng'}
            </button>
          ))}
        </div>
        <button
          onClick={() => (chuKyLoai === 'tuan' ? setShowTuanPicker(true) : setShowThangPicker(true))}
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 text-left active:bg-gray-50"
        >
          <span className="flex items-center gap-2 text-sm text-black">
            <span className="text-base">📔</span>
            {chuKyLoai === 'tuan' ? 'Tuần' : 'Tháng'}: {selectedOption.label}
          </span>
          <ChevronRight size={16} className="shrink-0 text-gray-400" />
        </button>
      </div>

      {/* II. Danh sách học sinh */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-sm text-gray-600">
          Sĩ số: <span className="font-bold text-black">{students.length}</span>
          {datCount < students.length && (
            <span className="ml-1 text-gray-400">
              (Đạt: {datCount}/{students.length})
            </span>
          )}
        </span>
        {!readOnly && (
          <button onClick={handleToggleAll} className="flex items-center gap-1.5 text-sm font-medium text-black">
            Chọn tất cả
            <span
              className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                allChecked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
              }`}
            >
              {allChecked && <Check size={13} strokeWidth={3} className="text-white" />}
            </span>
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {students.map((student) => {
          const row = rows[student.id]
          if (!row) return null
          const hasNote = row.nhanXet.trim().length > 0
          return (
            <div key={student.id} className="px-4 py-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={readOnly ? undefined : () => handleToggleStudent(student.id)}
                  className={`mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                    row.dat ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                  } ${readOnly ? 'cursor-default' : ''}`}
                >
                  {row.dat && <Check size={13} strokeWidth={3} className="text-white" />}
                </button>
                <StudentAvatar student={student} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-black">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.studentCode}</p>

                  {readOnly ? (
                    row.dat &&
                    hasNote && (
                      <p className="mt-1.5 text-xs italic text-gray-600">&ldquo;{row.nhanXet}&rdquo;</p>
                    )
                  ) : (
                    <>
                      {row.dat && !row.noteOpen && (
                        <button
                          onClick={() => handleToggleNote(student.id)}
                          className="mt-1.5 text-left text-xs"
                        >
                          {hasNote ? (
                            <span className="italic text-gray-600">&ldquo;{row.nhanXet}&rdquo;</span>
                          ) : (
                            <span className="font-semibold text-blue-600">+ Thêm nhận xét (optional)</span>
                          )}
                        </button>
                      )}

                      {row.dat && row.noteOpen && (
                        <div className="mt-2">
                          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                            <textarea
                              value={row.nhanXet}
                              onChange={(e) => handleNoteChange(student.id, e.target.value)}
                              placeholder="Nhập nhận xét (không bắt buộc)"
                              rows={2}
                              className="w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
                            />
                            <p className="text-right text-[10px] text-gray-400">
                              {row.nhanXet.length}/{PHIEU_GHI_CHU_MAX_LENGTH}
                            </p>
                          </div>
                          <div className="mt-1.5 flex items-center gap-3">
                            <button
                              onClick={() => handleToggleNote(student.id)}
                              className="text-xs font-semibold text-gray-500"
                            >
                              Ẩn nhận xét
                            </button>
                            <button
                              onClick={() => handleApplyToAll(student.id)}
                              disabled={!hasNote}
                              className={`text-xs font-semibold ${
                                hasNote ? 'text-blue-600' : 'cursor-not-allowed text-gray-300'
                              }`}
                            >
                              Áp dụng cho tất cả học sinh
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Spacer so the fixed action bar never covers the last roster row */}
      {!readOnly && <div className="h-24" />}

      {!readOnly && (
        <div className="fixed inset-x-0 bottom-0 z-40 space-y-2 border-t border-gray-100 bg-white px-4 py-3">
          <button
            onClick={onSave}
            className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-black active:bg-gray-50"
          >
            Lưu
          </button>
          <button
            onClick={handleSend}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white active:bg-blue-700"
          >
            {existingPhieu ? 'Gửi lại' : 'Gửi thông báo'}
          </button>
        </div>
      )}

      {showTuanPicker && (
        <ChuKyPickerSheet
          title="Chọn tuần"
          options={PHIEU_TUAN_OPTIONS}
          selectedId={chuKyId}
          onSelect={handleSelectChuKy}
          onClose={() => setShowTuanPicker(false)}
        />
      )}
      {showThangPicker && (
        <ChuKyPickerSheet
          title="Chọn tháng"
          options={PHIEU_THANG_OPTIONS}
          selectedId={chuKyId}
          onSelect={handleSelectChuKy}
          onClose={() => setShowThangPicker(false)}
        />
      )}
    </div>
  )
}
