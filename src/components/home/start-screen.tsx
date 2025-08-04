'use client'

import dynamic from 'next/dynamic'

const Screen = dynamic(() => import('./screen').then((mod) => mod.Screen), {
  ssr: false
})

export const StartScreen = () => {
  return <Screen />
}
