'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  MoreVertical,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_DIRECT,
  MOCK_MESSAGES_GROUP,
  MOCK_TEACHER_INFO,
  Conversation,
  ChatMessage,
  type RequestStatus,
} from '@/lib/mock-data'

// ─── Screen Navigation ─────────────────────────────────────────────────────

type MessagingScreen =
  | { type: 'list' }
  | { type: 'direct'; conversationId: string }
  | { type: 'direct-detail'; conversationId: string; requestId: string }
  | { type: 'group'; conversationId: string }
  | { type: 'compose' }
  | { type: 'group-manage'; conversationId: string }

interface MessagingAppProps {
  onBack: () => void
}

export function MessagingApp({ onBack }: MessagingAppProps) {
  const [screen, setScreen] = useState<MessagingScreen>({ type: 'list' })
  const [requestAcknowledged, setRequestAcknowledged] = useState<Set<string>>(new Set())
  const [allParentsReadOnly, setAllParentsReadOnly] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)

  const handleAcknowledgeRequest = (requestId: string) => {
    setRequestAcknowledged((prev) => new Set(prev).add(requestId))
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {screen.type === 'list' && (
        <ScreenList
          onSelectConversation={(id) =>
            setScreen({
              type: MOCK_CONVERSATIONS.find((c) => c.id === id)?.type === 'group' ? 'group' : 'direct',
              conversationId: id,
            })
          }
          onCompose={() => setScreen({ type: 'compose' })}
          onBack={onBack}
        />
      )}

      {screen.type === 'direct' && (
        <ScreenDirectChat
          conversationId={screen.conversationId}
          requestAcknowledged={requestAcknowledged}
          onAcknowledge={handleAcknowledgeRequest}
          onViewDetail={(requestId) =>
            setScreen({ type: 'direct-detail', conversationId: screen.conversationId, requestId })
          }
          onBack={() => setScreen({ type: 'list' })}
        />
      )}

      {screen.type === 'direct-detail' && (
        <ScreenRequestDetail
          requestId={screen.requestId}
          requestAcknowledged={requestAcknowledged}
          onAcknowledge={handleAcknowledgeRequest}
          onBack={() => setScreen({ type: 'direct', conversationId: screen.conversationId })}
        />
      )}

      {screen.type === 'group' && (
        <ScreenGroupChat
          conversationId={screen.conversationId}
          allParentsReadOnly={allParentsReadOnly}
          onManage={() => setScreen({ type: 'group-manage', conversationId: screen.conversationId })}
          onBack={() => setScreen({ type: 'list' })}
        />
      )}

      {screen.type === 'compose' && (
        <ScreenCompose onBack={() => setScreen({ type: 'list' })} />
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

// ─── SCREEN 1: Conversation List ──────────────────────────────────────────

interface ScreenListProps {
  onSelectConversation: (id: string) => void
  onCompose: () => void
  onBack: () => void
}

function ScreenList({ onSelectConversation, onCompose, onBack }: ScreenListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [classFilter, setClassFilter] = useState('6A2')

  const filtered = MOCK_CONVERSATIONS.filter(
    (c) =>
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (classFilter === 'all' || c.displayName.includes(classFilter))
  )

  const totalUnread = MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-black">Trao đổi</h1>
            <p className="text-xs text-gray-500">GVCN Lớp 6A2 · 32 học sinh</p>
          </div>
          <button
            onClick={onCompose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <Plus size={20} className="text-black" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm phụ huynh…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50"
          />
        </div>

        {/* Class filter chips */}
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {['6A2', '8A1', '7B1', 'all'].map((cls) => (
            <button
              key={cls}
              onClick={() => setClassFilter(cls)}
              className={`px-3 py-1 text-xs font-medium rounded-full shrink-0 transition-colors ${
                classFilter === cls
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cls === 'all' ? 'Tất cả' : `Lớp ${cls}`}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
        {filtered.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-700">
                {conv.displayName.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-black text-sm">{conv.displayName}</h3>
                  <p className="text-xs text-gray-500 shrink-0">{conv.lastMessageTime}</p>
                </div>
                <p className="mt-1 text-xs text-gray-600 truncate">{conv.lastMessage}</p>
              </div>

              {/* Unread badge */}
              {conv.unreadCount > 0 && (
                <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1" />
              )}
            </div>
          </button>
        ))}
      </div>
    </>
  )
}

// ─── SCREEN 2: Direct Chat (1:1) ──────────────────────────────────────────

interface ScreenDirectChatProps {
  conversationId: string
  requestAcknowledged: Set<string>
  onAcknowledge: (requestId: string) => void
  onViewDetail: (requestId: string) => void
  onBack: () => void
}

function ScreenDirectChat({
  conversationId,
  requestAcknowledged,
  onAcknowledge,
  onViewDetail,
  onBack,
}: ScreenDirectChatProps) {
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === conversationId)
  const messages = MOCK_MESSAGES_DIRECT
  const [replyText, setReplyText] = useState('')

  if (!conversation) return null

  const parentName = conversation.displayName
  const parentInfo = 'Mẹ: Lê Thị Hoa · Lớp 6A2'

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-black text-sm">{parentName}</h2>
          <p className="text-xs text-gray-500">{parentInfo}</p>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <MoreVertical size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <p className="text-center text-xs text-gray-500 py-2">Hôm nay</p>

        {messages.map((msg) => {
          const isTeacher = msg.senderRole === 'teacher'
          const acknowledged = msg.messageType === 'request' && requestAcknowledged.has(msg.request!.id)

          return (
            <div key={msg.id} className={`flex gap-2 ${isTeacher ? 'justify-end' : 'justify-start'}`}>
              {msg.messageType === 'text' ? (
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    isTeacher
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {msg.text}
                </div>
              ) : msg.request ? (
                <div className="max-w-sm space-y-2">
                  <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-3">
                    <p className="text-xs font-semibold text-orange-700">
                      {msg.request.type === 'medicine' ? '💊' : '📝'} {msg.request.title} · từ Phụ huynh
                    </p>
                    <p className="mt-1 text-xs text-gray-700">{msg.request.description}</p>

                    {acknowledged ? (
                      <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-green-600">
                        <CheckCircle2 size={14} />
                        Cô đã ghi nhận
                      </div>
                    ) : (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => onAcknowledge(msg.request!.id)}
                          className="flex-1 rounded bg-black px-2 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                        >
                          Ghi nhận
                        </button>
                        <button
                          onClick={() => onViewDetail(msg.request!.id)}
                          className="text-xs text-gray-600 hover:text-black underline"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 flex gap-2">
        <button className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-600 hover:text-black">
          <Plus size={20} />
        </button>
        <input
          type="text"
          placeholder="Trả lời phụ huynh…"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />
        <button
          disabled={!replyText.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-400 hover:text-black disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </>
  )
}

// ─── SCREEN 2b: Request Detail ────────────────────────────────────────────

interface ScreenRequestDetailProps {
  requestId: string
  requestAcknowledged: Set<string>
  onAcknowledge: (requestId: string) => void
  onBack: () => void
}

function ScreenRequestDetail({
  requestId,
  requestAcknowledged,
  onAcknowledge,
  onBack,
}: ScreenRequestDetailProps) {
  const msg = MOCK_MESSAGES_DIRECT.find((m) => m.request?.id === requestId)
  const request = msg?.request

  if (!request) return null

  const acknowledged = requestAcknowledged.has(requestId)

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="font-bold text-black text-sm">Chi tiết đơn</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Request card */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-bold text-black text-sm">{request.title}</h3>
          <p className="mt-2 text-sm text-gray-700">{request.description}</p>
          {request.appliesDate && (
            <p className="mt-2 text-xs text-gray-500">Áp dụng: {request.appliesDate}</p>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={14} className="text-green-600" />
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-semibold text-black">Phụ huynh đã gửi</p>
              <p>10:02</p>
            </div>
          </div>

          <div className="ml-4 border-l border-gray-300 h-6" />

          <div className="flex items-center gap-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              acknowledged ? 'bg-green-100' : 'bg-gray-200'
            }`}>
              <CheckCircle2 size={14} className={acknowledged ? 'text-green-600' : 'text-gray-400'} />
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-semibold text-black">
                {acknowledged ? 'Cô đã ghi nhận' : 'Chờ xác nhận từ cô'}
              </p>
              {acknowledged && <p>Vừa xong</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!acknowledged && (
          <div className="flex gap-2 pt-4">
            <button
              onClick={() => onAcknowledge(requestId)}
              className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Xác nhận đã nhận
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── SCREEN 4: Group Chat ─────────────────────────────────────────────────

interface ScreenGroupChatProps {
  conversationId: string
  allParentsReadOnly: boolean
  onManage: () => void
  onBack: () => void
}

function ScreenGroupChat({ conversationId, allParentsReadOnly, onManage, onBack }: ScreenGroupChatProps) {
  const messages = MOCK_MESSAGES_GROUP
  const [msgText, setMsgText] = useState('')

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h2 className="font-bold text-black text-sm">Nhóm Lớp 6A2</h2>
              <p className="text-xs text-gray-500">Quản trị · 32 thành viên</p>
            </div>
          </div>
          <button
            onClick={onManage}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <MoreVertical size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="text-xs font-semibold text-black">
          Bạn là quản trị{' '}
          <button onClick={onManage} className="text-gray-600 hover:text-black underline">
            Quản lý thành viên →
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
              {msg.senderName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-black">{msg.senderName}</p>
              <div className="mt-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      {!allParentsReadOnly && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 flex gap-2">
          <button className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-600 hover:text-black">
            <Plus size={20} />
          </button>
          <input
            type="text"
            placeholder="Nhập tin nhắn…"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <button
            disabled={!msgText.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-400 hover:text-black disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      )}
    </>
  )
}

// ─── SCREEN 3: Compose New ────────────────────────────────────────────────

interface ScreenComposeProps {
  onBack: () => void
}

function ScreenCompose({ onBack }: ScreenComposeProps) {
  const [mode, setMode] = useState<'single' | 'multiple' | 'class'>('single')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center justify-between">
        <h2 className="font-bold text-black text-sm">Tạo trao đổi</h2>
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Mode selector */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 flex gap-2">
        {(['single', 'multiple', 'class'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              setSelected(new Set())
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              mode === m
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {m === 'single' ? '1 người' : m === 'multiple' ? 'Nhiều người' : 'Cả lớp'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm phụ huynh / học sinh…"
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50"
          />
        </div>
      </div>

      {/* Parent list */}
      <div className="flex-1 overflow-y-auto">
        {['Lê Thị Hoa', 'Trần Văn Hùng', 'Nguyễn Thị Thu', 'Phạm Minh Hiếu', 'Võ Thanh Hoa'].map(
          (parentName, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type={mode === 'single' ? 'radio' : 'checkbox'}
                name={mode === 'single' ? 'parent' : undefined}
                checked={selected.has(parentName)}
                onChange={(e) => {
                  if (mode === 'single') {
                    setSelected(new Set([parentName]))
                  } else {
                    const newSet = new Set(selected)
                    if (e.target.checked) {
                      newSet.add(parentName)
                    } else {
                      newSet.delete(parentName)
                    }
                    setSelected(newSet)
                  }
                }}
                className="h-4 w-4"
              />
              <div>
                <p className="text-sm font-semibold text-black">PH {parentName}</p>
              </div>
            </label>
          )
        )}
      </div>

      {/* Action button */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <button
          disabled={selected.size === 0}
          className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === 'single'
            ? 'Nhắn tin'
            : mode === 'multiple'
              ? `Tạo nhóm với ${selected.size} phụ huynh`
              : 'Tạo nhóm cả lớp'}
        </button>
      </div>
    </>
  )
}

// ─── SCREEN 5: Group Manage ──────────────────────────────────────────────

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
  const mockMembers = [
    { id: 'teacher-1', name: 'Cô Nguyễn Hồng', role: 'admin' },
    { id: 'parent-1', name: 'Lê Thị Hoa' },
    { id: 'parent-2', name: 'Trần Văn Hùng' },
    { id: 'parent-3', name: 'Nguyễn Thị Thu' },
  ]

  return (
    <>
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h2 className="font-bold text-black text-sm">Thành viên nhóm</h2>
          <p className="text-xs text-gray-500">Lớp 6A2 · 32 thành viên</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4 px-4 py-4">
        {/* Read-only toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-black">Chỉ GV được đăng</p>
            <p className="text-xs text-gray-600">Khoá PH gửi tin, chỉ GV thông báo</p>
          </div>
          <button
            onClick={() => onReadOnlyChange(!allParentsReadOnly)}
            className={`relative h-6 w-10 rounded-full transition-colors ${
              allParentsReadOnly ? 'bg-black' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                allParentsReadOnly ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Add member */}
        <button className="w-full px-4 py-2 text-sm font-semibold text-black border border-gray-200 rounded-lg hover:bg-gray-50">
          + Thêm thành viên
        </button>

        {/* Admin section */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase">QUẢN TRỊ</p>
          {mockMembers
            .filter((m) => m.role === 'admin')
            .map((member) => (
              <div key={member.id} className="py-2 px-2 text-sm text-black font-semibold">
                {member.name}
                <span className="ml-2 text-xs text-gray-600 font-normal">Quản trị nhóm</span>
              </div>
            ))}
        </div>

        {/* Members section */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">
            PHỤ HUYNH ({mockMembers.filter((m) => m.role !== 'admin').length})
          </p>
          {memberToDelete && (
            <div className="mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-700">Xoá {memberToDelete} khỏi nhóm?</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onMemberDeleteChange(null)}
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-200"
                >
                  Huỷ
                </button>
                <button
                  onClick={() => onMemberDeleteChange(null)}
                  className="flex-1 px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Xoá
                </button>
              </div>
            </div>
          )}

          {mockMembers
            .filter((m) => m.role !== 'admin')
            .map((member) => (
              <div key={member.id} className="flex items-center justify-between py-2 px-2 border-b border-gray-200">
                <p className="text-sm text-black font-semibold">{member.name}</p>
                <button
                  onClick={() => onMemberDeleteChange(member.name)}
                  className="text-gray-400 hover:text-red-600 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
