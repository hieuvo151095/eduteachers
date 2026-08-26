'use client'

import { useState } from 'react'
import { DIEM_DANH_CLASSES, HOAT_DONG_POSTS, MOCK_TEACHER_INFO, type ClassInfo } from '@/lib/mock-data'
import { ClassPickerSheet } from '@/components/teachers/attendance/class-picker-sheet'
import { FeedScreen } from './feed-screen'
import { ComposeScreen } from './compose-screen'

interface HoatDongAppProps {
  onBack: () => void
}

type InternalScreen = 'feed' | 'compose'

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-4 py-2 shadow-lg transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <span className="whitespace-nowrap text-xs font-semibold text-white">{message}</span>
    </div>
  )
}

export function HoatDongApp({ onBack }: HoatDongAppProps) {
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(DIEM_DANH_CLASSES[0])
  const [showClassPicker, setShowClassPicker] = useState(false)
  const [screen, setScreen] = useState<InternalScreen>('feed')
  // Bumped after every mutation to HOAT_DONG_POSTS so React re-renders and
  // re-reads the module-level array (mutated in place, no state of its own).
  const [, setPostsVersion] = useState(0)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const showToast = (message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 2500)
  }

  const posts = HOAT_DONG_POSTS.filter((p) => p.classId === selectedClass.id).sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  )

  const handlePost = (content: string, classId: string) => {
    HOAT_DONG_POSTS.unshift({
      id: `hd-${Date.now()}`,
      classId,
      authorName: MOCK_TEACHER_INFO.name,
      postedAt: new Date().toISOString(),
      content,
    })
    setPostsVersion((v) => v + 1)
    setScreen('feed')
    showToast('Đã đăng hoạt động')
  }

  return (
    <div className="relative flex min-h-full flex-col bg-white">
      {screen === 'feed' && (
        <FeedScreen
          selectedClass={selectedClass}
          posts={posts}
          onBack={onBack}
          onChangeClass={() => setShowClassPicker(true)}
          onOpenCompose={() => setScreen('compose')}
        />
      )}

      {screen === 'compose' && (
        <ComposeScreen selectedClass={selectedClass} onBack={() => setScreen('feed')} onPost={handlePost} />
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

      <Toast visible={toast.visible} message={toast.message} />
    </div>
  )
}
