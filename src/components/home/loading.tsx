'use client'

import { type FC, useEffect, useMemo, useState } from 'react'

import { IconLoader2 } from '@tabler/icons-react'

import { cn } from '@/utils'

import { animate, motion, useMotionValue } from 'motion/react'
import { match } from 'ts-pattern'

const Spinner = () => {
  return <IconLoader2 className="size-12 animate-spin text-white" />
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
