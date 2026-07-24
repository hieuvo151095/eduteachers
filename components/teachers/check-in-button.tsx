'use client'

import { useState, useRef } from 'react'
import { X } from 'lucide-react'

export type CheckInStatus = 'none' | 'checked-in' | 'checked-out'

interface CheckInButtonProps {
  status: CheckInStatus
  checkInTime?: string
  checkOutTime?: string
  onStatusChange: (status: CheckInStatus, checkInTime?: string, checkOutTime?: string) => void
}

export function CheckInButton({ status, checkInTime, checkOutTime, onStatusChange }: CheckInButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [showConfirmAbsent, setShowConfirmAbsent] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  const getTodayDate = () => {
    const now = new Date()
    return now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const startCamera = async () => {
    setShowCamera(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Camera access denied:', error)
      setShowCamera(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0)
      }
    }
    stopCamera()

    if (status === 'none') {
      const time = getCurrentTime()
      onStatusChange('checked-in', time)
      setToastMessage('Điểm danh vào thành công')
    } else if (status === 'checked-in') {
      const time = getCurrentTime()
      onStatusChange('checked-out', checkInTime, time)
      setToastMessage('Điểm danh ra về thành công')
    }

    setShowToast(true)
    setShowModal(false)
    setTimeout(() => setShowToast(false), 3000)
  }

  const handleMarkAbsent = () => {
    onStatusChange('none')
    setToastMessage('Đã xác nhận vắng mặt')
    setShowToast(true)
    setShowModal(false)
    setShowConfirmAbsent(false)
    setTimeout(() => setShowToast(false), 3000)
  }

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="rounded-lg bg-white p-4 w-[340px]">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <canvas ref={canvasRef} className="hidden" width={640} height={480} />
          <div className="flex gap-2">
            <button
              onClick={stopCamera}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Huỷ
            </button>
            <button
              onClick={capturePhoto}
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showModal) {
    return (
      <>
        {/* Modal backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => {
            setShowModal(false)
            setShowConfirmAbsent(false)
          }}
        />

        {/* Confirm absent modal */}
        {showConfirmAbsent && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="relative w-full max-w-sm rounded-lg bg-white p-6">
              <button
                onClick={() => setShowConfirmAbsent(false)}
                className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center"
              >
                <X size={18} className="text-gray-500" />
              </button>
              <p className="text-sm text-gray-700 mb-6">
                Bạn vui lòng xác nhận vắng mặt hôm nay ngày {getTodayDate()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmAbsent(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleMarkAbsent}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main check-in modal */}
        {!showConfirmAbsent && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="relative w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white overflow-hidden">
              {/* Header with timestamp */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium">Thời gian hiện tại</p>
                  <p className="text-lg font-bold text-black">{getCurrentTime()}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex h-8 w-8 items-center justify-center hover:bg-gray-200 rounded-full"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 space-y-3">
                {status === 'none' && (
                  <>
                    <button
                      onClick={startCamera}
                      className="w-full px-4 py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Điểm danh vào
                    </button>
                    <button
                      onClick={() => setShowConfirmAbsent(true)}
                      className="w-full px-4 py-3 border border-gray-300 text-black rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Vắng mặt
                    </button>
                  </>
                )}
                {status === 'checked-in' && (
                  <button
                    onClick={startCamera}
                    className="w-full px-4 py-3 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Điểm danh ra về
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <button
      onClick={() => setShowModal(true)}
      className="relative flex h-8 w-8 items-center justify-center"
      title={status === 'none' ? 'Điểm danh vào' : status === 'checked-in' ? 'Điểm danh ra về' : 'Đã điểm danh'}
    >
      {status === 'none' && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
      )}
      {status === 'checked-in' && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )}
      {status === 'checked-out' && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 12l2 2 4-4m7.538-4.3a9 9 0 0 0-5.216-1.7H12a9 9 0 0 0 0 18h.538a9 9 0 0 0 5.216-1.7M9 21h9a9 9 0 0 0 9-9V6a9 9 0 0 0-9-9H9a9 9 0 0 0-9 9v9a9 9 0 0 0 9 9z" />
        </svg>
      )}
    </button>
  )
}
