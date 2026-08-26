'use client'

import { X, Check, Lock } from 'lucide-react'
import type { PhieuChuKyOption } from '@/lib/mock-data'

export type ChuKyOptionStatus = 'available' | 'partial' | 'sent' | 'too-old'

export interface ChuKyPickerOption extends PhieuChuKyOption {
  /** Defaults to 'available' when omitted — plain selectable option (e.g. month filter). */
  status?: ChuKyOptionStatus
  /** Caption shown for 'partial' (e.g. "Đã gửi 8/15") — ignored for other statuses. */
  caption?: string
}

interface ChuKyPickerSheetProps {
  title: string
  options: ChuKyPickerOption[]
  selectedId: string
  onSelect: (option: ChuKyPickerOption) => void
  onClose: () => void
}

export function ChuKyPickerSheet({ title, options, selectedId, onSelect, onClose }: ChuKyPickerSheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <div className="mx-auto w-full max-w-sm rounded-t-2xl bg-white px-5 py-5" onClick={(e) => e.stopPropagation()}>
        <div className="relative mb-4 flex items-center justify-center">
          <h2 className="text-base font-bold text-black">{title}</h2>
          <button
            onClick={onClose}
            className="absolute right-0 flex h-7 w-7 items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {options.map((option) => {
            const status = option.status ?? 'available'
            const isActive = option.id === selectedId
            const isTooOld = status === 'too-old'

            return (
              <button
                key={option.id}
                onClick={() => onSelect(option)}
                disabled={isTooOld}
                className={`relative flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left ${
                  isTooOld
                    ? 'cursor-not-allowed border-gray-100 bg-gray-50'
                    : status === 'sent'
                      ? 'border-gray-200 bg-gray-50 active:bg-gray-100'
                      : isActive
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 bg-white active:bg-gray-50'
                } ${isActive && !isTooOld ? 'ring-2 ring-orange-200' : ''}`}
              >
                <span className="text-base">📔</span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm font-medium ${isTooOld ? 'text-gray-400' : 'text-black'}`}>
                    {option.label}
                  </span>
                  {isTooOld && <span className="mt-0.5 block text-xs text-gray-400">Quá hạn phát bù</span>}
                  {status === 'partial' && option.caption && (
                    <span className="mt-0.5 block text-xs font-medium text-amber-600">{option.caption}</span>
                  )}
                </span>
                {status === 'sent' && (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-gray-500">
                    <Check size={13} strokeWidth={3} />
                    Đã phát
                  </span>
                )}
                {isTooOld && <Lock size={14} className="shrink-0 text-gray-300" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
