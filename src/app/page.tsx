'use client'

import { Preahvihear } from 'next/font/google'
import Link from 'next/link'

import { useMemo } from 'react'

import { StartScreen } from '@/components/home/start-screen'
import { cn } from '@/utils'

const pFont = Preahvihear({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
})

const Home = () => {
  const anchorCls = useMemo(() => {
    return cn([
      'rounded-[32px] text-white',
      'py-2 w-24 block text-center',
      'font-[Preahvihear,_sans-serif]',
      'bg-[rgba(92,101,22,.3)]',
      pFont.className
    ])
  }, [])

  return (
    <>
      <div className="h-dvh bg-[#ffe500]">
        {/* <BgCanvas /> */}
        <StartScreen />
        <header className="fixed top-4 right-8">
          <nav className="flex h-16 items-center rounded-[64px] bg-[rgba(22,101,52,.5)] px-8 py-2">
            <ul className="flex items-center gap-4">
              <li>
                <Link href={'/blog'} title="去看看前端~" className={anchorCls}>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href={'https://github.com/rikkayoru'}
                  title="Github~"
                  target="_blank"
                  className={anchorCls}
                >
                  Github
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    </>
  )
}

export default Home
