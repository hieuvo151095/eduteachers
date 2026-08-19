'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarX2, Camera, ChevronLeft, Clock, IdCard, Info } from 'lucide-react'
import type { DiemDanhStudent } from '@/lib/mock-data'
import { StudentAvatar } from './shared'

export type ConfirmStatus = 'có-mặt' | 'vắng-có-phép' | 'vắng-không-phép'

const NOTE_MAX = 256

function nowTime(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

interface ConfirmScreenProps {
  students: DiemDanhStudent[]
  onEdit: () => void
  onConfirm: (status: ConfirmStatus, time: string, note: string) => void
}

export function ConfirmScreen({ students, onEdit, onConfirm }: ConfirmScreenProps) {
  const [status, setStatus] = useState<ConfirmStatus>('có-mặt')
  const [time, setTime] = useState(nowTime())
  const [note, setNote] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // A per-student photo only makes sense when checking in a single student —
  // with a batch, one photo can't represent everyone in it.
  const isSingleStudent = students.length === 1

  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    e.target.value = ''
  }

  const options: { value: ConfirmStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'có-mặt', label: 'Có mặt', icon: <span className="text-green-600">✓</span> },
    { value: 'vắng-có-phép', label: 'Vắng có phép', icon: <IdCard size={16} className="text-blue-600" /> },
    { value: 'vắng-không-phép', label: 'Vắng không phép', icon: <CalendarX2 size={16} className="text-red-600" /> },
  ]

  return (
    <div className="relative flex flex-1 flex-col bg-gray-50 pb-24">
      {/* Header — centered, no subtitle */}
      <div className="relative flex items-center justify-center border-b border-gray-200 bg-white px-4 py-3">
        <button onClick={onEdit} className="absolute left-4 p-1 text-gray-600 active:text-black">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-base font-bold text-black">Xác nhận điểm danh</h1>
      </div>

      <div className="space-y-4 p-4">
        {/* Đang điểm danh */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-black">Đang điểm danh</p>
            <button onClick={onEdit} className="text-xs font-semibold text-blue-600">
              Chỉnh sửa
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {students.map((s) => (
              <div key={s.id} className="flex w-16 shrink-0 flex-col items-center gap-1 text-center">
                <StudentAvatar student={s} size={48} />
                <p className="line-clamp-2 text-[11px] font-medium text-black">{s.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Điểm danh đến */}
        <div>
          <p className="mb-2 text-sm font-bold text-black">Điểm danh đến</p>
          <div className="grid grid-cols-3 gap-2">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border bg-white p-3 text-center ${
                  status === opt.value ? 'border-orange-400 shadow-sm' : 'border-gray-200'
                }`}
              >
                {opt.icon}
                <span className="text-[11px] font-semibold text-black">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Giờ đón */}
        <div>
          <p className="mb-2 text-sm font-bold text-black">Giờ đón</p>
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-sm font-bold text-blue-600">
              <Clock size={15} />
              {time}
            </span>
            <button
              onClick={() => setTime(nowTime())}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 active:bg-gray-50"
            >
              Bây giờ
            </button>
          </div>
        </div>

        {/* Hình điểm danh */}
        <div>
          <p className="mb-2 text-sm font-bold text-black">Hình điểm danh</p>
          {isSingleStudent ? (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              {!photoUrl ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-1 rounded-lg border border-dashed border-gray-300 py-4 active:bg-gray-50"
                >
                  <Camera size={22} className="text-blue-600" />
                  <span className="text-sm font-bold text-blue-600">Chụp ảnh điểm danh</span>
                  <span className="text-xs text-gray-400">Không bắt buộc</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoUrl} alt="Ảnh điểm danh" className="h-16 w-16 rounded-lg border border-gray-200 object-cover" />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 active:bg-gray-50"
                  >
                    Chụp lại
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3">
              <Info size={16} className="mt-0.5 shrink-0 text-blue-500" />
              <p className="text-xs text-blue-800">
                Không thể chụp ảnh khi điểm danh nhiều học sinh. Có thể bổ sung cho mỗi học sinh sau khi điểm danh.
              </p>
            </div>
          )}
        </div>

        {/* Ghi chú */}
        <div>
          <p className="mb-2 text-sm font-bold text-black">Ghi chú</p>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
              rows={3}
              placeholder="Nhập ghi chú"
              className="w-full resize-none bg-transparent text-sm text-black placeholder-gray-400 outline-none"
            />
            <p className="text-right text-[11px] text-gray-400">
              {note.length}/{NOTE_MAX}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom fixed */}
      <div className="absolute inset-x-0 bottom-0 border-t border-gray-200 bg-white p-3">
        <button
          onClick={() => onConfirm(status, time, note)}
          className="w-full rounded-xl bg-orange-400 py-3 text-sm font-bold text-white active:opacity-90"
        >
          Xác nhận
        </button>
      </div>
    </div>
  )
}
