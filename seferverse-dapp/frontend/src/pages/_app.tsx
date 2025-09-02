import type { AppProps } from 'next/app'
import { Web3Provider } from '../lib/web3'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  )
}
