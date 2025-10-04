import React from 'react'

// Basit Web3Provider - Web3Modal olmadan
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// Basit config export
export const config = null