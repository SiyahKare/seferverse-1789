import React from 'react'
import { useSeferVerseDAO, useBaronToken, useBaronNFT } from '../hooks/useContracts'
import { useAccount } from 'wagmi'
import { Building2, Coins, Image, TrendingUp, Users, Activity, Loader2 } from 'lucide-react'

export default function AnalyticsDashboard() {
  const { isConnected } = useAccount()
  const { daoName, isLoadingName } = useSeferVerseDAO()
  const { totalSupply, balance, isLoadingSupply } = useBaronToken()
  const { totalSupply: nftTotalSupply, nftBalance, isLoadingSupply: isLoadingNFT } = useBaronNFT()

  if (!isConnected) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Analytics Dashboard</h3>
          <p className="text-slate-400">Detaylı istatistikleri görmek için cüzdanınızı bağlayın</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: 'DAO Adı',
      value: isLoadingName ? <Loader2 className="w-4 h-4 animate-spin" /> : daoName || 'Yükleniyor...',
      icon: Building2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30'
    },
    {
      title: 'Token Supply',
      value: isLoadingSupply ? <Loader2 className="w-4 h-4 animate-spin" /> : `${totalSupply} BRT`,
      icon: Coins,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      title: 'Token Balance',
      value: isLoadingSupply ? <Loader2 className="w-4 h-4 animate-spin" /> : `${balance} BRT`,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'NFT Supply',
      value: isLoadingNFT ? <Loader2 className="w-4 h-4 animate-spin" /> : `${nftTotalSupply} NFT`,
      icon: Image,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30'
    },
    {
      title: 'NFT Balance',
      value: isLoadingNFT ? <Loader2 className="w-4 h-4 animate-spin" /> : `${nftBalance} NFT`,
      icon: Users,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    }
  ]

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-6 h-6 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">📊 Analytics Dashboard</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <h4 className="text-slate-300 text-sm font-medium">{stat.title}</h4>
              </div>
              <div className={`${stat.color} font-bold text-lg`}>
                {stat.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Analytics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-slate-300 text-sm font-medium mb-3">Token Dağılımı</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Toplam Supply</span>
              <span className="text-white">{totalSupply} BRT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sahip Olduğun</span>
              <span className="text-white">{balance} BRT</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${totalSupply && balance ? (parseFloat(balance) / parseFloat(totalSupply)) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h4 className="text-slate-300 text-sm font-medium mb-3">NFT Koleksiyonu</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Toplam NFT</span>
              <span className="text-white">{nftTotalSupply} NFT</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sahip Olduğun</span>
              <span className="text-white">{nftBalance} NFT</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${nftTotalSupply && nftBalance ? (parseInt(nftBalance) / parseInt(nftTotalSupply)) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-4 border border-cyan-500/20">
        <h4 className="text-slate-300 text-sm font-medium mb-3">🚀 Performans Metrikleri</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-cyan-400">99.9%</div>
            <div className="text-xs text-slate-400">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">&lt;1s</div>
            <div className="text-xs text-slate-400">Response Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">Base</div>
            <div className="text-xs text-slate-400">Network</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-400">L2</div>
            <div className="text-xs text-slate-400">Layer</div>
          </div>
        </div>
      </div>
    </div>
  )
}

