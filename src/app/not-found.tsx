import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import localFont from 'next/font/local'
import Link from 'next/link'

import { cn } from '@/utils'

const fipps = localFont({
  src: '../components/game/assets/Fipps-Regular.ttf'
})

const Game = dynamic(() => import('@/components/game/entry'), {})

export const generateMetadata = async () => {
  return {
    title: 'You found many rabbits!'
  }
}

const Page404: NextPage = () => {
  return (
    <>
      <Game />
      <div
        className={cn('fixed right-8 bottom-6 text-gray-500', fipps.className)}
      >
        <Link href="/blog" title="去看看前端~">
          BLOG
        </Link>
        <span className="mx-4">/</span>
        <Link
          href="https://github.com/rikkayoru"
          title="Github~"
          target="_blank"
        >
          GITHUB
        </Link>
      </div>
    </>
  )
}

export default Page404
