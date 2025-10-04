import React from 'react'

// Basit Web3Provider - Web3Modal olmadan
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children)
}

// Basit config export
export const config = null