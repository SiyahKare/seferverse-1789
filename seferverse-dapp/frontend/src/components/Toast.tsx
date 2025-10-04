import { useEffect, useState } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastItem({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, 5000)
    return () => clearTimeout(timer)
  }, [toast.id, onClose])

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }

  const colors = {
    success: 'border-green-500 bg-green-500/10',
    error: 'border-red-500 bg-red-500/10',
    warning: 'border-yellow-500 bg-yellow-500/10',
    info: 'border-cyan-500 bg-cyan-500/10'
  }

  const glowColors = {
    success: '0 0 20px var(--neon-green)',
    error: '0 0 20px rgba(255,0,0,0.5)',
    warning: '0 0 20px var(--neon-yellow)',
    info: '0 0 20px var(--neon-cyan)'
  }

  return (
    <div 
      className={`${colors[toast.type]} animate-slide-in-left mb-3 rounded-lg border-2 p-4 backdrop-blur-xl relative overflow-hidden`}
      style={{ boxShadow: glowColors[toast.type] }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icons[toast.type]}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold font-mono text-white">{toast.message}</p>
          {toast.description && (
            <p className="text-xs text-white/70 mt-1 font-mono">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="text-white/50 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/30 animate-shrink" style={{ width: '100%', animation: 'shrink 5s linear' }} />
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-[60] w-full max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  )
}

// Global counter for unique toast IDs
let toastCounter = 0

// Custom hook for toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (type: Toast['type'], message: string, description?: string) => {
    // Combine timestamp with counter for truly unique IDs
    const id = `${Date.now()}-${++toastCounter}`
    setToasts(prev => [...prev, { id, type, message, description }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const success = (message: string, description?: string) => addToast('success', message, description)
  const error = (message: string, description?: string) => addToast('error', message, description)
  const warning = (message: string, description?: string) => addToast('warning', message, description)
  const info = (message: string, description?: string) => addToast('info', message, description)

  return { toasts, removeToast, success, error, warning, info }
}
