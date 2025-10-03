import React, { useState, useEffect } from 'react'
import { useBaronNFT } from '../hooks/useContracts'
import { useAccount } from 'wagmi'
import { 
  Image, 
  ExternalLink, 
  Copy, 
  Check, 
  Heart, 
  Share2, 
  Loader2,
  Grid3X3,
  List,
  Filter,
  Search
} from 'lucide-react'

interface NFTMetadata {
  id: number
  name: string
  description: string
  image: string
  audio?: string
  attributes: Array<{
    trait_type: string
    value: string
  }>
  owner: string
  rarity?: string
}

export default function NFTGallery() {
  const { isConnected, address } = useAccount()
  const { nftBalance, isLoadingBalance } = useBaronNFT()
  const [nfts, setNfts] = useState<NFTMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedNFT, setSelectedNFT] = useState<NFTMetadata | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isConnected && address) {
      loadUserNFTs()
    }
  }, [isConnected, address])

  const loadUserNFTs = async () => {
    setIsLoading(true)
    try {
      // Mock NFT data - gerçek uygulamada IPFS'den metadata çekilecek
      const mockNFTs: NFTMetadata[] = [
        {
          id: 1,
          name: "Baron Trilogy #001",
          description: "The first piece of the Baron Trilogy - a revolutionary audio NFT collection",
          image: "https://via.placeholder.com/400x400/8B5CF6/FFFFFF?text=Baron+001",
          audio: "https://example.com/audio1.mp3",
          attributes: [
            { trait_type: "Rarity", value: "Legendary" },
            { trait_type: "Genre", value: "Electronic" },
            { trait_type: "Duration", value: "3:45" },
            { trait_type: "BPM", value: "128" }
          ],
          owner: address!,
          rarity: "Legendary"
        },
        {
          id: 2,
          name: "Baron Trilogy #002",
          description: "The second piece of the Baron Trilogy - capturing the essence of revolution",
          image: "https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Baron+002",
          audio: "https://example.com/audio2.mp3",
          attributes: [
            { trait_type: "Rarity", value: "Epic" },
            { trait_type: "Genre", value: "Ambient" },
            { trait_type: "Duration", value: "4:12" },
            { trait_type: "BPM", value: "90" }
          ],
          owner: address!,
          rarity: "Epic"
        },
        {
          id: 3,
          name: "Baron Trilogy #003",
          description: "The final piece of the Baron Trilogy - the culmination of the revolution",
          image: "https://via.placeholder.com/400x400/10B981/FFFFFF?text=Baron+003",
          audio: "https://example.com/audio3.mp3",
          attributes: [
            { trait_type: "Rarity", value: "Rare" },
            { trait_type: "Genre", value: "Orchestral" },
            { trait_type: "Duration", value: "5:30" },
            { trait_type: "BPM", value: "120" }
          ],
          owner: address!,
          rarity: "Rare"
        }
      ]
      
      setNfts(mockNFTs.slice(0, parseInt(nftBalance) || 0))
    } catch (error) {
      console.error('Error loading NFTs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'Epic': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'Rare': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'Common': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="text-center py-8">
          <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">NFT Gallery</h3>
          <p className="text-slate-400">NFT koleksiyonunuzu görmek için cüzdanınızı bağlayın</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6 text-pink-400" />
          <h3 className="text-lg font-semibold text-white">🖼️ NFT Gallery</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-pink-500/20 text-pink-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-pink-500/20 text-pink-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-pink-400">
            {isLoadingBalance ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : nftBalance}
          </div>
          <div className="text-slate-400 text-sm">Sahip Olduğun</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {nfts.filter(nft => nft.rarity === 'Legendary').length}
          </div>
          <div className="text-slate-400 text-sm">Legendary</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {nfts.filter(nft => nft.rarity === 'Epic').length}
          </div>
          <div className="text-slate-400 text-sm">Epic</div>
        </div>
      </div>

      {/* NFT Grid/List */}
      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-pink-400 mx-auto mb-4" />
          <p className="text-slate-400">NFT'ler yükleniyor...</p>
        </div>
      ) : nfts.length === 0 ? (
        <div className="text-center py-8">
          <Image className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-slate-300 mb-2">Henüz NFT Yok</h4>
          <p className="text-slate-400">İlk NFT'nizi mint etmek için yukarıdaki bölümü kullanın</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {nfts.map((nft) => (
            <div
              key={nft.id}
              className={`bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              onClick={() => setSelectedNFT(nft)}
            >
              <div className={`${viewMode === 'list' ? 'w-32 h-32' : 'aspect-square'} relative`}>
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getRarityColor(nft.rarity || 'Common')}`}>
                    {nft.rarity}
                  </div>
                </div>
              </div>
              
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h4 className="text-white font-semibold mb-2">{nft.name}</h4>
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">{nft.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    #{nft.id.toString().padStart(3, '0')}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(nft.id.toString())
                      }}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{selectedNFT.name}</h3>
                <button
                  onClick={() => setSelectedNFT(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedNFT.image}
                    alt={selectedNFT.name}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Açıklama</h4>
                    <p className="text-slate-300 text-sm">{selectedNFT.description}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Özellikler</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.attributes.map((attr, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-2">
                          <div className="text-xs text-slate-400">{attr.trait_type}</div>
                          <div className="text-white text-sm font-medium">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 rounded-lg px-4 py-2 text-pink-400 transition-colors">
                      <Heart className="w-4 h-4 inline mr-2" />
                      Favorile
                    </button>
                    <button className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-400 transition-colors">
                      <Share2 className="w-4 h-4 inline mr-2" />
                      Paylaş
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

