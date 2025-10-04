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
          className="bg-black border-2 border-cyan-500 hover:border-magenta-500 text-cyan-400 hover:text-magenta-400 font-bold py-3 px-8 rounded transition-all duration-200 transform hover:scale-105 flex items-center gap-3 font-mono uppercase"
          style={{
            boxShadow: '0 0 20px var(--neon-cyan), inset 0 0 20px rgba(0,255,255,0.1)',
            textShadow: '0 0 10px var(--neon-cyan)'
          }}
        >
          <Wallet className="w-5 h-5" />
          <span>CONNECT_WALLET</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-black/90 backdrop-blur-sm rounded px-4 py-2 border-2 border-green-500 font-mono" style={{boxShadow: '0 0 15px var(--neon-green), inset 0 0 15px rgba(0,255,65,0.1)'}}>
        <Wallet className="w-5 h-5 text-green-400" style={{filter: 'drop-shadow(0 0 5px var(--neon-green))'}} />
        <span className="text-green-400 font-bold" style={{textShadow: '0 0 10px var(--neon-green)'}}>
          {address ? shortenAddress(address) : 'CONNECTED'}
        </span>
        <button
          onClick={copyAddress}
          className="p-1 hover:bg-green-500/20 rounded transition-colors border border-green-500/50"
          title="Copy address"
          style={{boxShadow: '0 0 5px rgba(0,255,65,0.3)'}}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" style={{filter: 'drop-shadow(0 0 5px var(--neon-green))'}} />
          ) : (
            <Copy className="w-4 h-4 text-green-400/70" />
          )}
        </button>
      </div>
      <button
        onClick={disconnect}
        className="flex items-center gap-2 bg-black border-2 border-red-500 text-red-400 px-4 py-2 rounded hover:bg-red-500/10 transition-colors font-mono font-bold"
        style={{boxShadow: '0 0 10px rgba(255,0,0,0.5)', textShadow: '0 0 10px rgba(255,0,0,0.8)'}}
      >
        <Wallet className="w-4 h-4" />
        DISCONNECT
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