import React, { useState, useEffect } from 'react'
import { Wallet, Coins, Image, Send, Loader2 } from 'lucide-react'

interface TelegramMiniAppProps {
  onMintNFT: (quantity: number) => void
  onTransferToken: (to: string, amount: string) => void
  isConnected: boolean
  userAddress?: string
  tokenBalance: string
  nftBalance: string
  isLoading: boolean
}

export default function TelegramMiniApp({
  onMintNFT,
  onTransferToken,
  isConnected,
  userAddress,
  tokenBalance,
  nftBalance,
  isLoading
}: TelegramMiniAppProps) {
  const [mintQuantity, setMintQuantity] = useState(1)
  const [transferAmount, setTransferAmount] = useState('')
  const [transferTo, setTransferTo] = useState('')
  const [activeTab, setActiveTab] = useState<'mint' | 'transfer'>('mint')

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-md mx-auto">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">🌌 SeferVerse 1789</h1>
            <p className="text-slate-300 mb-6">Baron Devrimi - Web3 + NFT + Token</p>
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl">
              Cüzdan Bağla
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-white mb-2">🌌 SeferVerse 1789</h1>
          <div className="flex items-center justify-center gap-2 text-slate-300">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">{shortenAddress(userAddress!)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 text-xs">Token</span>
            </div>
            <div className="text-white font-bold">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${tokenBalance} BRT`}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-pink-400" />
              <span className="text-slate-400 text-xs">NFT</span>
            </div>
            <div className="text-white font-bold">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : `${nftBalance} NFT`}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('mint')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'mint'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'text-slate-400'
            }`}
          >
            NFT Mint
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'transfer'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                : 'text-slate-400'
            }`}
          >
            Token Transfer
          </button>
        </div>

        {/* Mint Tab */}
        {activeTab === 'mint' && (
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Image className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Baron Trilogy Audio NFT</h3>
                <p className="text-slate-300 text-sm">Özel müzik koleksiyonu</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Miktar</label>
                  <select
                    value={mintQuantity}
                    onChange={(e) => setMintQuantity(parseInt(e.target.value))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => onMintNFT(mintQuantity)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  {mintQuantity} NFT Mint Et
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Tab */}
        {activeTab === 'transfer' && (
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Token Transfer</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Alıcı Adresi</label>
                  <input
                    type="text"
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="0x..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm font-medium mb-2 block">Miktar (BRT)</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <button
                  onClick={() => onTransferToken(transferTo, transferAmount)}
                  disabled={!transferTo || !transferAmount}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Transfer Et
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-xs text-slate-400">
            Baron Devrimi • Base Network • Telegram MiniApp
          </p>
        </div>
      </div>
    </div>
  )
}
