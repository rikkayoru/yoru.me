'use client'

import dynamic from 'next/dynamic'

import bg from '@/assets/home/bg.webp'

import { Assets, type Texture } from 'pixi.js'
import useSWRImmutable from 'swr/immutable'

import { Loading } from './loading'

export const StartScreen = () => {
  const { data: texture, isLoading: isLoadingTexture } = useSWRImmutable(
    'start-screen/texture',
    async () => {
      return Assets.load<Texture>(bg.src)
    }
  )
  const { data: Screen, isLoading: isLoadingComponent } = useSWRImmutable(
    'start-screen/component',
    async () => {
      return dynamic(() => import('./screen').then((mod) => mod.Screen), {
        ssr: false
      })
    }
  )

  return (
    <>
      <Loading ready={!isLoadingTexture && !isLoadingComponent} />
      {Screen && texture && <Screen texture={texture} />}
    </>
  )
}
