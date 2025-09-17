import { Wallet, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function WalletConnect() {
  const [copied, setCopied] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string>('')

  const connectWallet = async () => {
    try {
      // Basit MetaMask bağlantısı
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        }
      } else {
        alert('MetaMask bulunamadı! Lütfen MetaMask yükleyin.')
      }
    } catch (error) {
      console.error('Cüzdan bağlantı hatası:', error)
      alert('Cüzdan bağlantısı başarısız!')
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress('')
  }

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Adres kopyalama hatası:', error)
      }
    }
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          Cüzdan Bağla
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
        <Wallet className="w-5 h-5 text-cyan-400" />
        <span className="text-white font-medium">
          {address ? shortenAddress(address) : 'Connected'}
        </span>
        <button
          onClick={copyAddress}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
      <button
        onClick={disconnect}
        className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl border border-red-500/30 transition-colors"
      >
        <Wallet className="w-4 h-4" />
        Disconnect
      </button>
    </div>
  )
}

// TypeScript için window.ethereum tipi
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string }) => Promise<string[]>
    }
  }
}