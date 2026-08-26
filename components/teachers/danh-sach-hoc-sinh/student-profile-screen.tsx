'use client'

import { MapPin, Phone, User } from 'lucide-react'
import type { HocSinhProfile } from '@/lib/mock-data'
import { AppHeader } from '@/components/teachers/shared/header'

interface StudentProfileScreenProps {
  student: HocSinhProfile
  onBack: () => void
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 text-sm">
      <span className="shrink-0 text-gray-500">{label}</span>
      <span className="text-right font-medium text-black">{value}</span>
    </div>
  )
}

export function StudentProfileScreen({ student, onBack }: StudentProfileScreenProps) {
  return (
    <div className="flex flex-col bg-gray-50">
      <AppHeader title="Hồ sơ học sinh" onBack={onBack} centered />

      <div className="flex flex-col items-center px-4 pb-6 pt-6">
        <div className="relative z-10">
          {student.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={student.avatar}
              alt=""
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-gray-400 shadow-sm">
              <User size={40} />
            </div>
          )}
        </div>

        <div className="-mt-12 w-full rounded-2xl bg-sky-50 px-4 pb-4 pt-14">
          <p className="text-center text-base font-bold text-black">{student.name}</p>
          <p className="text-center text-sm text-gray-500">{student.studentCode}</p>

          <div className="mt-4 rounded-xl bg-white px-4 py-3 ring-1 ring-sky-100">
            <p className="mb-1 text-sm font-bold text-black">Thông tin cá nhân</p>
            <div className="divide-y divide-gray-100">
              <InfoRow label="Ngày sinh" value={student.dob} />
              <InfoRow label="Giới tính" value={student.gender} />
              <InfoRow label="Lớp" value={student.className} />
              <InfoRow label="Trường" value={student.schoolName} />
            </div>
          </div>
        </div>

        <div className="mt-4 w-full rounded-2xl bg-white px-4 py-4 ring-1 ring-gray-100">
          <p className="mb-3 text-sm font-bold text-black">Người giám hộ</p>
          <div className="space-y-3">
            {student.guardians.map((g, idx) => (
              <div key={idx} className="rounded-xl border border-sky-200 bg-sky-50/60 px-3 py-3">
                <p className="border-b border-sky-200/70 pb-2 text-sm font-bold text-black">{g.name}</p>
                <div className="mt-2 space-y-1.5">
                  <p className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone size={13} className="shrink-0 text-sky-600" />
                    {g.phone}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin size={13} className="shrink-0 text-sky-600" />
                    {g.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
