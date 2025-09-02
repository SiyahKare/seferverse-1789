import { useAccount, useDisconnect } from 'wagmi'
import { Web3Button } from '@web3modal/wagmi/react'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="flex items-center gap-4">
        <Web3Button />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
        <Wallet className="w-4 h-4 text-cyan-400" />
        <span className="text-white text-sm font-medium">
          {shortenAddress(address!)}
        </span>
        <button
          onClick={copyAddress}
          className="p-1 hover:bg-white/10 rounded transition-colors"
          title="Adresi kopyala"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-400" />
          ) : (
            <Copy className="w-3 h-3 text-slate-400" />
          )}
        </button>
      </div>
      <button
        onClick={() => disconnect()}
        className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm rounded-xl px-4 py-2 border border-red-500/30 text-red-400 transition-colors"
        title="Bağlantıyı kes"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Çıkış</span>
      </button>
    </div>
  )
}
