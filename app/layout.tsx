import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

// Satoshi для основного текста (используем Inter как замену)
// Satoshi - премиальный шрифт от PangramPangram, Inter - бесплатная альтернатива с похожим стилем
// Для использования оригинального Satoshi нужна коммерческая лицензия
const satoshi = Inter({ 
  subsets: ['latin'], 
  variable: '--font-satoshi',
  weight: ['400', '500', '600'],
  display: 'swap',
})

// Space Grotesk для заголовков (Regular 400, Medium 500, Bold 700)
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  variable: '--font-space-grotesk',
  weight: ['400', '500', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'wallet402 — Private Wallet Layer for the 402 Protocol',
  description: 'Generate secure Solana wallets designed for 402 microtransactions and anonymity. Private gateway of the 402 economy.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${satoshi.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

