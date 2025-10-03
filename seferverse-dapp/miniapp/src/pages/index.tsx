import React, { useState, useEffect } from 'react'
import TelegramMiniApp from '../components/TelegramMiniApp'

// Mock data - gerçek uygulamada Web3 hooks kullanılacak
export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState<string>()
  const [tokenBalance, setTokenBalance] = useState('0')
  const [nftBalance, setNftBalance] = useState('0')
  const [isLoading, setIsLoading] = useState(false)

  // Telegram WebApp API entegrasyonu
  useEffect(() => {
    // Telegram WebApp API kontrolü
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp
      tg.ready()
      tg.expand()
      
      // Telegram kullanıcı bilgilerini al
      const user = tg.initDataUnsafe?.user
      if (user) {
        setUserAddress(`0x${user.id.toString().padStart(40, '0')}`) // Mock address
        setIsConnected(true)
      }
    }
  }, [])

  const handleMintNFT = async (quantity: number) => {
    setIsLoading(true)
    try {
      // Mock mint işlemi
      await new Promise(resolve => setTimeout(resolve, 2000))
      setNftBalance(prev => (parseInt(prev) + quantity).toString())
      
      // Telegram notification
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        (window as any).Telegram.WebApp.showAlert(`✅ ${quantity} NFT başarıyla mint edildi!`)
      }
    } catch (error) {
      console.error('Mint error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransferToken = async (to: string, amount: string) => {
    setIsLoading(true)
    try {
      // Mock transfer işlemi
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTokenBalance(prev => (parseFloat(prev) - parseFloat(amount)).toString())
      
      // Telegram notification
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        (window as any).Telegram.WebApp.showAlert(`✅ ${amount} BRT transfer edildi!`)
      }
    } catch (error) {
      console.error('Transfer error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TelegramMiniApp
      onMintNFT={handleMintNFT}
      onTransferToken={handleTransferToken}
      isConnected={isConnected}
      userAddress={userAddress}
      tokenBalance={tokenBalance}
      nftBalance={nftBalance}
      isLoading={isLoading}
    />
  )
}

