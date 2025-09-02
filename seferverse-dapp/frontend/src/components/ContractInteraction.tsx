import { useState } from 'react'
import { useSeferVerseDAO, useBaronToken } from '../hooks/useContracts'
import { useAccount } from 'wagmi'
import { Building2, Coins, Edit3, Send, Loader2 } from 'lucide-react'
import { parseEther } from 'viem'

export default function ContractInteraction() {
  const { isConnected } = useAccount()
  const { daoName, isLoadingName, setName, isSettingName, setNameSuccess } = useSeferVerseDAO()
  const { totalSupply, balance, isLoadingSupply, transfer, isTransferring, transferSuccess } = useBaronToken()
  
  const [newDaoName, setNewDaoName] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')

  const handleSetName = () => {
    if (newDaoName.trim()) {
      setName?.({ args: [newDaoName.trim()] })
      setNewDaoName('')
    }
  }

  const handleTransfer = () => {
    if (transferAmount && transferTo && transfer) {
      try {
        const amount = parseEther(transferAmount)
        transfer({ args: [transferTo as `0x${string}`, amount] })
      } catch (error) {
        console.error('Transfer error:', error)
      }
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">Kontrat Etkileşimi</h3>
          <p className="text-slate-400">Kontratlarla etkileşim kurmak için cüzdanınızı bağlayın</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* DAO Kontratı */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">SeferVerse DAO</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">DAO Adı:</span>
            <span className="text-white font-medium">
              {isLoadingName ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                daoName || 'Yükleniyor...'
              )}
            </span>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newDaoName}
              onChange={(e) => setNewDaoName(e.target.value)}
              placeholder="Yeni DAO adı..."
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={handleSetName}
              disabled={!newDaoName.trim() || isSettingName}
              className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-400 transition-colors"
            >
              {isSettingName ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Edit3 className="w-4 h-4" />
              )}
              Güncelle
            </button>
          </div>
          
          {setNameSuccess && (
            <div className="text-green-400 text-sm">✅ DAO adı başarıyla güncellendi!</div>
          )}
        </div>
      </div>

      {/* Token Kontratı */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Coins className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Baron Token (BRT)</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-slate-400 text-sm">Toplam Supply</div>
              <div className="text-white font-medium">
                {isLoadingSupply ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `${totalSupply} BRT`
                )}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-slate-400 text-sm">Bakiye</div>
              <div className="text-white font-medium">
                {isLoadingSupply ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  `${balance} BRT`
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              placeholder="Alıcı adresi (0x...)"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Miktar"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleTransfer}
                disabled={!transferAmount || !transferTo || isTransferring}
                className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500/30 rounded-lg px-4 py-2 text-purple-400 transition-colors"
              >
                {isTransferring ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Gönder
              </button>
            </div>
          </div>
          
          {transferSuccess && (
            <div className="text-green-400 text-sm">✅ Transfer başarıyla tamamlandı!</div>
          )}
        </div>
      </div>
    </div>
  )
}
