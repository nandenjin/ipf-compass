'use client'
import { CSSReset, ChakraProvider } from '@chakra-ui/react'

export function MyChakraProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider>
      <CSSReset />
      {children}
    </ChakraProvider>
  )
}
