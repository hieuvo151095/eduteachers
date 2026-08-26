'use client'

import { Image as ImageIcon, MoreVertical, Play } from 'lucide-react'
import type { ClassInfo, HoatDongPost } from '@/lib/mock-data'
import { AppHeader, classSubtitle } from '@/components/teachers/shared/header'

interface FeedScreenProps {
  selectedClass: ClassInfo
  posts: HoatDongPost[]
  onBack: () => void
  onChangeClass: () => void
  onOpenCompose: () => void
}

function formatPostedAt(iso: string): string {
  const d = new Date(iso)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`
}

export function FeedScreen({ selectedClass, posts, onBack, onChangeClass, onOpenCompose }: FeedScreenProps) {
  return (
    <div className="flex flex-col bg-white">
      <AppHeader
        title="Hoạt động"
        subtitle={classSubtitle(selectedClass)}
        onBack={onBack}
        onChangeClass={onChangeClass}
      />

      <button
        onClick={onOpenCompose}
        className="mx-4 mt-3 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left active:bg-gray-50"
      >
        <p className="border-b border-gray-100 pb-3 text-sm text-gray-400">Đăng hoạt động cho lớp...</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-sm font-semibold text-black">
          <ImageIcon size={16} />
          Thư viện
        </span>
      </button>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <p className="text-sm text-gray-400">Chưa có hoạt động nào được đăng.</p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-gray-100 pb-6">
          {posts.map((post) => (
            <div key={post.id} className="px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                    {post.authorName.trim().split(' ').pop()?.[0] ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black">{post.authorName}</p>
                    <p className="text-xs text-gray-400">{formatPostedAt(post.postedAt)}</p>
                  </div>
                </div>
                <button className="p-1 text-gray-400">
                  <MoreVertical size={16} />
                </button>
              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm text-black">{post.content}</p>

              {post.attachments && post.attachments.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {post.attachments.map((att, idx) => (
                    <div key={idx} className="relative aspect-video overflow-hidden rounded-xl bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={att.url} alt="" className="h-full w-full object-cover" />
                      {att.type === 'video' && (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50">
                              <Play size={16} className="ml-0.5 text-white" fill="white" />
                            </div>
                          </div>
                          {att.durationLabel && (
                            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                              {att.durationLabel}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
