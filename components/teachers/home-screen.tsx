'use client'

import { BookOpen, Users, Activity, AlertCircle, Calendar, MessageSquare, UtensilsCrossed, Zap } from 'lucide-react'

interface HomeScreenProps {
  onNavigateToThucDon: () => void
}

export function TeachersHomeScreen({ onNavigateToThucDon }: HomeScreenProps) {
  const entryPoints = [
    {
      id: 'attendance',
      icon: BookOpen,
      label: 'Điểm danh',
      color: 'bg-blue-500',
    },
    {
      id: 'students',
      icon: Users,
      label: 'Danh sách học sinh',
      color: 'bg-blue-600',
    },
    {
      id: 'activity',
      icon: Activity,
      label: 'Hoạt động',
      color: 'bg-orange-500',
    },
    {
      id: 'absence',
      icon: AlertCircle,
      label: 'Báo vắng',
      color: 'bg-purple-600',
    },
    {
      id: 'schedule',
      icon: Calendar,
      label: 'Thời khoá biểu',
      color: 'bg-purple-700',
    },
    {
      id: 'homework',
      icon: MessageSquare,
      label: 'Bài tập',
      color: 'bg-teal-600',
    },
    {
      id: 'menu',
      icon: UtensilsCrossed,
      label: 'Thực đơn lớp',
      color: 'bg-green-600',
      onClick: onNavigateToThucDon,
    },
    {
      id: 'energy',
      icon: Zap,
      label: 'Năng lượng',
      color: 'bg-yellow-600',
    },
  ]

  return (
    <div className="min-h-screen bg-yellow-100 p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mb-2">
          <div className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-white">
            <p className="text-sm font-bold">ECO School</p>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Trường THCS Độc Lập</h1>
        <p className="text-xs text-gray-600">Demo Soha</p>
      </div>

      {/* Class Selector */}
      <div className="mb-6">
        <p className="mb-2 text-xs text-gray-600">Thầy/Cô đang ở lớp</p>
        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-blue-600 bg-blue-50 px-3 py-2">
            <div className="h-5 w-5 rounded bg-yellow-400" />
            <div className="text-left">
              <p className="text-sm font-bold text-gray-800">Lớp 6A2</p>
              <p className="text-xs text-gray-600">Lớp chủ nhiệm</p>
            </div>
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-3 py-2">
            <p className="text-sm font-semibold text-gray-700">8A1</p>
          </button>
          <button className="rounded-lg border border-gray-300 bg-white px-3 py-2">
            <p className="text-sm font-semibold text-gray-700">8A2</p>
          </button>
        </div>
      </div>

      {/* Entry Points Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {entryPoints.map((point) => {
          const Icon = point.icon
          return (
            <button
              key={point.id}
              onClick={point.onClick}
              className={`${point.color} flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 text-white transition-transform active:scale-95`}
            >
              <Icon className="h-8 w-8" />
              <span className="text-center text-xs font-semibold">{point.label}</span>
            </button>
          )
        })}
      </div>

      {/* Today's Section */}
      <div className="rounded-lg border-2 border-yellow-400 bg-white p-4">
        <h2 className="mb-4 font-bold text-gray-800">Điểm danh hôm nay</h2>
        <div className="rounded-lg bg-yellow-50 px-4 py-3">
          <p className="text-sm font-semibold text-gray-800">Lớp Lớp 6A2</p>
          <p className="text-xs text-gray-600">Thứ 7, 27/06/2026</p>
          <p className="mt-2 text-lg font-bold text-gray-800">Sĩ số: 7</p>
        </div>
      </div>
    </div>
  )
}
