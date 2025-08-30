import '@unocss/reset/normalize.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function SeferApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
