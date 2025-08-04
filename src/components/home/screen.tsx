'use client'

import { useRef } from 'react'

import bg from '@/assets/home/bg.webp'

import { GrayscaleFilter, PixelateFilter } from 'pixi-filters'
import { Application, Assets, Sprite } from 'pixi.js'
import { fromEvent, startWith, throttleTime } from 'rxjs'
import useSWRImmutable from 'swr/immutable'

export const Screen = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isLoading } = useSWRImmutable('start-screen/bg', async () => {
    if (!canvasRef.current) {
      return
    }
    // Create a new application
    const app = new Application()

    // Initialize the application
    console.log('?')
    await app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      background: '#ffe500',
      resizeTo: window,
      canvas: canvasRef.current
    })
    console.log('??')

    // Load the bg
    const texture = await Assets.load(bg.src)
    const bgSprite = new Sprite(texture)
    bgSprite.anchor.set(0.5)
    bgSprite.alpha = 0

    const filters = [new PixelateFilter(4), new GrayscaleFilter()]
    bgSprite.filters = filters

    // Ensure the sprite cover the whole screen
    const originalAspectRatio = texture.width / texture.height
    const responsiveSprite = () => {
      const screenAspectRatio = app.screen.width / app.screen.height
      if (originalAspectRatio > screenAspectRatio) {
        bgSprite.width = app.screen.height * originalAspectRatio
        bgSprite.height = app.screen.height
      } else {
        bgSprite.width = app.screen.width
        bgSprite.height = app.screen.width / originalAspectRatio
      }
      bgSprite.x = app.screen.width / 2
      bgSprite.y = app.screen.height / 2
    }

    app.stage.addChild(bgSprite)

    // Listen for animate update
    app.ticker.add((time) => {
      if (bgSprite.alpha < 1) {
        bgSprite.alpha += 0.1 * time.deltaTime
      }
    })

    fromEvent(window, 'resize')
      .pipe(
        startWith(true),
        throttleTime(100, undefined, {
          trailing: true
        })
      )
      .subscribe(() => {
        responsiveSprite()
      })

    return app
  })

  return (
    <>
      <canvas className="size-full" ref={canvasRef} />
    </>
  )
}
