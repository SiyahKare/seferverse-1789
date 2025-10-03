import React from 'react'
import { usePWA } from '../hooks/usePWA'
import { Download, Share2, Wifi, WifiOff, Smartphone } from 'lucide-react'

export default function PWAInstall() {
  const { isInstallable, isInstalled, isOnline, installApp, shareApp } = usePWA()

  if (isInstalled) {
    return (
      <div className="fixed bottom-4 left-4 bg-green-500/20 backdrop-blur-sm rounded-xl px-4 py-3 border border-green-500/30 text-green-400 shadow-lg">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-medium">Uygulama Yüklendi</span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 space-y-2">
      {/* Install Button */}
      {isInstallable && (
        <button
          onClick={installApp}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Uygulamayı Yükle</span>
        </button>
      )}

      {/* Share Button */}
      <button
        onClick={shareApp}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl px-4 py-3 text-white transition-colors"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm">Paylaş</span>
      </button>

      {/* Online Status */}
      <div className={`flex items-center gap-2 backdrop-blur-sm rounded-xl px-4 py-3 border shadow-lg ${
        isOnline 
          ? 'bg-green-500/20 border-green-500/30 text-green-400' 
          : 'bg-red-500/20 border-red-500/30 text-red-400'
      }`}>
        {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        <span className="text-sm font-medium">
          {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
        </span>
      </div>
    </div>
  )
}

