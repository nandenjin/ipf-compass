'use client'
import { store } from '@/store'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'

export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
