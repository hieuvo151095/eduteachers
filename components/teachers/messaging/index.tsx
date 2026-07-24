'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  Plus,
  Search,
  MoreVertical,
  X,
  Send,
  Pin,
  Camera,
  ImageIcon,
  FileText,
  ChevronRight,
} from 'lucide-react'
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_DIRECT,
  MOCK_MESSAGES_GROUP,
  type Conversation,
  type ChatMessage,
} from '@/lib/mock-data'

// ─── Extra mock data ──────────────────────────────────────────────────────────

const EXTRA_CONVERSATIONS: Conversation[] = [
  // ── group chats
  {
    id: 'conv-7',
    type: 'group',
    participantIds: Array.from({ length: 16 }, (_, i) => `p-${i}`),
    displayName: 'Nhóm Lớp 8A1',
    lastMessage: 'Bạn: Ngày mai nghỉ học nhé các em',
    lastMessageTime: 'Hôm qua',
    unreadCount: 2,
  },
  {
    id: 'conv-8',
    type: 'group',
    participantIds: Array.from({ length: 16 }, (_, i) => `p7-${i}`),
    displayName: 'Nhóm Lớp 7B1',
    lastMessage: 'Mẹ bé Lan: Con bị ốm cô ơi',
    lastMessageTime: 'T2',
    unreadCount: 0,
  },
  // ── direct chats — Lớp 6A2 (5 parents)
  { id: 'conv-d-6a2-1', type: 'direct', participantIds: ['teacher-1', 'parent-6a2-1'],
    displayName: 'PH bé Tuấn Kiệt (6A2)', lastMessage: 'Cảm ơn cô đã nhắn ạ', lastMessageTime: '08:30', unreadCount: 0 },
  { id: 'conv-d-6a2-2', type: 'direct', participantIds: ['teacher-1', 'parent-6a2-2'],
    displayName: 'PH bé Thanh Mai (6A2)', lastMessage: 'Dạ em ghi nhận ạ', lastMessageTime: '07:55', unreadCount: 0 },
  { id: 'conv-d-6a2-3', type: 'direct', participantIds: ['teacher-1', 'parent-6a2-3'],
    displayName: 'PH bé Bảo Châu (6A2)', lastMessage: 'Bạn: Con có bài kiểm tra ngày mai nhé', lastMessageTime: 'Hôm qua', unreadCount: 0 },
  { id: 'conv-d-6a2-4', type: 'direct', participantIds: ['teacher-1', 'parent-6a2-4'],
    displayName: 'PH bé Gia Hân (6A2)', lastMessage: 'Bé sẽ đi muộn sáng nay cô ơi', lastMessageTime: 'T4', unreadCount: 2 },
  { id: 'conv-d-6a2-5', type: 'direct', participantIds: ['teacher-1', 'parent-6a2-5'],
    displayName: 'PH bé Đăng Khôi (6A2)', lastMessage: 'Cô ơi con xin nghỉ hôm nay ạ', lastMessageTime: 'T3', unreadCount: 0 },
  // ── direct chats — Lớp 8A1 (5 parents)
  { id: 'conv-d-8a1-1', type: 'direct', participantIds: ['teacher-1', 'parent-8a1-1'],
    displayName: 'PH bé Đức Minh (8A1)', lastMessage: 'Bé bị ho cô nhé', lastMessageTime: 'Hôm qua', unreadCount: 1 },
  { id: 'conv-d-8a1-2', type: 'direct', participantIds: ['teacher-1', 'parent-8a1-2'],
    displayName: 'PH bé Anh Thư (8A1)', lastMessage: 'Sáng mai bé đến muộn cô ơi', lastMessageTime: 'T4', unreadCount: 0 },
  { id: 'conv-d-8a1-3', type: 'direct', participantIds: ['teacher-1', 'parent-8a1-3'],
    displayName: 'PH bé Thị Ngọc (8A1)', lastMessage: 'Bạn: Cô xác nhận giúp bé ạ', lastMessageTime: 'T3', unreadCount: 0 },
  { id: 'conv-d-8a1-4', type: 'direct', participantIds: ['teacher-1', 'parent-8a1-4'],
    displayName: 'PH bé Văn Nam (8A1)', lastMessage: 'Con bị sốt, xin phép nghỉ ạ', lastMessageTime: 'T2', unreadCount: 3 },
  { id: 'conv-d-8a1-5', type: 'direct', participantIds: ['teacher-1', 'parent-8a1-5'],
    displayName: 'PH bé Quang Huy (8A1)', lastMessage: 'Dạ cảm ơn cô nhiều ạ', lastMessageTime: 'T2', unreadCount: 0 },
  // ── direct chats — Lớp 7B1 (5 parents)
  { id: 'conv-d-7b1-1', type: 'direct', participantIds: ['teacher-1', 'parent-7b1-1'],
    displayName: 'PH bé Minh Tú (7B1)', lastMessage: 'Con bị ốm cô nhé ạ', lastMessageTime: 'T2', unreadCount: 0 },
  { id: 'conv-d-7b1-2', type: 'direct', participantIds: ['teacher-1', 'parent-7b1-2'],
    displayName: 'PH bé Thị Lan (7B1)', lastMessage: 'Bạn: Cô nhớ nhắc con học bài nhé', lastMessageTime: 'T2', unreadCount: 0 },
  { id: 'conv-d-7b1-3', type: 'direct', participantIds: ['teacher-1', 'parent-7b1-3'],
    displayName: 'PH bé Minh An (7B1)', lastMessage: 'Con xin nghỉ chiều nay ạ', lastMessageTime: 'T3', unreadCount: 1 },
  { id: 'conv-d-7b1-4', type: 'direct', participantIds: ['teacher-1', 'parent-7b1-4'],
    displayName: 'PH bé Quỳnh Anh (7B1)', lastMessage: 'Bé cần xin phép cô ạ', lastMessageTime: 'T4', unreadCount: 0 },
  { id: 'conv-d-7b1-5', type: 'direct', participantIds: ['teacher-1', 'parent-7b1-5'],
    displayName: 'PH bé Thị Hoa (7B1)', lastMessage: 'Cảm ơn cô đã quan tâm ạ', lastMessageTime: 'Hôm qua', unreadCount: 0 },
]

