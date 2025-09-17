import { useState, useEffect } from 'react'
import { Deployment } from '../lib/api'

interface ContractAddresses {
  seferVerseDAO: string
  baronToken: string
  baronNFT: string
  seferVerse: string
}

export function useContractAddresses() {
  const [addresses, setAddresses] = useState<ContractAddresses>({
    seferVerseDAO: process.env.NEXT_PUBLIC_SEFER_VERSE_DAO_ADDRESS || '',
    baronToken: process.env.NEXT_PUBLIC_BARON_TOKEN_ADDRESS || '',
    baronNFT: process.env.NEXT_PUBLIC_BARON_NFT_ADDRESS || '',
    seferVerse: process.env.NEXT_PUBLIC_SEFER_VERSE_ADDRESS || ''
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await fetch('/api/deployments')
        if (response.ok) {
          const deployments: Record<string, Record<string, Deployment>> = await response.json()
          
          // Base Sepolia'dan adresleri al
          const baseSepolia = deployments.baseSepolia || {}
          
          setAddresses(prev => ({
            seferVerseDAO: baseSepolia.SeferVerseDAO?.address || prev.seferVerseDAO,
            baronToken: baseSepolia.BaronTokenVotes?.address || prev.baronToken,
            baronNFT: baseSepolia.BaronNFT?.address || prev.baronNFT,
            seferVerse: baseSepolia.SeferVerse?.address || prev.seferVerse
          }))
        }
      } catch (error) {
        console.warn('Failed to load contract addresses from deployments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAddresses()
  }, [])

  return { addresses, isLoading }
}
