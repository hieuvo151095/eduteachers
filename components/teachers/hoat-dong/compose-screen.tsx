'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { Image as ImageIcon, X } from 'lucide-react'
import { DIEM_DANH_CLASSES, type ClassInfo } from '@/lib/mock-data'
import { AppHeader } from '@/components/teachers/shared/header'
import { ClassPickerSheet } from '@/components/teachers/attendance/class-picker-sheet'

interface ComposeScreenProps {
  selectedClass: ClassInfo
  onBack: () => void
  onPost: (content: string, classId: string) => void
}

export function ComposeScreen({ selectedClass, onBack, onPost }: ComposeScreenProps) {
  const [targetClass, setTargetClass] = useState<ClassInfo>(selectedClass)
  const [showClassPicker, setShowClassPicker] = useState(false)
  const [content, setContent] = useState('')
  const [imageCount, setImageCount] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canPost = content.trim().length > 0

  // DIEM_DANH_CLASSES bakes "Lớp " into some names (e.g. "Lớp 6A2") but not
  // others ("8A1") — normalize here so the chip never doubles or drops it.
  const classChipLabel = targetClass.name.startsWith('Lớp ') ? targetClass.name : `Lớp ${targetClass.name}`

  const handlePickImages = (e: ChangeEvent<HTMLInputElement>) => {
    setImageCount(e.target.files?.length ?? 0)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    onPost(content.trim(), targetClass.id)
  }

  return (
    <div className="flex flex-col bg-white">
      <AppHeader title="Tạo hoạt động mới" onBack={onBack} centered />

      <div className="mx-4 mt-3 rounded-2xl bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
          <p className="text-sm font-bold text-black">Lớp được chọn</p>
          <button onClick={() => setShowClassPicker(true)} className="text-sm font-semibold text-blue-600">
            Chọn lớp
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-black shadow-sm">
            {classChipLabel}
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 text-white">
              <X size={11} />
            </span>
          </span>
        </div>
      </div>

      <div className="border-b border-gray-100" />

      <div className="flex-1 px-4 py-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Đăng hoạt động cho lớp..."
          rows={8}
          className="w-full resize-none bg-transparent text-sm text-black outline-none placeholder:text-gray-400"
        />
        {imageCount > 0 && <p className="text-xs text-gray-500">Đã chọn {imageCount} ảnh</p>}
      </div>

      <div className="border-b border-gray-100" />

      <div className="px-4 py-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePickImages}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-sm font-semibold text-black active:bg-gray-50"
        >
          <ImageIcon size={16} />
          Thư viện
        </button>
      </div>

      {/* Spacer so the fixed action bar never covers the library button */}
      <div className="h-16" />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white px-4 py-3">
        <button
          onClick={() => canPost && setShowConfirm(true)}
          disabled={!canPost}
          className={`w-full rounded-xl py-3 text-sm font-semibold ${
            canPost ? 'bg-amber-400 text-black active:bg-amber-500' : 'bg-gray-100 text-gray-400'
          }`}
        >
          Đăng bài
        </button>
      </div>

      {showClassPicker && (
        <ClassPickerSheet
          classes={DIEM_DANH_CLASSES}
          selectedClassId={targetClass.id}
          onSelect={(cls) => {
            setTargetClass(cls)
            setShowClassPicker(false)
          }}
          onClose={() => setShowClassPicker(false)}
        />
      )}

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8"
          onClick={() => setShowConfirm(false)}
        >
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-bold text-black">Xác nhận đăng hoạt động</p>
            <p className="mt-2 text-sm text-gray-500">
              Sau khi đăng thành công, hoạt động sẽ được hiển thị tới phụ huynh.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-black active:bg-gray-200"
              >
                Huỷ bỏ
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-semibold text-black active:bg-amber-500"
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
