'use client'

import { useState, useRef, useEffect } from 'react'
import { X, LogIn, LogOut, CheckCheck, Camera, Clock } from 'lucide-react'

export type CheckInStatus = 'none' | 'checked-in' | 'checked-out'

interface CheckInButtonProps {
  status: CheckInStatus
  checkInTime?: string
  checkOutTime?: string
  onStatusChange: (status: CheckInStatus, checkInTime?: string, checkOutTime?: string) => void
}

function useLiveTime() {
  const [time, setTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  })
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function getHHMM() {
  const now = new Date()
  return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function getTodayLabel() {
  const now = new Date()
  return now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ─── Icon States ─────────────────────────────────────────────────────────────

function CheckInIcon({ status, checkInTime, checkOutTime }: {
  status: CheckInStatus
  checkInTime?: string
  checkOutTime?: string
}) {
  if (status === 'checked-out') {
    return (
      <div className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-1">
        <CheckCheck size={12} className="text-black" strokeWidth={2.5} />
        <span className="text-[10px] font-semibold leading-none text-black">
          {checkInTime} – {checkOutTime}
        </span>
      </div>
    )
  }
  if (status === 'checked-in') {
    return (
      <div className="flex items-center gap-1 rounded-full bg-black px-2 py-1">
        <Clock size={11} className="text-white" strokeWidth={2.5} />
        <span className="text-[10px] font-semibold leading-none text-white">
          {checkInTime}
        </span>
      </div>
    )
  }
  // none
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white transition-colors hover:bg-gray-50 active:bg-gray-100">
      <LogIn size={16} className="text-black" strokeWidth={2} />
    </div>
  )
}

// ─── Camera Overlay ───────────────────────────────────────────────────────────

interface CameraOverlayProps {
  mode: 'check-in' | 'check-out'
  checkInTime?: string
  onConfirm: (time: string) => void
  onCancel: () => void
}

function CameraOverlay({ mode, checkInTime, onConfirm, onCancel }: CameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(false)
  const liveTime = useLiveTime()

  useEffect(() => {
    let stream: MediaStream | null = null
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((s) => {
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = s
        }
        setStreaming(true)
      })
      .catch(() => setError(true))
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-5 pt-4 pb-2">
        <p className="text-sm font-bold text-white">
          {mode === 'check-in' ? 'Điểm danh vào' : 'Điểm danh ra về'}
        </p>
        <button
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
        >
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="relative mx-5 flex-1 overflow-hidden rounded-2xl bg-gray-900">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <Camera size={40} className="text-gray-500" />
            <p className="text-sm text-gray-400">
              Không truy cập được camera.
            </p>
            <button
              onClick={() => onConfirm(getHHMM())}
              className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black"
            >
              Xác nhận không có ảnh
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            {/* Oval face guide */}
            {streaming && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="rounded-full border-2 border-white/60"
                  style={{ width: 150, height: 190 }}
                />
              </div>
            )}
          </>
        )}
        {/* Live clock overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1">
          <span className="text-xs font-semibold tabular-nums text-white">{liveTime}</span>
        </div>
      </div>

      {/* Previous stamp */}
      {mode === 'check-out' && checkInTime && (
        <p className="mt-2 text-center text-xs text-gray-400">
          Vào lúc {checkInTime}
        </p>
      )}

      {/* Shutter row */}
      <div className="flex shrink-0 items-center justify-center py-5">
        {!error && (
          <button
            onClick={() => onConfirm(getHHMM())}
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 transition-transform active:scale-95"
          >
            <div className="h-12 w-12 rounded-full bg-white" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Confirm Absent Modal ─────────────────────────────────────────────────────

interface AbsentModalProps {
  onConfirm: () => void
  onCancel: () => void
}

function AbsentModal({ onConfirm, onCancel }: AbsentModalProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-end">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-label="Đóng"
      />
      {/* Sheet */}
      <div className="relative w-full rounded-t-3xl bg-white px-6 pt-5 pb-8">
        {/* Handle */}
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
        >
          <X size={16} className="text-gray-600" />
        </button>
        <h3 className="mb-2 text-base font-bold text-black">Xác nhận vắng mặt</h3>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          Bạn vui lòng xác nhận vắng mặt hôm nay{' '}
          <span className="font-semibold text-black">{getTodayLabel()}</span>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-black py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface MainModalProps {
  status: CheckInStatus
  checkInTime?: string
  checkOutTime?: string
  liveTime: string
  onCheckIn: () => void
  onCheckOut: () => void
  onAbsent: () => void
  onClose: () => void
}

function MainModal({
  status,
  checkInTime,
  checkOutTime,
  liveTime,
  onCheckIn,
  onCheckOut,
  onAbsent,
  onClose,
}: MainModalProps) {
  const isCheckedOut = status === 'checked-out'

  return (
    <div className="absolute inset-0 z-40 flex items-end">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Đóng"
      />
      {/* Sheet */}
      <div className="relative w-full overflow-hidden rounded-t-3xl bg-white">
        {/* Top banner with live time */}
        <div className="flex items-start justify-between bg-black px-6 pb-5 pt-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
              Thời gian hiện tại
            </p>
            <p className="mt-1 text-4xl font-bold tabular-nums leading-none text-white">
              {liveTime.slice(0, 5)}
            </p>
            <p className="mt-1.5 text-xs text-gray-400">{getTodayLabel()}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Existing stamps if any */}
        {(checkInTime || checkOutTime) && (
          <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-3">
            {checkInTime && (
              <div className="flex items-center gap-1.5">
                <LogIn size={13} className="text-gray-500" />
                <span className="text-xs text-gray-600">Vào <span className="font-semibold text-black">{checkInTime}</span></span>
              </div>
            )}
            {checkOutTime && (
              <div className="flex items-center gap-1.5">
                <LogOut size={13} className="text-gray-500" />
                <span className="text-xs text-gray-600">Ra <span className="font-semibold text-black">{checkOutTime}</span></span>
              </div>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="px-6 py-5 space-y-3">
          {!isCheckedOut && (
            <>
              {status === 'none' && (
                <>
                  <button
                    onClick={onCheckIn}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
                  >
                    <LogIn size={16} strokeWidth={2.5} />
                    Điểm danh vào
                  </button>
                  <button
                    onClick={onAbsent}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Vắng mặt
                  </button>
                </>
              )}
              {status === 'checked-in' && (
                <button
                  onClick={onCheckOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-900"
                >
                  <LogOut size={16} strokeWidth={2.5} />
                  Điểm danh ra về
                </button>
              )}
            </>
          )}
          {isCheckedOut && (
            <div className="flex flex-col items-center gap-1 py-3">
              <CheckCheck size={24} className="text-black" />
              <p className="text-sm font-semibold text-black">Đã điểm danh đủ hôm nay</p>
              <p className="text-xs text-gray-500">
                Vào {checkInTime} · Ra {checkOutTime}
              </p>
            </div>
          )}
        </div>

        {/* Safe-area spacer */}
        <div className="h-2" />
      </div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-4 py-2 shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-2">
        <CheckCheck size={13} className="text-white" strokeWidth={2.5} />
        <span className="whitespace-nowrap text-xs font-semibold text-white">{message}</span>
      </div>
    </div>
  )
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function CheckInButton({ status, checkInTime, checkOutTime, onStatusChange }: CheckInButtonProps) {
  const [modal, setModal] = useState<'none' | 'main' | 'absent' | 'camera-in' | 'camera-out'>('none')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const liveTime = useLiveTime()

  const showToast = (message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const handleCameraConfirm = (time: string) => {
    if (modal === 'camera-in') {
      onStatusChange('checked-in', time)
      showToast('Điểm danh vào thành công')
    } else if (modal === 'camera-out') {
      onStatusChange('checked-out', checkInTime, time)
      showToast('Điểm danh ra về thành công')
    }
    setModal('none')
  }

  const handleAbsentConfirm = () => {
    onStatusChange('none')
    showToast('Đã xác nhận vắng mặt hôm nay')
    setModal('none')
  }

  return (
    <>
      {/* The trigger button */}
      <button
        onClick={() => setModal('main')}
        className="flex items-center transition-transform active:scale-95"
        aria-label="Điểm danh"
      >
        <CheckInIcon status={status} checkInTime={checkInTime} checkOutTime={checkOutTime} />
      </button>

      {/* Camera overlays — absolute inside the phone screen */}
      {(modal === 'camera-in' || modal === 'camera-out') && (
        <CameraOverlay
          mode={modal === 'camera-in' ? 'check-in' : 'check-out'}
          checkInTime={checkInTime}
          onConfirm={handleCameraConfirm}
          onCancel={() => setModal('main')}
        />
      )}

      {/* Absent confirmation sheet */}
      {modal === 'absent' && (
        <AbsentModal
          onConfirm={handleAbsentConfirm}
          onCancel={() => setModal('main')}
        />
      )}

      {/* Main bottom sheet */}
      {modal === 'main' && (
        <MainModal
          status={status}
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
          liveTime={liveTime}
          onCheckIn={() => setModal('camera-in')}
          onCheckOut={() => setModal('camera-out')}
          onAbsent={() => setModal('absent')}
          onClose={() => setModal('none')}
        />
      )}

      {/* Toast */}
      <Toast visible={toast.visible} message={toast.message} />
    </>
  )
}
