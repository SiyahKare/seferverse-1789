import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Web3Provider } from '../lib/web3'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SeferVerse 1789 - Baron Devrimi</title>
        <meta name="description" content="Web3 + NFT + Token + Müzik + Tribe - Baron Devrimi" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00ffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SeferVerse" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
      {/* Open Graph */}
      <meta property="og:title" content="SeferVerse 1789 - Baron Devrimi" />
      <meta property="og:description" content="Web3 + NFT + Token + Müzik + Tribe" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="SeferVerse 1789 - Baron Devrimi" />
      <meta name="twitter:description" content="Web3 + NFT + Token + Müzik + Tribe" />
      </Head>
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </>
  )
}
