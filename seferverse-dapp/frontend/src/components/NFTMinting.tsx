import { useState } from 'react'
import { useBaronNFT } from '../hooks/useContracts'
import { useAccount } from 'wagmi'
import { Image, Coins, Loader2, Sparkles } from 'lucide-react'

export default function NFTMinting() {
  const { isConnected, address } = useAccount()
  const { totalSupply, nftBalance, isLoadingSupply, mint, isMinting, mintSuccess } = useBaronNFT()
  const [mintQuantity, setMintQuantity] = useState('1')

  const handleMint = () => {
    if (mintQuantity && mint) {
      try {
        const quantity = parseInt(mintQuantity)
        if (quantity > 0 && quantity <= 10) { // Maksimum 10 NFT
          mint({ args: [address!, BigInt(quantity)] })
        }
      } catch (error) {
        console.error('Mint error:', error)
      }
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="text-center py-8">
          <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">NFT Minting</h3>
          <p className="text-slate-400">NFT mint etmek için cüzdanınızı bağlayın</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Image className="w-6 h-6 text-pink-400" />
        <h3 className="text-lg font-semibold text-white">Baron Trilogy Audio NFT</h3>
      </div>
      
      <div className="space-y-6">
        {/* NFT Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-pink-400" />
              <span className="text-slate-400 text-sm">Toplam Supply</span>
            </div>
            <div className="text-white font-bold text-xl">
              {isLoadingSupply ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                totalSupply
              )}
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400 text-sm">Sahip Olduğun</span>
            </div>
            <div className="text-white font-bold text-xl">
              {isLoadingSupply ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                nftBalance
              )}
            </div>
          </div>
        </div>

        {/* NFT Preview */}
        <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Image className="w-16 h-16 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Baron Trilogy Audio NFT</h4>
            <p className="text-slate-300 text-sm mb-4">
              Özel müzik koleksiyonu - Baron devriminin sesi
            </p>
            <div className="text-xs text-slate-400">
              ERC721A • Base Network • Audio Collection
            </div>
          </div>
        </div>

        {/* Minting Interface */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-slate-300 text-sm font-medium">Miktar:</label>
            <select
              value={mintQuantity}
              onChange={(e) => setMintQuantity(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num.toString()}>{num}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleMint}
            disabled={isMinting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            {isMinting ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Minting...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                {mintQuantity} NFT Mint Et
              </div>
            )}
          </button>
          
          {mintSuccess && (
            <div className="text-center py-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-medium">✅ NFT başarıyla mint edildi!</div>
              <div className="text-green-300 text-sm mt-1">Cüzdanınızı kontrol edin</div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-xs text-slate-400 text-center">
          <p>• Her NFT benzersiz audio içeriği içerir</p>
          <p>• Gas ücretleri Base network'te düşüktür</p>
          <p>• Maksimum 10 NFT tek seferde mint edebilirsiniz</p>
        </div>
      </div>
    </div>
  )
}
