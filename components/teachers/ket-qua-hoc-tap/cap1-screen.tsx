'use client'

import { CAP1_TABS, type Cap1TabData } from '@/lib/mock-data'

interface Cap1ScreenProps {
  activeTabIndex: number
  onSelectTab: (index: number) => void
  data: Cap1TabData
}

function NangLucTable({
  subTitle,
  columnLabel,
  rows,
}: {
  subTitle?: string
  columnLabel: string
  rows: { name: string; mucDatDuoc: string }[]
}) {
  return (
    <div className="px-4 py-3">
      {subTitle && <p className="mb-2 text-sm font-semibold text-black">{subTitle}</p>}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <div className="flex bg-gray-50 text-xs font-semibold text-gray-600">
          <div className="flex-1 px-3 py-2">{columnLabel}</div>
          <div className="w-24 shrink-0 px-3 py-2 text-center">Mức đạt được</div>
        </div>
        <div className="divide-y divide-gray-100">
          {rows.map((row) => (
            <div key={row.name} className="flex items-center text-sm">
              <div className="flex-1 px-3 py-2 text-black">{row.name}</div>
              <div className="w-24 shrink-0 px-3 py-2 text-center font-semibold text-black">{row.mucDatDuoc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Cap1Screen({ activeTabIndex, onSelectTab, data }: Cap1ScreenProps) {
  return (
    <div className="flex flex-col bg-gray-50">
      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-gray-100 bg-white px-3 py-3 scrollbar-hide">
        {CAP1_TABS.map((tab, idx) => {
          const isActive = idx === activeTabIndex
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(idx)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                isActive ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Card 1 — Kết quả học tập */}
      <div className="bg-white px-4 py-3">
        <p className="mb-2 text-sm font-bold text-black">Kết quả học tập</p>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="flex bg-gray-50 text-xs font-semibold text-gray-600">
            <div className="flex-1 px-3 py-2">Môn học</div>
            <div className="w-14 shrink-0 px-2 py-2 text-center">KTĐK</div>
            <div className="w-24 shrink-0 px-2 py-2 text-center">Mức đạt được</div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.monHoc.map((row) => (
              <div key={row.name} className="flex items-center text-sm">
                <div className="flex-1 px-3 py-2 text-black">{row.name}</div>
                <div className="w-14 shrink-0 px-2 py-2 text-center font-semibold text-black">{row.ktdk}</div>
                <div className="w-24 shrink-0 px-2 py-2 text-center font-semibold text-black">{row.mucDatDuoc}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[11px] text-gray-500">T: Hoàn thành tốt, H: Hoàn thành, C: Chưa hoàn thành</p>
      </div>

      <div className="mt-2 bg-white pt-2">
        <div className="px-4 pt-1">
          <p className="text-base font-bold text-black">Năng lực cốt lõi, phẩm chất chủ yếu</p>
        </div>
        <div className="divide-y divide-gray-100">
          <NangLucTable subTitle="Năng lực chung" columnLabel="Năng lực" rows={data.nangLucChung} />
          <NangLucTable subTitle="Năng lực đặc thù" columnLabel="Năng lực" rows={data.nangLucDacThu} />
        </div>
        <div className="border-t border-gray-100 px-4 pt-1">
          <p className="pt-2 text-base font-bold text-black">Phẩm chất chủ yếu</p>
        </div>
        <NangLucTable columnLabel="Phẩm chất" rows={data.phamChat} />

        <div className="px-4 pb-6 pt-1">
          <p className="text-sm font-bold text-black">Ghi chú</p>
          <p className="mt-1 text-xs text-gray-500">T=Tốt, Đ=Đạt, C=Cần cố gắng</p>
        </div>
      </div>
    </div>
  )
}
