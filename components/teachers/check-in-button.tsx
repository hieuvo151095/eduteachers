'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, LogIn, LogOut, History, Camera } from 'lucide-react'

export type CheckInStatus = 'none' | 'checked-in' | 'checked-out' | 'absent'

interface CheckInButtonProps {
  status: CheckInStatus
  checkInTime?: string
  checkOutTime?: string
  onStatusChange: (status: CheckInStatus, checkInTime?: string, checkOutTime?: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useLiveTime() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  )
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function getHHMM() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function getTodayFull() {
  return new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getTodayShort() {
  return new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ─── Trigger Icon ─────────────────────────────────────────────────────────────
// none        → LogIn  (border circle, idle)
// checked-in  → LogOut (filled black circle, CTA to check out)
// checked-out → History (border circle, view record)
// absent      → History (border circle, view absence note)

function TriggerIcon({ status }: { status: CheckInStatus }) {
  const base = 'flex h-8 w-8 items-center justify-center rounded-full transition-colors active:scale-95'
  if (status === 'none') {
    return (
      <div className={`${base} border border-gray-300 bg-white hover:bg-gray-50`}>
        <LogIn size={15} className="text-black" strokeWidth={2} />
      </div>
    )
  }
  if (status === 'checked-in') {
    return (
      <div className={`${base} bg-black hover:bg-gray-900`}>
        <LogOut size={15} className="text-white" strokeWidth={2} />
      </div>
    )
  }
  // checked-out or absent → History
  return (
    <div className={`${base} border border-gray-300 bg-white hover:bg-gray-50`}>
      <History size={15} className="text-black" strokeWidth={2} />
    </div>
  )
}

// ─── Camera Screen ────────────────────────────────────────────────────────────

interface CameraScreenProps {
  mode: 'check-in' | 'check-out'
  checkInTime?: string
  onConfirm: (time: string) => void
  onCancel: () => void
}

function CameraScreen({ mode, checkInTime, onConfirm, onCancel }: CameraScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [cameraError, setCameraError] = useState(false)
  const [captured, setCaptured] = useState(false)
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const liveTime = useLiveTime()
  const capturedTime = useRef<string>('')

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((s) => {
        streamRef.current = s
        if (videoRef.current) videoRef.current.srcObject = s
        setStreaming(true)
      })
      .catch(() => setCameraError(true))
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth || 300
    canvas.height = video.videoHeight || 400
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
      ctx.restore()
    }
    capturedTime.current = getHHMM()
    setCapturedDataUrl(canvas.toDataURL('image/jpeg', 0.85))
    setCaptured(true)
    // stop camera after capture
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }, [])

