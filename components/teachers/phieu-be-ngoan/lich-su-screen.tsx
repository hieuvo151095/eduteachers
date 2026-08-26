'use client'

import { useEffect, useState } from 'react'
import { Award, ChevronRight, Lock, Plus } from 'lucide-react'
import {
  PHIEU_CURRENT_MONTH_KEY,
  PHIEU_SCHOOL_YEAR_LABEL,
  PHIEU_TUAN_DEFAULT_ID,
  computeMissedTuanOptions,
  phieuMonthKeyLabel,
  phieuSentCount,
  phieuWeekMonthKeys,
  type ClassInfo,
  type DiemDanhStudent,
  type PhieuBeNgoan,
} from '@/lib/mock-data'
import { AppHeader, classSubtitle } from '@/components/teachers/shared/header'
import { ChuKyPickerSheet, type ChuKyPickerOption } from './chu-ky-picker-sheet'
import { MissedWeeksBanner } from './missed-weeks-banner'

interface LichSuScreenProps {
  selectedClass: ClassInfo
  students: DiemDanhStudent[]
  records: PhieuBeNgoan[] // sorted newest first, scoped to selectedClass
  onBack: () => void
  onChangeClass: () => void
  onCreateNew: () => void
  onOpenRecord: (record: PhieuBeNgoan) => void
  /** "Phát bù ngay" từ banner — điều hướng sang màn Phát phiếu mới với tuần này chọn sẵn. */
  onPhatBuNgay: (chuKyId: string) => void
}

