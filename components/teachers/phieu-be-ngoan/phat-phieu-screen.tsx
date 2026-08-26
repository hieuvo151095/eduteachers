'use client'

import { useEffect, useState } from 'react'
import { Check, ChevronRight, Lock } from 'lucide-react'
import {
  PHIEU_GHI_CHU_MAX_LENGTH,
  PHIEU_PHAT_BU_LIMIT_WEEKS,
  PHIEU_TUAN_DEFAULT_ID,
  PHIEU_TUAN_OPTIONS,
  computeMissedTuanOptions,
  phieuSentCount,
  phieuWeekOffsetFromId,
  type ClassInfo,
  type DiemDanhStudent,
  type PhieuBeNgoan,
  type PhieuHocSinhKetQua,
} from '@/lib/mock-data'
import { AppHeader, classSubtitle } from '@/components/teachers/shared/header'
import { ChuKyPickerSheet, type ChuKyPickerOption } from './chu-ky-picker-sheet'
import { MissedWeeksBanner } from './missed-weeks-banner'

interface RowState {
  dat: boolean
  nhanXet: string
  noteOpen: boolean
}

type Group = 'sent' | 'unsent'
type TabKey = 'all' | Group

const TAB_LABELS: Record<TabKey, string> = { all: 'Tất cả', sent: 'Đã gửi', unsent: 'Chưa gửi' }

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
  /** Phiếu đã phát của lớp này — dùng để tính trạng thái "đã phát"/"phát bù" trong bottom sheet chọn tuần. */
  records: PhieuBeNgoan[]
  existingPhieu?: PhieuBeNgoan
  /** Tuần chọn sẵn khi vào màn này để "phát bù" từ banner (chỉ áp dụng khi tạo phiếu mới). */
  initialChuKyId?: string
  onBack: () => void
  onChangeClass: () => void
  onSend: (result: Omit<PhieuBeNgoan, 'id' | 'sentAt' | 'classId'>) => void
  /** Giáo viên chọn 1 tuần khác (đã có dữ liệu) trong bottom sheet — mở phiếu đó ở đúng chế độ hiện tại của app. */
  onOpenExistingRecord: (record: PhieuBeNgoan) => void
  /** "Phát bù ngay" — nhảy thẳng tới tuần cũ nhất chưa phát, kể cả khi đang mở màn này rồi. */
  onPhatBuNgay: (chuKyId: string) => void
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
  records,
  existingPhieu,
  initialChuKyId,
  onBack,
  onChangeClass,
  onSend,
  onOpenExistingRecord,
  onPhatBuNgay,
}: PhatPhieuScreenProps) {
  const [chuKyId, setChuKyId] = useState(existingPhieu?.chuKyId ?? initialChuKyId ?? PHIEU_TUAN_DEFAULT_ID)
  const [rows, setRows] = useState<Record<string, RowState>>(() => buildInitialRows(students, existingPhieu))
  const [showTuanPicker, setShowTuanPicker] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [tab, setTab] = useState<TabKey>('all')

  // Màn này ở lại mount khi giáo viên chọn 1 tuần khác trong bottom sheet
  // hoặc bấm "Phát bù ngay" (chỉ đổi prop existingPhieu/initialChuKyId,
  // không unmount) — đồng bộ lại tuần/rows mỗi khi 1 trong 2 đổi.
  useEffect(() => {
    setChuKyId(existingPhieu?.chuKyId ?? initialChuKyId ?? PHIEU_TUAN_DEFAULT_ID)
    setRows(buildInitialRows(students, existingPhieu))
    setTab('all')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingPhieu?.id, initialChuKyId])

  const selectedOption = PHIEU_TUAN_OPTIONS.find((o) => o.id === chuKyId) ?? PHIEU_TUAN_OPTIONS[PHIEU_TUAN_OPTIONS.length - 1]

  // Học sinh đã được gửi rồi (trong phiếu tuần đang mở) bị khoá vĩnh viễn —
  // không sửa/chọn lại được, chỉ hiển thị dữ liệu đã lưu.
  const lockedStudentIds = new Set(
    (existingPhieu?.ketQua ?? []).filter((k) => k.sent).map((k) => k.studentId)
  )
  const unlockedStudents = students.filter((s) => !lockedStudentIds.has(s.id))
  const allDone = !!existingPhieu && unlockedStudents.length === 0

  const allChecked = unlockedStudents.length > 0 && unlockedStudents.every((s) => rows[s.id]?.dat)
  // Đạt/tổng tính trên TOÀN BỘ sĩ số (học sinh đã khoá dùng dữ liệu đã lưu, học sinh còn lại dùng dữ liệu đang sửa).
  const datCount = students.filter((s) => rows[s.id]?.dat).length

  const tabCounts: Record<TabKey, number> = {
    all: students.length,
    sent: lockedStudentIds.size,
    unsent: students.length - lockedStudentIds.size,
  }
  const visibleStudents = students.filter((s) => {
    if (tab === 'all') return true
    const locked = lockedStudentIds.has(s.id)
    return tab === 'sent' ? locked : !locked
  })

  // Banner "phát bù" chỉ hiện khi đang thao tác trên tuần hiện tại (tạo mới
  // hoặc tiếp tục gửi nốt tuần hiện tại) — mở 1 tuần cũ cụ thể (qua phát bù
  // hoặc xem lại lịch sử) thì ẩn đi, tránh đổi ngữ cảnh màn hình đang xem dở.
  const showBanner = !existingPhieu || existingPhieu.chuKyId === PHIEU_TUAN_DEFAULT_ID
  const missedWeeks = showBanner ? computeMissedTuanOptions(records) : []

  const tuanOptions: ChuKyPickerOption[] = PHIEU_TUAN_OPTIONS.map((opt) => {
    const record = records.find((r) => r.chuKyId === opt.id)
    if (record) {
      const sent = phieuSentCount(record)
      if (sent >= students.length) return { ...opt, status: 'sent' }
      return { ...opt, status: 'partial', caption: `Đã gửi ${sent}/${students.length}` }
    }
    const offset = phieuWeekOffsetFromId(opt.id)
    if (offset < -PHIEU_PHAT_BU_LIMIT_WEEKS) return { ...opt, status: 'too-old' }
    return { ...opt, status: 'available' }
  })

  const handleSelectChuKy = (option: ChuKyPickerOption) => {
    if (option.status === 'sent') {
      const existing = records.find((r) => r.chuKyId === option.id)
      if (existing) onOpenExistingRecord(existing)
      setShowTuanPicker(false)
      return
    }
    if (option.status === 'partial') {
      const existing = records.find((r) => r.chuKyId === option.id)
      if (existing) onOpenExistingRecord(existing)
      setShowTuanPicker(false)
      return
    }
    setChuKyId(option.id)
    setShowTuanPicker(false)
  }

  const handlePhatBuNgay = () => {
    if (missedWeeks.length === 0) return
    onPhatBuNgay(missedWeeks[0].id)
  }

  const handleToggleAll = () => {
    const next = !allChecked
    setRows((prev) => {
      const updated = { ...prev }
      unlockedStudents.forEach((s) => {
        updated[s.id] = { ...updated[s.id], dat: next }
      })
      return updated
    })
  }

  const handleSetDat = (studentId: string, dat: boolean) => {
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], dat } }))
  }

  const handleToggleNote = (studentId: string) => {
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], noteOpen: !prev[studentId].noteOpen } }))
  }

  const handleNoteChange = (studentId: string, value: string) => {
    if (value.length > PHIEU_GHI_CHU_MAX_LENGTH) return
    setRows((prev) => ({ ...prev, [studentId]: { ...prev[studentId], nhanXet: value } }))
  }

  // Sao chép nhận xét của 1 học sinh sang các học sinh CHƯA khoá đang "Đạt"
  // khác — học sinh đã khoá hoặc không đạt không có ô nhận xét nên bỏ qua.
  const handleApplyToAll = (sourceStudentId: string) => {
    const text = rows[sourceStudentId]?.nhanXet ?? ''
    if (!text.trim()) return
    setRows((prev) => {
      const updated = { ...prev }
      unlockedStudents.forEach((s) => {
        if (updated[s.id]?.dat) {
          updated[s.id] = { ...updated[s.id], nhanXet: text }
        }
      })
      return updated
    })
  }

  const buildKetQua = (): PhieuHocSinhKetQua[] =>
    students.map((s) => {
      if (lockedStudentIds.has(s.id)) {
        // Học sinh đã gửi rồi — giữ nguyên dữ liệu đã lưu, không cho sửa.
        const existingRow = existingPhieu?.ketQua.find((k) => k.studentId === s.id)
        return existingRow ?? { studentId: s.id, dat: true, sent: true }
      }
      const row = rows[s.id]
      return {
        studentId: s.id,
        dat: row.dat,
        nhanXet: row.dat && row.nhanXet.trim() ? row.nhanXet.trim() : undefined,
        sent: true,
      }
    })

  const handleConfirmSend = () => {
    setShowConfirm(false)
    onSend({
      chuKyId,
      chuKyLabel: selectedOption.label,
      ketQua: buildKetQua(),
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <AppHeader
        title="Phát phiếu mới"
        subtitle={classSubtitle(selectedClass)}
        onBack={onBack}
        onChangeClass={onChangeClass}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {allDone && (
          <div className="flex items-center gap-2 border-b border-gray-100 bg-amber-50 px-4 py-2.5">
            <Lock size={14} className="shrink-0 text-amber-600" />
            <p className="text-xs text-amber-700">Phiếu tuần này đã gửi đủ cho cả lớp — chỉ xem, không thể chỉnh sửa.</p>
          </div>
        )}

        <MissedWeeksBanner weeks={missedWeeks} onPhatBuNgay={handlePhatBuNgay} />

        {/* I. Chọn tuần */}
        <div className={`border-b border-gray-100 px-4 py-3 ${existingPhieu ? 'pointer-events-none opacity-60' : ''}`}>
          <button
            onClick={() => setShowTuanPicker(true)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 text-left active:bg-gray-50"
          >
            <span className="flex items-center gap-2 text-sm text-black">
              <span className="text-base">📔</span>
              Tuần: {selectedOption.label}
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
          {!allDone && tab !== 'sent' && (
            <button onClick={handleToggleAll} className="flex items-center gap-1.5 text-sm font-medium text-black">
              Tất cả Đạt
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

        {/* Tabs Tất cả / Đã gửi / Chưa gửi — theo dõi tiến độ phát phiếu theo lô. */}
        <div className="flex gap-2 overflow-x-auto border-b border-gray-100 bg-white px-4 py-3 scrollbar-hide">
          {(['all', 'unsent', 'sent'] as TabKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                tab === key ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-600'
              }`}
            >
              {TAB_LABELS[key]} ({tabCounts[key]})
            </button>
          ))}
        </div>

        {visibleStudents.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">Không có học sinh nào trong nhóm này.</p>
        )}

        <div className="divide-y divide-gray-100">
          {visibleStudents.map((student) => {
            const row = rows[student.id]
            if (!row) return null
            const locked = lockedStudentIds.has(student.id)
            const hasNote = row.nhanXet.trim().length > 0
            return (
              <div key={student.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <StudentAvatar student={student} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-black">{student.name}</p>
                      {locked && (
                        <span className="flex shrink-0 items-center gap-0.5 text-[10px] font-semibold text-gray-400">
                          <Lock size={10} />
                          Đã gửi
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{student.studentCode}</p>

                    {locked ? (
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
                              {/* "Áp dụng cho tất cả" chỉ có ý nghĩa khi ≥2 học sinh (chưa khoá) đang được tick — ẩn hẳn (không disable) khi <2 */}
                              {unlockedStudents.filter((s) => rows[s.id]?.dat).length >= 2 && (
                                <button
                                  onClick={() => handleApplyToAll(student.id)}
                                  disabled={!hasNote}
                                  className={`text-xs font-semibold ${
                                    hasNote ? 'text-blue-600' : 'cursor-not-allowed text-gray-300'
                                  }`}
                                >
                                  Áp dụng cho tất cả học sinh
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {locked ? (
                    <span
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        row.dat ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {row.dat ? 'Đạt' : 'Chưa đạt'}
                    </span>
                  ) : (
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        onClick={() => handleSetDat(student.id, true)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          row.dat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        Đạt
                      </button>
                      <button
                        onClick={() => handleSetDat(student.id, false)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          !row.dat ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        Chưa đạt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {!allDone && (
        <div className="border-t border-gray-100 bg-white px-4 py-3">
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white active:bg-blue-700"
          >
            Gửi thông báo
          </button>
        </div>
      )}

      {showTuanPicker && (
        <ChuKyPickerSheet
          title="Chọn tuần"
          options={tuanOptions}
          selectedId={chuKyId}
          onSelect={handleSelectChuKy}
          onClose={() => setShowTuanPicker(false)}
        />
      )}

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8"
          onClick={() => setShowConfirm(false)}
        >
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-black">Xác nhận gửi thông báo</p>
            <p className="mt-2 text-sm text-gray-500">
              Sau khi gửi, thông tin của {unlockedStudents.length} học sinh này sẽ được gửi tới phụ huynh và
              không thể chỉnh sửa lại.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-black active:bg-gray-200"
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleConfirmSend}
                className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white active:bg-blue-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