  const handleConfirm = () => {
    onConfirm(capturedTime.current || getHHMM())
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-5 pt-4 pb-3">
        <p className="text-sm font-bold text-white">
          {mode === 'check-in' ? 'Điểm danh vào' : 'Điểm danh ra về'}
        </p>
        {mode === 'check-out' && checkInTime && (
          <span className="text-xs text-gray-400">Vào lúc {checkInTime}</span>
        )}
      </div>

      {/* Viewfinder / Preview */}
      <div className="relative mx-5 flex-1 overflow-hidden rounded-2xl bg-gray-900">
        {cameraError && !captured && (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <Camera size={40} className="text-gray-500" />
            <p className="text-sm text-gray-400">Không truy cập được camera.</p>
          </div>
        )}

        {/* Live video — hidden once captured */}
        {!cameraError && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full object-cover ${captured ? 'hidden' : 'block'}`}
            style={{ transform: 'scaleX(-1)' }}
          />
        )}

        {/* Canvas capture target (always rendered, invisible) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Captured preview */}
        {captured && capturedDataUrl && (
          <img
            src={capturedDataUrl}
            alt="Captured"
            className="h-full w-full object-cover"
          />
        )}

        {/* Oval face guide — only while live */}
        {streaming && !captured && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border-2 border-white/50" style={{ width: 148, height: 188 }} />
          </div>
        )}

        {/* "Ảnh đã chụp" badge — appears after capture */}
        {captured && (
          <div className="absolute inset-x-0 bottom-14 flex justify-center">
            <span className="rounded-full bg-black/60 px-4 py-1.5 text-xs font-semibold text-white">
              Ảnh đã chụp
            </span>
          </div>
        )}

        {/* Live clock */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1">
          <span className="text-xs font-semibold tabular-nums text-white">
            {captured ? capturedTime.current : liveTime.slice(0, 5)}
          </span>
        </div>
      </div>

      {/* Bottom CTA row */}
      <div className="shrink-0 px-5 py-5">
        {/* Shutter button — shown before capture */}
        {!captured && !cameraError && (
          <div className="flex items-center justify-center pb-1">
            <button
              onClick={handleCapture}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20 transition-transform active:scale-95"
            >
              <div className="h-12 w-12 rounded-full bg-white" />
            </button>
          </div>
        )}

        {/* Huỷ / Xác nhận — shown after capture (or on camera error) */}
        {(captured || cameraError) && (
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border border-gray-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Huỷ
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
            >
              Xác nhận
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Absent Confirmation Sheet ────────────────────────────────────────────────

interface AbsentSheetProps {
  onConfirm: () => void
  onCancel: () => void
}

function AbsentSheet({ onConfirm, onCancel }: AbsentSheetProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button className="absolute inset-0 bg-black/40" onClick={onCancel} aria-label="Đóng" />
      <div className="relative w-full rounded-t-3xl bg-white px-6 pt-5 pb-8">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
        >
          <X size={16} className="text-gray-600" />
        </button>
        <h3 className="mb-2 text-base font-bold text-black">Xác nhận vắng mặt</h3>
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          Bạn vui lòng xác nhận vắng mặt hôm nay{' '}
          <span className="font-semibold text-black">{getTodayFull()}</span>.
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

// ─── Main Bottom Sheet ────────────────────────────────────────────────────────

type ModalState = 'none' | 'main' | 'absent' | 'camera-in' | 'camera-out'

interface MainSheetProps {
  status: CheckInStatus
  checkInTime?: string
  checkOutTime?: string
  liveTime: string
  onCheckIn: () => void
  onCheckOut: () => void
  onAbsent: () => void
  onClose: () => void
}

function MainSheet({
  status,
  checkInTime,
  checkOutTime,
  liveTime,
  onCheckIn,
  onCheckOut,
  onAbsent,
  onClose,
}: MainSheetProps) {
  // ── History view: checked-out ──────────────────────────────────────────────
  if (status === 'checked-out') {
    return (
      <div className="absolute inset-0 z-40 flex items-end">
        <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Đóng" />
        <div className="relative w-full rounded-t-3xl bg-white px-6 pt-5 pb-8">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <X size={16} className="text-gray-600" />
          </button>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Lịch sử hôm nay
          </p>

          {/* Date row */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-bold text-black">{getTodayShort()}</span>
          </div>

          {/* Time rows */}
          <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Giờ vào</span>
              <span className="text-sm font-bold text-black">{checkInTime ?? '—'}</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Giờ ra</span>
              <span className="text-sm font-bold text-black">{checkOutTime ?? '—'}</span>
            </div>
          </div>

          {/* Reset note */}
          <p className="mt-4 text-xs leading-relaxed text-gray-400">
            Thông tin sẽ được cập nhật mới vào 00:00 ngày tiếp theo.
          </p>
        </div>
      </div>
    )
  }

  // ── History view: absent ───────────────────────────────────────────────────
  if (status === 'absent') {
    return (
      <div className="absolute inset-0 z-40 flex items-end">
        <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Đóng" />
        <div className="relative w-full rounded-t-3xl bg-white px-6 pt-5 pb-8">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-200" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <X size={16} className="text-gray-600" />
          </button>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Lịch sử hôm nay
          </p>

          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-bold text-black">{getTodayShort()}</span>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
            <p className="text-sm text-gray-700">
              Bạn đã xác nhận vắng mặt hôm nay.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Action view: none (check-in) or checked-in (check-out) ────────────────
  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Đóng" />
      <div className="relative w-full overflow-hidden rounded-t-3xl bg-white">
        {/* Black banner */}
        <div className="flex items-start justify-between bg-black px-6 pb-6 pt-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Thời gian hiện tại
            </p>
            <p className="mt-1 font-mono text-4xl font-bold tabular-nums leading-none text-white">
              {liveTime.slice(0, 5)}
            </p>
            <p className="mt-1.5 text-xs text-gray-400">{getTodayFull()}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* CTAs */}
        <div className="space-y-3 px-6 py-5 pb-8">
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
        </div>
      </div>
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-4 py-2 shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <span className="whitespace-nowrap text-xs font-semibold text-white">{message}</span>
    </div>
  )
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export function CheckInButton({ status, checkInTime, checkOutTime, onStatusChange }: CheckInButtonProps) {
  const [modal, setModal] = useState<ModalState>('none')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const liveTime = useLiveTime()

  const showToast = (message: string) => {
    setToast({ visible: true, message })
    setTimeout(() => setToast({ visible: false, message: '' }), 3000)
  }

  const handleCameraConfirm = (time: string) => {
    if (modal === 'camera-in') {
      onStatusChange('checked-in', time, checkOutTime)
      showToast('Điểm danh vào thành công')
    } else if (modal === 'camera-out') {
      onStatusChange('checked-out', checkInTime, time)
      showToast('Điểm danh ra về thành công')
    }
    setModal('none')
  }

  const handleAbsentConfirm = () => {
    onStatusChange('absent', undefined, undefined)
    showToast('Đã xác nhận vắng mặt hôm nay')
    setModal('none')
  }

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setModal('main')}
        className="flex items-center transition-transform active:scale-95"
        aria-label="Điểm danh"
      >
        <TriggerIcon status={status} />
      </button>

      {/* Camera screen */}
      {(modal === 'camera-in' || modal === 'camera-out') && (
        <CameraScreen
          mode={modal === 'camera-in' ? 'check-in' : 'check-out'}
          checkInTime={checkInTime}
          onConfirm={handleCameraConfirm}
          onCancel={() => setModal('main')}
        />
      )}

      {/* Absent confirmation sheet */}
      {modal === 'absent' && (
        <AbsentSheet
          onConfirm={handleAbsentConfirm}
          onCancel={() => setModal('main')}
        />
      )}

      {/* Main bottom sheet */}
      {modal === 'main' && (
        <MainSheet
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
