import Image from 'next/image'
import Link from 'next/link'

import type { FC, ReactNode } from 'react'

import avatar from '@/assets/avatar.webp'
import asideBg from '@/assets/bg-aside.webp'

const BlogLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col-reverse sm:flex-row">
      <aside className="text-center sm:w-[30vw] sm:max-w-80 sm:text-left">
        <div className="sticky top-0 py-[8vw] sm:h-dvh">
          <div className="absolute inset-0 -z-10">
            <Image
              className="absolute inset-0 size-full object-cover"
              src={asideBg}
              alt="kizuna ai"
              loading="lazy"
            />
          </div>
          <div className="relative mx-auto size-[20vw] max-h-[180px] max-w-[180px] overflow-hidden rounded-full border-[3px] border-[#92737b]">
            <Image
              className="absolute inset-0 size-full object-cover"
              src={avatar}
              alt="Yoru.me"
              loading="lazy"
            />
          </div>
          <div className="mx-auto flex w-1/2 flex-col">
            <h3 className="my-8 text-[2em] font-bold text-white text-shadow-[2px_2px_3px_#555]">
              <a
                className="transition-colors duration-300"
                href="https://github.com/rikkayoru"
                target="_blank"
                rel="noreferrer"
              >
                Derek
              </a>
            </h3>
            <div className="sm:indent-0.5">
              <Link
                href="/"
                className="block leading-relaxed text-white underline text-shadow-[2px_2px_1px_#555]"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="block leading-relaxed text-white underline text-shadow-[2px_2px_1px_#555]"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-8 py-4">{children}</main>
    </div>
  )
}

export default BlogLayout
