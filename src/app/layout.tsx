import type { Metadata, Viewport } from 'next'

import type { FC, ReactNode } from 'react'

import { GoogleAnalyzer } from '@/components/google-analyzer'

import './globals.css'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
} satisfies Viewport

export const metadata: Metadata = {
  title: {
    template: '%s | Yoru.me',
    default: 'Yoru.me'
  },
  description: 'Yoru 小游戏和一些前端安利',
  authors: [
    {
      name: 'Derek',
      url: 'https://github.com/rikkayoru'
    }
  ]
} satisfies Metadata

type LayoutProps = {
  children: ReactNode
}
const Layout: FC<LayoutProps> = async ({ children }) => {
  return (
    <html lang="zh-Hans">
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <GoogleAnalyzer />}
      </body>
    </html>
  )
}

export default Layout
