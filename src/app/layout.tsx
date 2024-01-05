import { MyChakraProvider } from '@/components/MyChakraProvider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StoreProvider } from '@/components/StoreProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IPF Compass',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <MyChakraProvider>{children}</MyChakraProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
