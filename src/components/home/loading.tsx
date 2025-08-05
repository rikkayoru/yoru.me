'use client'

import { type FC, useEffect, useMemo, useState } from 'react'

import { css } from '@emotion/react'

import { cn } from '@/utils'

import { animate, motion, useMotionValue } from 'motion/react'
import { match } from 'ts-pattern'

const Spinner = () => {
  return (
    <div
      css={css`
        width: 40px;
        height: 20px;
        --c: no-repeat radial-gradient(farthest-side, #fff 93%, #0000);
        background:
          var(--c) 0 0,
          var(--c) 50% 0,
          var(--c) 100% 0;
        background-size: 8px 8px;
        position: relative;
        animation: l4-0 1s linear infinite alternate;

        &:before {
          content: '';
          position: absolute;
          width: 8px;
          height: 12px;
          background: #fff;
          left: 0;
          top: 0;
          animation:
            l4-1 1s linear infinite alternate,
            l4-2 0.5s cubic-bezier(0, 200, 0.8, 200) infinite;
        }

        @keyframes l4-0 {
          0% {
            background-position:
              0 100%,
              50% 0,
              100% 0;
          }
          8%,
          42% {
            background-position:
              0 0,
              50% 0,
              100% 0;
          }
          50% {
            background-position:
              0 0,
              50% 100%,
              100% 0;
          }
          58%,
          92% {
            background-position:
              0 0,
              50% 0,
              100% 0;
          }
          100% {
            background-position:
              0 0,
              50% 0,
              100% 100%;
          }
        }
        @keyframes l4-1 {
          100% {
            left: calc(100% - 8px);
          }
        }
        @keyframes l4-2 {
          100% {
            top: -0.1px;
          }
        }
      `}
    ></div>
  )
}

type Props = {
  ready: boolean
}
export const Loading: FC<Props> = ({ ready }) => {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  const v = useMotionValue(0)
  const o = useMotionValue(1)

  useEffect(() => {
    const animation = match(ready)
      .with(true, () => {
        return animate(v, 100, {
          ease: 'easeOut',
          duration: 0.8,
          onUpdate(v) {
            setProgress(Math.floor(v))
          },
          onComplete() {
            animate(o, 0, {
              duration: 0.8,
              ease: [0, 0.76, 0.82, 1],
              onComplete() {
                setDone(true)
              }
            })
          }
        })
      })
      .otherwise(() => {
        // Loading
        return animate(v, 100, {
          ease: [0, 0.95, 0.45, 1],
          duration: 60,
          onUpdate(v) {
            setProgress(Math.floor(v))
          }
        })
      })

    return () => {
      animation.stop()
    }
  }, [v, o, ready])

  const cls = useMemo(() => {
    return cn([
      'fixed inset-0 flex items-center justify-center',
      'text-6xl text-white bg-[#ffe500]',
      'pointer-events-none',
      'font-[Preahvihear,Tahoma,sans-serif]',
      'z-50'
    ])
  }, [])

  return (
    <>
      {!done && (
        <motion.div
          className={cls}
          style={{
            opacity: o
          }}
        >
          {progress > 0 ? (
            <motion.span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to top, #fff ${v.get()}%, transparent 100%)`
              }}
            >{`${progress} %`}</motion.span>
          ) : (
            <Spinner />
          )}
        </motion.div>
      )}
    </>
  )
}