function formatSentAt(iso: string): string {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${min} ${dd}/${mm}/${yyyy}`
}

// Danh sách tháng có thể lọc: mọi tháng có ít nhất 1 tuần chạm tới (kể cả
// giao 2 tháng) + luôn có tháng hiện tại, mới nhất trước.
function buildMonthOptions(records: PhieuBeNgoan[]): ChuKyPickerOption[] {
  const keys = new Set<string>([PHIEU_CURRENT_MONTH_KEY])
  records.forEach((r) => phieuWeekMonthKeys(r.chuKyId).forEach((k) => keys.add(k)))
  return Array.from(keys)
    .map((key) => {
      const [y, m] = key.split('-').map(Number)
      return { key, y, m }
    })
    .sort((a, b) => b.y - a.y || b.m - a.m)
    .map(({ key }) => ({ id: key, label: phieuMonthKeyLabel(key) }))
}

export function LichSuScreen({
  selectedClass,
  students,
  records,
  onBack,
  onChangeClass,
  onCreateNew,
  onOpenRecord,
  onPhatBuNgay,
}: LichSuScreenProps) {
  const monthOptions = buildMonthOptions(records)
  // Mặc định = tháng MỚI NHẤT có phiếu (không phải tháng hệ thống hiện tại) —
  // monthOptions đã sắp xếp mới nhất trước.
  const [selectedMonthKey, setSelectedMonthKey] = useState(monthOptions[0]?.id ?? PHIEU_CURRENT_MONTH_KEY)
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  // Đổi lớp (khác sĩ số/lịch sử hoàn toàn) → quay lại tháng mới nhất của lớp mới thay vì giữ lựa chọn cũ.
  useEffect(() => {
    setSelectedMonthKey(buildMonthOptions(records)[0]?.id ?? PHIEU_CURRENT_MONTH_KEY)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass.id])

  const hasAnyRecord = records.length > 0

  const totalInYear = records.length
  const totalThisMonth = records.filter((r) => phieuWeekMonthKeys(r.chuKyId).includes(PHIEU_CURRENT_MONTH_KEY)).length

  // Tiến độ phát phiếu của tuần hiện tại — cho giáo viên thấy ngay số học
  // sinh đã/chưa nhận kết quả tuần này mà không cần mở từng phiếu.
  const currentWeekRecord = records.find((r) => r.chuKyId === PHIEU_TUAN_DEFAULT_ID)
  const currentWeekSent = currentWeekRecord ? phieuSentCount(currentWeekRecord) : 0
  const currentWeekUnsent = students.length - currentWeekSent

  const missedWeeks = computeMissedTuanOptions(records)
  const selectedMonthLabel = phieuMonthKeyLabel(selectedMonthKey)

  // Tuần giao 2 tháng xuất hiện ở CẢ HAI group tháng tương ứng khi lọc — dữ
  // liệu vẫn chỉ có 1 bản ghi duy nhất, đây chỉ là hiển thị.
  const monthRecords = records.filter((r) => phieuWeekMonthKeys(r.chuKyId).includes(selectedMonthKey))

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <AppHeader
        title="Phiếu bé ngoan"
        subtitle={classSubtitle(selectedClass)}
        onBack={onBack}
        onChangeClass={onChangeClass}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!hasAnyRecord ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <Award size={64} className="text-gray-300" />
            <p className="mt-2 text-sm font-bold text-black">Chưa có phiếu bé ngoan nào</p>
            <p className="text-xs leading-relaxed text-gray-500">
              Phát phiếu bé ngoan đầu tiên cho lớp {selectedClass.name} để bắt đầu ghi nhận và động viên các em.
            </p>
          </div>
        ) : (
          <>
            <div className="px-4 pb-1 pt-3">
              <p className="mb-2 text-sm font-bold text-black">Tổng quan năm học {PHIEU_SCHOOL_YEAR_LABEL}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-500">Tổng số phiếu đã phát trong năm</p>
                  <p className="mt-1 text-lg font-bold text-black">{totalInYear}</p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-3">
                  <p className="text-xs text-gray-500">Tổng số phiếu đã phát tháng này</p>
                  <p className="mt-1 text-lg font-bold text-black">{totalThisMonth}</p>
                </div>
                <div className="rounded-xl bg-green-50 px-3 py-3">
                  <p className="text-xs text-gray-500">Đã gửi tuần này</p>
                  <p className="mt-1 text-lg font-bold text-black">
                    {currentWeekSent}/{students.length}
                  </p>
                </div>
                <div className="rounded-xl bg-amber-50 px-3 py-3">
                  <p className="text-xs text-gray-500">Chưa gửi tuần này</p>
                  <p className="mt-1 text-lg font-bold text-black">
                    {currentWeekUnsent}/{students.length}
                  </p>
                </div>
              </div>
            </div>

            <MissedWeeksBanner weeks={missedWeeks} onPhatBuNgay={() => onPhatBuNgay(missedWeeks[0]?.id)} />

            <div className="px-4 py-3">
              <button
                onClick={() => setShowMonthPicker(true)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 text-left active:bg-gray-50"
              >
                <span className="flex items-center gap-2 text-sm text-black">
                  <span className="text-base">📔</span>
                  Xem theo tháng: {selectedMonthLabel}
                </span>
                <ChevronRight size={16} className="shrink-0 text-gray-400" />
              </button>
            </div>

            {monthRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-sm text-gray-400">Không có phiếu nào trong {selectedMonthLabel.toLowerCase()}.</p>
              </div>
            ) : (
              <div className="space-y-2 px-4 pb-6">
                {monthRecords.map((record) => {
                  const totalStudents = students.length
                  const sentCount = phieuSentCount(record)
                  const isFullySent = sentCount >= totalStudents
                  const datAmongSent = record.ketQua.filter((k) => k.sent && k.dat).length
                  const percent = sentCount > 0 ? (datAmongSent / sentCount) * 100 : 0
                  return (
                    <button
                      key={record.id}
                      onClick={() => onOpenRecord(record)}
                      className={`flex w-full flex-col items-start gap-1.5 rounded-xl border px-4 py-3 text-left ${
                        isFullySent
                          ? 'border-gray-200 active:bg-gray-50'
                          : 'border-amber-300 bg-amber-50/40 active:bg-amber-50'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5 text-sm font-bold text-black">
                          <Award size={16} className="shrink-0 text-gray-700" />
                          <span className="truncate">Tuần: {record.chuKyLabel}</span>
                        </span>
                        <ChevronRight size={16} className="shrink-0 text-gray-400" />
                      </div>

                      <p className="text-xs text-gray-500">Đã gửi lúc {formatSentAt(record.sentAt)}</p>

                      <div className="flex w-full items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div className="h-full rounded-full bg-gray-800" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="shrink-0 text-xs font-medium text-gray-600">
                          Đạt {datAmongSent}/{sentCount}
                        </span>
                      </div>

                      {isFullySent ? (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Lock size={12} />
                          Đã gửi đủ {totalStudents}/{totalStudents} · Chỉ xem
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-700">
                          Đã gửi {sentCount}/{totalStudents} · còn {totalStudents - sentCount} chưa gửi
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <button
          onClick={onCreateNew}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white active:bg-blue-700"
        >
          <Plus size={16} />
          Phát phiếu mới
        </button>
      </div>

      {showMonthPicker && (
        <ChuKyPickerSheet
          title="Xem theo tháng"
          options={monthOptions}
          selectedId={selectedMonthKey}
          onSelect={(option) => {
            setSelectedMonthKey(option.id)
            setShowMonthPicker(false)
          }}
          onClose={() => setShowMonthPicker(false)}
        />
      )}
    </div>
  )
}
