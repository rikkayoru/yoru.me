'use client'

import { type FC, useRef } from 'react'

import dayjs from 'dayjs'
import { GlitchFilter, PixelateFilter } from 'pixi-filters'
import { Application, Sprite, type Texture } from 'pixi.js'
import {
  concat,
  delay,
  fromEvent,
  interval,
  mergeMap,
  of,
  startWith,
  throttleTime
} from 'rxjs'
import useSWRImmutable from 'swr/immutable'

type Props = {
  texture: Texture
}
export const Screen: FC<Props> = ({ texture }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useSWRImmutable(
    () => {
      return ['start-screen/bg', dayjs().format('YYYY-MM-DD HH:mm:ss')]
    },
    async () => {
      if (!canvasRef.current) {
        return
      }
      const app = new Application()

      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        background: '#ffe500',
        resizeTo: window,
        canvas: canvasRef.current
      })

      // Load the bg
      const bgSprite = new Sprite(texture)
      app.stage.addChild(bgSprite)

      bgSprite.anchor.set(0.5)
      bgSprite.alpha = 0

      // Prepare filters
      const pixelateFilter = new PixelateFilter(3)
      // const grayscaleFilter = new GrayscaleFilter()
      const glitchFilter = new GlitchFilter({
        offset: 36,
        fillMode: 2 // Loop
      })
      const filters = [
        pixelateFilter,
        //  grayscaleFilter,
        glitchFilter
      ]

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

      // Listen for animate update
      app.ticker.add((time) => {
        if (bgSprite.alpha < 1) {
          bgSprite.alpha += 0.1 * time.deltaTime
        }
        glitchFilter.slices = Math.floor(Math.random() * 6)
      })

      // Glitch effect
      interval(3e3)
        .pipe(
          mergeMap(() => {
            return concat(of(true), of(false).pipe(delay(6e2)))
          }),
          startWith(false)
        )
        .subscribe((enabled) => {
          // `enabled` not work now, ref: https://github.com/pixijs/pixijs/issues/11333
          if (enabled) {
            bgSprite.filters = filters
          } else {
            bgSprite.filters = filters.filter((f) => f !== glitchFilter)
          }
        })

      // Handle resize
      fromEvent(window, 'resize')
        .pipe(
          throttleTime(100, undefined, {
            trailing: true,
            leading: true
          }),
          startWith(true)
        )
        .subscribe(() => {
          requestAnimationFrame(responsiveSprite)
        })

      return app
    }
  )

  return (
    <>
      <canvas className="size-full" ref={canvasRef} />
    </>
  )
}
