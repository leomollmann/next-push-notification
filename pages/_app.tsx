import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

import '@/globals.css'

// Google fonts example 
const montserrat = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${montserrat.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  )
}