// Base conversations — dynamically extended when groups are created
const BASE_CONVERSATIONS: Conversation[] = [...MOCK_CONVERSATIONS, ...EXTRA_CONVERSATIONS]
function getAllConversations() {
  return [...BASE_CONVERSATIONS, ...DYNAMIC_GROUPS.map((g) => g.conv)]
}

// 15 mock students
const MOCK_STUDENTS = Array.from({ length: 15 }, (_, i) => ({
  id: `student-${i}`,
  name: [
    'Nguyễn Minh An','Trần Quỳnh Anh','Lê Đăng Khôi','Phạm Bảo Châu','Võ Gia Hân',
    'Đặng Tuấn Kiệt','Bùi Thanh Mai','Hoàng Đức Minh','Phan Thị Ngọc','Lý Anh Thư',
    'Trịnh Văn Nam','Ngô Thị Hoa','Dương Quang Huy','Đinh Thị Lan','Cao Minh Tú',
  ][i],
  code: `${10000000 + i * 37123}`,
}))

// 18 mock parents (some students have 2 parents)
const MOCK_PARENTS_MANAGE = Array.from({ length: 18 }, (_, i) => ({
  id: `par-${i}`,
  name: [
    'Nguyễn Văn A','Lê Thị B','Trần Văn C','Phạm Thị D','Võ Văn E',
    'Đặng Thị F','Bùi Văn G','Hoàng Thị H','Phan Văn I','Lý Thị J',
    'Trịnh Văn K','Ngô Thị L','Dương Văn M','Đinh Thị N','Cao Văn O',
    'Lê Thị P','Trần Văn Q','Phạm Thị R',
  ][i],
  studentName: MOCK_STUDENTS[Math.min(i, 14)].name,
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  const parts = name.trim().split(' ')
  return parts[parts.length - 1].charAt(0).toUpperCase()
}

function GroupAvatar({ participantCount }: { participantCount: number }) {
  if (participantCount <= 1) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
        G
      </div>
    )
  }
  // 2 avatar halves + overflow count
  const shown = Math.min(2, participantCount)
  const overflow = participantCount - shown
  return (
    <div className="relative h-12 w-12 shrink-0">
      {Array.from({ length: shown }).map((_, idx) => (
        <div
          key={idx}
          className="absolute flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-500 text-[10px] font-bold text-white"
          style={{
            top: idx === 0 ? 0 : 'auto',
            bottom: idx === 1 ? 0 : 'auto',
            left: idx === 0 ? 0 : 'auto',
            right: idx === 1 ? 0 : 'auto',
          }}
        >
          {String.fromCharCode(65 + idx)}
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-800 text-[9px] font-bold text-white"
          style={{ bottom: 0, right: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

// ─── Screen Navigation ─────────────────────────────────────────────────────

type MessagingScreen =
  | { type: 'list' }
  | { type: 'direct'; conversationId: string }
  | { type: 'group'; conversationId: string }
  | { type: 'group-pinned'; conversationId: string }
  | { type: 'create-group'; defaultClass: string }
  | { type: 'group-manage'; conversationId: string }

interface MessagingAppProps {
  onBack: () => void
}

// Mutable store for dynamically created groups (lives outside component to persist across re-renders)
const DYNAMIC_GROUPS: { conv: Conversation; systemMsg: string }[] = []

export function MessagingApp({ onBack }: MessagingAppProps) {
  const [screen, setScreen] = useState<MessagingScreen>({ type: 'list' })
  const [activeClassFilter, setActiveClassFilter] = useState('6A2')
  const [pinnedMessages, setPinnedMessages] = useState<Set<string>>(new Set(['gmsg-1']))
  const [allParentsReadOnly, setAllParentsReadOnly] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)
  const [, forceUpdate] = useState(0)

  const handleTogglePinMessage = (messageId: string) => {
    setPinnedMessages((prev) => {
      const next = new Set(prev)
      if (next.has(messageId)) {
        next.delete(messageId)
      } else if (next.size < 3) {
        next.add(messageId)
      }
      return next
    })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {screen.type === 'list' && (
        <ScreenList
          activeClassFilter={activeClassFilter}
          onClassFilterChange={setActiveClassFilter}
          onSelectConversation={(id) => {
            const conv = getAllConversations().find((c) => c.id === id)
            setScreen({ type: conv?.type === 'group' ? 'group' : 'direct', conversationId: id })
          }}
          onCreateGroup={() => setScreen({ type: 'create-group', defaultClass: activeClassFilter })}
          onBack={onBack}
        />
      )}

      {screen.type === 'direct' && (
        <ScreenDirectChat
          conversationId={screen.conversationId}
          pinnedMessages={pinnedMessages}
          onTogglePin={handleTogglePinMessage}
          onBack={() => setScreen({ type: 'list' })}
        />
      )}

      {screen.type === 'group' && (
        <ScreenGroupChat
          conversationId={screen.conversationId}
          allParentsReadOnly={allParentsReadOnly}
          pinnedMessages={pinnedMessages}
          onTogglePin={handleTogglePinMessage}
          onViewPinned={() => setScreen({ type: 'group-pinned', conversationId: screen.conversationId })}
          onManage={() => setScreen({ type: 'group-manage', conversationId: screen.conversationId })}
          onBack={() => setScreen({ type: 'list' })}
        />
      )}

      {screen.type === 'group-pinned' && (
        <ScreenPinnedMessages
          pinnedMessages={pinnedMessages}
          onUnpin={handleTogglePinMessage}
          onBack={() => setScreen({ type: 'group', conversationId: screen.conversationId })}
        />
      )}

      {screen.type === 'create-group' && (
        <ScreenCreateGroup
          defaultClass={screen.defaultClass}
          onCreated={(groupName) => {
            const newId = `conv-dynamic-${Date.now()}`
            DYNAMIC_GROUPS.push({
              conv: {
                id: newId,
                type: 'group',
                participantIds: Array.from({ length: 4 }, (_, i) => `dyn-${i}`),
                displayName: groupName,
                lastMessage: 'Nhóm trao đổi được tạo bởi Cô Nguyễn Hồng',
                lastMessageTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                unreadCount: 0,
              },
              systemMsg: 'Nhóm trao đổi được tạo bởi Cô Nguyễn Hồng',
            })
            forceUpdate((n) => n + 1)
            setScreen({ type: 'group', conversationId: newId })
          }}
          onBack={() => setScreen({ type: 'list' })}
        />
      )}

      {screen.type === 'group-manage' && (
        <ScreenGroupManage
          conversationId={screen.conversationId}
          allParentsReadOnly={allParentsReadOnly}
          onReadOnlyChange={setAllParentsReadOnly}
          memberToDelete={memberToDelete}
          onMemberDeleteChange={setMemberToDelete}
          onBack={() => setScreen({ type: 'group', conversationId: screen.conversationId })}
        />
      )}
    </div>
  )
}

// ─── SCREEN 1: Conversation List ─────────────────────────────────────────────

interface ScreenListProps {
  activeClassFilter: string
  onClassFilterChange: (cls: string) => void
  onSelectConversation: (id: string) => void
  onCreateGroup: () => void
  onBack: () => void
}

const CLASS_FILTERS = ['6A2', '8A1', '7B1']

function ScreenList({ activeClassFilter, onClassFilterChange, onSelectConversation, onCreateGroup, onBack }: ScreenListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = getAllConversations().filter((c) => {
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = activeClassFilter === '' || c.displayName.includes(activeClassFilter)
    return matchesSearch && matchesClass
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-4 pb-0 pt-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-black">Trao đổi</h1>
            <p className="text-xs text-gray-500">GVCN Lớp 6A2 · 32 học sinh</p>
          </div>
          <button
            onClick={onCreateGroup}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Plus size={20} className="text-black" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm lớp, phụ huynh…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-black [color-scheme:light] outline-none focus:border-gray-400 focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Class filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-3">
          {CLASS_FILTERS.map((cls) => (
            <button
              key={cls}
              onClick={() => onClassFilterChange(activeClassFilter === cls ? '' : cls)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                activeClassFilter === cls
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Lớp {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list — each item in its own card frame */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-400">Không tìm thấy cuộc trò chuyện</p>
        )}
        {filtered.map((conv) => {
          const isGroup = conv.type === 'group'
          const count = conv.participantIds.length
          return (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className="w-full rounded-xl border border-gray-100 bg-white px-3 py-3 text-left shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                {isGroup && count > 2 ? (
                  <GroupAvatar participantCount={count - 1} />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700">
                    {initials(conv.displayName)}
                  </div>
                )}
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-semibold text-black text-sm">{conv.displayName}</h3>
                    <p className="shrink-0 text-[11px] text-gray-400">{conv.lastMessageTime}</p>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{conv.lastMessage}</p>
                </div>
                {/* Unread badge */}
                {conv.unreadCount > 0 && (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black">
                    <span className="text-[10px] font-bold text-white">{conv.unreadCount}</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

    </div>
  )
}

// ─── SCREEN 2: Direct Chat ────────────────────────────────────────────────────

interface ScreenDirectChatProps {
  conversationId: string
  pinnedMessages: Set<string>
  onTogglePin: (messageId: string) => void
  onBack: () => void
}

function ScreenDirectChat({ conversationId, pinnedMessages, onTogglePin, onBack }: ScreenDirectChatProps) {
  const conversation = getAllConversations().find((c) => c.id === conversationId)
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(MOCK_MESSAGES_DIRECT)
  const [replyText, setReplyText] = useState('')
  const [showAttach, setShowAttach] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages])

  if (!conversation) return null

  const handleSend = () => {
    const text = replyText.trim()
    if (!text) return
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `msg-local-${Date.now()}`,
        senderId: 'teacher-1',
        senderName: 'Cô Nguyễn Hồng',
        senderRole: 'teacher',
        timestamp: new Date().toISOString(),
        messageType: 'text',
        text,
      },
    ])
    setReplyText('')
  }

  const pinnedList = localMessages.filter((m) => pinnedMessages.has(m.id))

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="truncate font-bold text-black text-sm">{conversation.displayName}</h2>
          <p className="text-xs text-gray-500">Mẹ: Lê Thị Hoa · Lớp 6A2</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <MoreVertical size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Pinned strip */}
      {pinnedList.length > 0 && (
        <div className="flex items-center gap-2 border-b border-gray-100 bg-amber-50 px-4 py-2">
          <Pin size={12} className="shrink-0 text-amber-600" />
          <p className="flex-1 truncate text-xs text-gray-700">
            {pinnedList[0].messageType === 'text' ? pinnedList[0].text : pinnedList[0].request?.title}
          </p>
          {pinnedList.length > 1 && (
            <span className="shrink-0 text-xs font-semibold text-amber-700">+{pinnedList.length - 1}</span>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <p className="text-center text-xs text-gray-400">Hôm nay</p>

        {localMessages.map((msg) => {
          const isTeacher = msg.senderRole === 'teacher'
          const isPinned = pinnedMessages.has(msg.id)
          return (
            <div key={msg.id} className={`group flex gap-2 ${isTeacher ? 'flex-row-reverse' : ''}`}>
              {!isTeacher && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-700 mt-1">
                  {initials(msg.senderName)}
                </div>
              )}
              <div className="flex flex-col gap-0.5" style={{ maxWidth: '72%' }}>
                {msg.messageType === 'text' && (
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      isTeacher ? 'bg-black text-white rounded-tr-sm' : 'bg-gray-100 text-black rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
                {msg.messageType === 'request' && msg.request && (
                  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-700">
                        {msg.request.type === 'medicine' ? 'Dặn thuốc' : 'Báo vắng'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">{msg.request.description}</p>
                  </div>
                )}
                {/* Pin action — teacher only, only when not yet pinned.
                    Unpinning is only available in the Pinned messages screen. */}
                {isTeacher && !isPinned && (
                  <button
                    onClick={() => onTogglePin(msg.id)}
                    className="self-end text-[10px] text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-black"
                  >
                    Ghim
                  </button>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Attach menu */}
      {showAttach && (
        <div className="flex gap-4 border-t border-gray-100 bg-white px-5 py-3">
          {[{ icon: Camera, label: 'Chụp ảnh' }, { icon: ImageIcon, label: 'Thư viện' }, { icon: FileText, label: 'Tài liệu' }].map(
            ({ icon: Icon, label }) => (
              <button key={label} onClick={() => setShowAttach(false)} className="flex flex-col items-center gap-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <Icon size={18} className="text-black" />
                </div>
                <span className="text-[10px] text-gray-600">{label}</span>
              </button>
            )
          )}
        </div>
      )}

      {/* Composer */}
      <div className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-2">
        <button
          onClick={() => setShowAttach((v) => !v)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <Plus size={18} className="text-black" />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder="Nhắn tin…"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
          }}
          className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-black [color-scheme:light] outline-none focus:border-gray-400 focus:bg-white"
        />
        <button
          onClick={handleSend}
          disabled={!replyText.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white disabled:opacity-30 hover:bg-gray-800"
        >
          <Send size={15} />
        </button>
      </div>
    </>
  )
}

// ─── SCREEN 3: Group Chat ─────────────────────────────────────────────────────

interface ScreenGroupChatProps {
  conversationId: string
  allParentsReadOnly: boolean
  pinnedMessages: Set<string>
  onTogglePin: (id: string) => void
  onViewPinned: () => void
  onManage: () => void
  onBack: () => void
}

function ScreenGroupChat({
  conversationId,
  allParentsReadOnly,
  pinnedMessages,
  onTogglePin,
  onViewPinned,
  onManage,
  onBack,
}: ScreenGroupChatProps) {
  const dynamicGroup = DYNAMIC_GROUPS.find((g) => g.conv.id === conversationId)
  const seedMessages: ChatMessage[] = dynamicGroup
    ? [{
        id: `sys-${conversationId}`,
        senderId: 'system',
        senderName: 'Hệ thống',
        senderRole: 'system' as never,
        timestamp: new Date().toISOString(),
        messageType: 'text',
        text: dynamicGroup.systemMsg,
      }]
    : MOCK_MESSAGES_GROUP
  const conversation = getAllConversations().find((c) => c.id === conversationId)
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(seedMessages)
  const [msgText, setMsgText] = useState('')
  const [showAttach, setShowAttach] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [localMessages])

  const handleSend = () => {
    const text = msgText.trim()
    if (!text) return
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `gmsg-local-${Date.now()}`,
        senderId: 'teacher-1',
        senderName: 'Cô Nguyễn Hồng · GVCN',
        senderRole: 'teacher',
        timestamp: new Date().toISOString(),
        messageType: 'text',
        text,
      },
    ])
    setMsgText('')
  }

  const pinnedList = localMessages.filter((m) => pinnedMessages.has(m.id))
  const latestPin = pinnedList[pinnedList.length - 1]
  const extraCount = pinnedList.length - 1

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="truncate font-bold text-black text-sm">{conversation?.displayName ?? 'Nhóm Lớp 6A2'}</h2>
            <p className="text-xs text-gray-500">32 thành viên</p>
          </div>
          <button onClick={onManage} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
            <MoreVertical size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Pinned strip */}
        {latestPin && (
          <button
            onClick={onViewPinned}
            className="mt-2 flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left hover:bg-gray-100"
          >
            <Pin size={12} className="shrink-0 text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Tin nhắn ghim</p>
              <p className="truncate text-xs text-gray-700">
                {latestPin.messageType === 'text' ? latestPin.text : latestPin.request?.title}
              </p>
            </div>
            {extraCount > 0 && (
              <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                +{extraCount}
              </span>
            )}
            <ChevronRight size={14} className="shrink-0 text-gray-400" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 px-4 py-3">
        <p className="text-center text-xs text-gray-400">Hôm nay</p>
        {localMessages.map((msg) => {
          const isSystem = msg.senderId === 'system'
          const isTeacher = msg.senderRole === 'teacher'
          const isPinned = pinnedMessages.has(msg.id)

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center py-1">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-500 text-center leading-snug">
                  {msg.text}
                </span>
              </div>
            )
          }

          return (
            <div key={msg.id} className={`group flex gap-2 ${isTeacher ? 'flex-row-reverse' : ''}`}>
              {!isTeacher && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-700 mt-1">
                  {initials(msg.senderName)}
                </div>
              )}
              <div className="flex flex-col gap-0.5" style={{ maxWidth: '78%' }}>
                {!isTeacher && (
                  <p className="text-[10px] font-semibold text-gray-500">{msg.senderName}</p>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    isTeacher ? 'bg-black text-white rounded-tr-sm' : 'bg-gray-100 text-black rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                {/* Pin action — teacher only; only show "Ghim" when not yet pinned.
                    Unpinning is only available in the Pinned messages screen. */}
                {isTeacher && !isPinned && (
                  <button
                    onClick={() => onTogglePin(msg.id)}
                    className="self-end text-[10px] text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-black"
                  >
                    Ghim
                  </button>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Attach menu */}
      {showAttach && (
        <div className="flex gap-4 border-t border-gray-100 bg-white px-5 py-3">
          {[{ icon: Camera, label: 'Chụp ảnh' }, { icon: ImageIcon, label: 'Thư viện' }, { icon: FileText, label: 'Tài liệu' }].map(
            ({ icon: Icon, label }) => (
              <button key={label} onClick={() => setShowAttach(false)} className="flex flex-col items-center gap-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <Icon size={18} className="text-black" />
                </div>
                <span className="text-[10px] text-gray-600">{label}</span>
              </button>
            )
          )}
        </div>
      )}

      {/* Composer — always shown for teacher (read-only only locks parents) */}
      <div className="flex items-center gap-2 border-t border-gray-100 bg-white px-3 py-2">
        <button
          onClick={() => setShowAttach((v) => !v)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <Plus size={18} className="text-black" />
        </button>
        <input
          ref={inputRef}
          type="text"
          placeholder={allParentsReadOnly ? 'Chỉ giáo viên được gửi tin nhắn…' : 'Nhắn tin…'}
          value={msgText}
          onChange={(e) => setMsgText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
          }}
          className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-black [color-scheme:light] outline-none focus:border-gray-400 focus:bg-white"
        />
        <button
          onClick={handleSend}
          disabled={!msgText.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white disabled:opacity-30 hover:bg-gray-800"
        >
          <Send size={15} />
        </button>
      </div>
    </>
  )
}

// ─── SCREEN 4: Pinned Messages ────────────────────────────────────────────────

interface ScreenPinnedMessagesProps {
  pinnedMessages: Set<string>
  onUnpin: (id: string) => void
  onBack: () => void
}

function ScreenPinnedMessages({ pinnedMessages, onUnpin, onBack }: ScreenPinnedMessagesProps) {
  const allMessages = [...MOCK_MESSAGES_GROUP, ...MOCK_MESSAGES_DIRECT]
  const pinned = allMessages.filter((m) => pinnedMessages.has(m.id))

  // Split by role
  const fromTeacher = pinned.filter((m) => m.senderRole === 'teacher')
  const fromParent = pinned.filter((m) => m.senderRole === 'parent')

  const PinCard = ({ msg }: { msg: ChatMessage }) => (
    <div className="relative rounded-xl border border-gray-200 bg-white p-3">
      {/* Unpin button */}
      <button
        onClick={() => onUnpin(msg.id)}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-500"
      >
        <X size={12} />
      </button>

      <p className="text-[10px] font-semibold text-gray-400 mb-1">
        {msg.senderName} · {new Date(msg.timestamp).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
      </p>

      {msg.messageType === 'text' && (
        <p className="pr-6 text-sm text-gray-800">{msg.text}</p>
      )}

      {msg.messageType === 'request' && msg.request && (
        <div className="pr-6">
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
              msg.request.type === 'medicine' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {msg.request.type === 'medicine' ? 'Dặn thuốc' : 'Báo vắng'}
            </span>
            {msg.request.status === 'pending' && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Chờ duyệt</span>
            )}
          </div>
          {/* Medicine card */}
          {msg.request.type === 'medicine' && (
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-gray-400">Học sinh</span>
                <span className="font-semibold text-black">Nguyễn Hoàng Minh Anh</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-gray-400">Giờ uống thuốc</span>
                <div className="flex gap-1">
                  {['7:30', '12:30', '16:30'].map((t) => (
                    <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 font-semibold text-black">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <span className="w-20 shrink-0 text-gray-400">Ghi chú</span>
                <span>{msg.request.description}</span>
              </div>
            </div>
          )}
          {/* Absence card */}
          {msg.request.type === 'absence' && (
            <div className="space-y-1 text-xs text-gray-700">
              <div className="flex gap-2">
                <span className="w-24 shrink-0 text-gray-400">Học sinh</span>
                <span className="font-semibold text-black">Nguyễn Hoàng Minh Anh</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 shrink-0 text-gray-400">Ngày nghỉ</span>
                <span>08/04/2026 – 11/04/2026 (4 ngày)</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 shrink-0 text-gray-400">Thời gian nghỉ</span>
                <span>Cả ngày</span>
              </div>
              <div className="flex gap-2">
                <span className="w-24 shrink-0 text-gray-400">Lý do</span>
                <span>{msg.request.description}</span>
              </div>
            </div>
          )}
          <button className="mt-2 text-xs font-semibold text-blue-600 hover:underline">Xem chi tiết</button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-black text-sm">Tin nhắn đã ghim</h2>
          <p className="text-xs text-gray-500">{pinned.length} tin nhắn</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 px-4 py-4">
        {pinned.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">Chưa có tin nhắn ghim</p>
        )}

        {/* From teacher */}
        {fromTeacher.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Ghim từ giáo viên</p>
              <p className="text-[10px] text-gray-400">Tối đa 3 tin nhắn</p>
            </div>
            <div className="space-y-3">
              {fromTeacher.map((m) => <PinCard key={m.id} msg={m} />)}
            </div>
          </section>
        )}

        {/* From parents */}
        {fromParent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Ghim từ bạn</p>
              <p className="text-[10px] text-gray-400">Tối đa 3 tin nhắn</p>
            </div>
            <div className="space-y-3">
              {fromParent.map((m) => <PinCard key={m.id} msg={m} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

// ─── SCREEN 5: Create Group ───────────────────────────────────────────────────

const CLASSES = ['6A2', '8A1', '7B1']

interface ScreenCreateGroupProps {
  defaultClass: string
  onCreated: (groupName: string) => void
  onBack: () => void
}

function ScreenCreateGroup({ defaultClass, onCreated, onBack }: ScreenCreateGroupProps) {
  const [groupName, setGroupName] = useState('')
  const [selectedClass, setSelectedClass] = useState(defaultClass || '6A2')
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const [showClassSheet, setShowClassSheet] = useState(false)
  const [showStudentSheet, setShowStudentSheet] = useState(false)
  const [studentSearch, setStudentSearch] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const isValid = groupName.trim().length > 0 && selectedStudents.size >= 2

  const filteredStudents = MOCK_STUDENTS.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  )

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleCreate = () => {
    setShowConfirm(false)
    onCreated(groupName.trim())
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="flex-1 text-sm font-bold text-black">Tạo nhóm trao đổi mới</h2>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {/* Tên nhóm */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Tên nhóm
          </label>
          <input
            type="text"
            placeholder="Nhập tên nhóm…"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black [color-scheme:light] outline-none focus:border-gray-400 focus:bg-white"
          />
        </div>

        {/* Chọn lớp */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Chọn lớp
          </label>
          <button
            onClick={() => setShowClassSheet(true)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-colors hover:bg-gray-100"
          >
            <span className={selectedClass ? 'font-semibold text-black' : 'text-gray-400'}>
              {selectedClass ? `Lớp ${selectedClass}` : 'Chọn lớp…'}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Chọn học sinh */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Chọn học sinh
            <span className="ml-1 font-normal normal-case text-gray-400">(chọn ít nhất 2)</span>
          </label>
          <button
            onClick={() => setShowStudentSheet(true)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-colors hover:bg-gray-100"
          >
            <span className={selectedStudents.size > 0 ? 'font-semibold text-black' : 'text-gray-400'}>
              {selectedStudents.size > 0
                ? `${selectedStudents.size} học sinh đã chọn`
                : 'Chọn học sinh…'}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>

          {/* Selected chips */}
          {selectedStudents.size > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {MOCK_STUDENTS.filter((s) => selectedStudents.has(s.id)).map((s) => (
                <div key={s.id} className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1">
                  <span className="text-xs font-semibold text-black">{s.name.split(' ').pop()}</span>
                  <button onClick={() => toggleStudent(s.id)} className="text-gray-400 hover:text-black">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky footer CTA */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <button
          disabled={!isValid}
          onClick={() => setShowConfirm(true)}
          className="w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900 disabled:opacity-30"
        >
          Tạo nhóm
        </button>
      </div>

      {/* Bottom sheet — Chọn lớp */}
      {showClassSheet && (
        <div className="absolute inset-0 z-30 flex items-end">
          <button className="absolute inset-0 bg-black/40" onClick={() => setShowClassSheet(false)} aria-label="Đóng" />
          <div className="relative w-full rounded-t-3xl bg-white px-5 pt-5 pb-8">
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200" />
            <button onClick={() => setShowClassSheet(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <X size={16} className="text-gray-600" />
            </button>
            <h3 className="mb-4 text-base font-bold text-black">Chọn lớp</h3>
            <div className="space-y-2">
              {CLASSES.map((cls) => (
                <button
                  key={cls}
                  onClick={() => { setSelectedClass(cls); setShowClassSheet(false) }}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    selectedClass === cls
                      ? 'border-black bg-black text-white'
                      : 'border-gray-200 bg-gray-50 text-black hover:bg-gray-100'
                  }`}
                >
                  Lớp {cls}
                  {selectedClass === cls && (
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 8l4 4 8-8" /></svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom sheet — Chọn học sinh */}
      {showStudentSheet && (
        <div className="absolute inset-0 z-30 flex items-end">
          <button className="absolute inset-0 bg-black/40" onClick={() => setShowStudentSheet(false)} aria-label="Đóng" />
          <div className="relative flex max-h-[75%] w-full flex-col rounded-t-3xl bg-white">
            <div className="shrink-0 px-5 pt-5 pb-3">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
              <button onClick={() => setShowStudentSheet(false)} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <X size={16} className="text-gray-600" />
              </button>
              <h3 className="mb-3 text-base font-bold text-black">Chọn học sinh</h3>
              <div className="relative mb-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm học sinh…"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-black [color-scheme:light] outline-none focus:border-gray-400"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 px-5">
              {filteredStudents.map((s) => (
                <label key={s.id} className="flex cursor-pointer items-center gap-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.has(s.id)}
                    onChange={() => toggleStudent(s.id)}
                    className="h-4 w-4 accent-black"
                  />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                    {initials(s.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.code}</p>
                  </div>
                  {selectedStudents.has(s.id) && (
                    <div className="h-5 w-5 rounded-full bg-black flex items-center justify-center">
                      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="white" strokeWidth="2.5"><path d="M2 8l4 4 8-8" /></svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
            <div className="shrink-0 border-t border-gray-100 px-5 py-3">
              <button
                onClick={() => setShowStudentSheet(false)}
                className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-900"
              >
                Xác nhận ({selectedStudents.size} học sinh)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm pop-up */}
      {showConfirm && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-1 text-base font-bold text-black">Xác nhận tạo nhóm</h3>
            <p className="mb-1 text-sm text-gray-600">
              Tên nhóm: <span className="font-semibold text-black">{groupName}</span>
            </p>
            <p className="mb-1 text-sm text-gray-600">
              Lớp: <span className="font-semibold text-black">Lớp {selectedClass}</span>
            </p>
            <p className="mb-5 text-sm text-gray-600">
              Thành viên: <span className="font-semibold text-black">{selectedStudents.size} học sinh</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Huỷ
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-900"
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SCREEN 6: Group Manage / Settings ───────────────────────────────────────

interface ScreenGroupManageProps {
  conversationId: string
  allParentsReadOnly: boolean
  onReadOnlyChange: (value: boolean) => void
  memberToDelete: string | null
  onMemberDeleteChange: (value: string | null) => void
  onBack: () => void
}

function ScreenGroupManage({
  allParentsReadOnly,
  onReadOnlyChange,
  memberToDelete,
  onMemberDeleteChange,
  onBack,
}: ScreenGroupManageProps) {
  const [tab, setTab] = useState<'students' | 'parents'>('students')
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [addMode, setAddMode] = useState<'student' | 'teacher'>('student')

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <button onClick={onBack} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="flex-1 font-bold text-black text-sm">Cài đặt nhóm</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Toggles */}
        <div className="px-4 py-4 space-y-4">
          {/* Admin row */}
          <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
              {initials('Cô Nguyễn Hồng')}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-black">Cô Nguyễn Hồng</p>
              <p className="text-xs text-gray-500">Quản trị nhóm</p>
            </div>
          </div>

          {/* Read-only toggle */}
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-black">Chỉ Giáo viên được gửi tin nhắn</p>
              <p className="text-xs text-gray-500">Khoá phụ huynh gửi tin nhắn trong nhóm</p>
            </div>
            <button
              onClick={() => onReadOnlyChange(!allParentsReadOnly)}
              className={`relative ml-4 h-6 w-11 shrink-0 rounded-full transition-colors ${
                allParentsReadOnly ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  allParentsReadOnly ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Tabs: Học sinh / Phụ huynh */}
        <div className="flex border-b border-gray-100 px-4">
          {(['students', 'parents'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === t
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {t === 'students' ? `Học sinh (${MOCK_STUDENTS.length})` : `Phụ huynh (${MOCK_PARENTS_MANAGE.length})`}
            </button>
          ))}
        </div>

        {/* Member list */}
        <div className="divide-y divide-gray-100 px-4">
          {tab === 'students' &&
            MOCK_STUDENTS.map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                  {initials(s.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-black">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.code}</p>
                </div>
                {memberToDelete === s.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => onMemberDeleteChange(null)} className="text-xs text-gray-500 hover:text-black">Huỷ</button>
                    <button onClick={() => onMemberDeleteChange(null)} className="text-xs font-semibold text-red-600 hover:text-red-700">Xoá</button>
                  </div>
                ) : (
                  <button onClick={() => onMemberDeleteChange(s.id)} className="text-gray-300 hover:text-red-400">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

          {tab === 'parents' &&
            MOCK_PARENTS_MANAGE.map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                  {initials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-black">{p.name}</p>
                  <p className="text-xs text-gray-400">PH bé {p.studentName}</p>
                </div>
                {memberToDelete === p.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => onMemberDeleteChange(null)} className="text-xs text-gray-500 hover:text-black">Huỷ</button>
                    <button onClick={() => onMemberDeleteChange(null)} className="text-xs font-semibold text-red-600 hover:text-red-700">Xoá</button>
                  </div>
                ) : (
                  <button onClick={() => onMemberDeleteChange(p.id)} className="text-gray-300 hover:text-red-400">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Sticky footer: Thêm thành viên */}
      <div className="absolute bottom-0 inset-x-0 border-t border-gray-100 bg-white px-4 py-3">
        <button
          onClick={() => setShowAddSheet(true)}
          className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-900"
        >
          + Thêm thành viên
        </button>
      </div>

      {/* Add member bottom sheet */}
      {showAddSheet && (
        <div className="absolute inset-0 z-30 flex items-end">
          <button className="absolute inset-0 bg-black/40" onClick={() => setShowAddSheet(false)} aria-label="Đóng" />
          <div className="relative w-full rounded-t-3xl bg-white px-5 pt-5 pb-8">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
            <button
              onClick={() => setShowAddSheet(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
            >
              <X size={16} className="text-gray-600" />
            </button>
            <h3 className="mb-4 text-base font-bold text-black">Thêm thành viên</h3>

            {/* Mode tabs */}
            <div className="mb-4 flex gap-2">
              {(['student', 'teacher'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setAddMode(m)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    addMode === m ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {m === 'student' ? 'Học sinh' : 'Giáo viên'}
                </button>
              ))}
            </div>

            <p className="mb-3 text-xs text-gray-500">
              {addMode === 'student'
                ? 'Nhập mã học sinh hoặc tên để thêm vào nhóm.'
                : 'Nhập tên giáo viên để thêm đồng quản trị nhóm.'}
            </p>

            <div className="relative mb-4">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={addMode === 'student' ? 'Tên hoặc mã học sinh…' : 'Tên giáo viên…'}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-black [color-scheme:light] outline-none focus:border-gray-400"
                autoFocus
              />
            </div>

            <button
              onClick={() => setShowAddSheet(false)}
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-gray-900"
            >
              Thêm vào nhóm
            </button>
          </div>
        </div>
      )}
    </>
  )
}
