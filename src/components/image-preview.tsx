'use client'

import NextImage from 'next/image'

import {
  type FC,
  type MouseEvent,
  useCallback,
  useEffect,
  useState
} from 'react'
import { createPortal } from 'react-dom'

import { IconLoader2, IconX } from '@tabler/icons-react'

import { cn } from '@/utils'

import { AnimatePresence, motion } from 'motion/react'
import { fromEvent } from 'rxjs'
import useSWRImmutable from 'swr/immutable'
import { match } from 'ts-pattern'

type ImageViewerProps = {
  src: string
  onClose: () => void
}

const INITIAL_SCALE = 0.5

const ImageViewer: FC<ImageViewerProps> = ({ src, onClose }) => {
  const { data: naturalDimensions, isLoading } = useSWRImmutable(
    [`preview/img/${src}`],
    async () => {
      const img = new Image()
      img.src = src
      await img.decode()

      return {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
    }
  )
  const [currentScale, setCurrentScale] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)

  const calcScale = useCallback(() => {
    if (!naturalDimensions) {
      return 0
    }

    const viewportWidth = window.innerWidth * INITIAL_SCALE
    const scale = Math.min(1, viewportWidth / naturalDimensions.width)

    return scale
  }, [naturalDimensions])

  // Resize
  useEffect(() => {
    const resize$ = fromEvent(window, 'resize').subscribe(async () => {
      const scale = calcScale()

      setCurrentScale(scale)
    })

    if (naturalDimensions && currentScale === 0) {
      const scale = calcScale()
      setCurrentScale(scale)
    }

    return () => {
      resize$.unsubscribe()
    }
  }, [naturalDimensions, calcScale, currentScale])

  // Click to zoom
  const handleImageClick = useCallback(async () => {
    if (isLoading || isDragging || !naturalDimensions) {
      return
    }

    const nextScale = match(currentScale)
      .with(1, () => {
        return calcScale()
      })
      .otherwise(() => 1)

    setCurrentScale(nextScale)
  }, [isLoading, isDragging, calcScale, currentScale, naturalDimensions])

  // Close
  const handleOverlayClick = useCallback(
    (e: MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  return createPortal(
    <motion.div
      className={cn([
        'fixed inset-0 z-[999] flex cursor-zoom-out justify-center overscroll-contain bg-black/30',
        'will-change-[opacity]',
        'items-center'
      ])}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleOverlayClick}
    >
      <div className="absolute top-4 right-4 z-20 flex items-center justify-end gap-4">
        {!isLoading && naturalDimensions && currentScale > 0 && (
          <div className="rounded-lg bg-gray-700/30 px-4 py-2 text-sm text-white select-none">
            {`${Math.round(currentScale * 100)}%`}
          </div>
        )}
        <button
          onClick={onClose}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-gray-700 p-2 text-3xl font-bold text-white transition-all duration-200"
          aria-label="关闭"
        >
          <IconX className="size-6" />
        </button>
      </div>

      {isLoading ? (
        <IconLoader2 className="size-10 animate-spin self-center text-white" />
      ) : (
        naturalDimensions && (
          <motion.img
            src={src}
            className="relative z-10 m-8 h-auto max-w-none object-contain will-change-[width]"
            initial={{ width: 0 }}
            animate={{ width: currentScale * naturalDimensions.width }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', stiffness: 310, damping: 25 }}
            dragMomentum={false}
            drag
            dragElastic={0}
            onDragStart={() => {
              setIsDragging(true)
            }}
            onDragEnd={() => {
              setIsDragging(false)
            }}
            onClick={handleImageClick}
            whileHover={{
              cursor: currentScale === 1 ? 'move' : 'zoom-in'
            }}
          />
        )
      )}
    </motion.div>,
    document.body
  )
}

type Props = {
  src: string
  alt: string
}
export const ImagePreview: FC<Props> = ({ src, alt }) => {
  const [opened, setOpened] = useState(false)
  const url = new URL(src.replaceAll('&amp;', '&'), 'https://img.yoru.me')
  const params = url.searchParams

  const width = params.get('width')
  const height = params.get('height')
  const note = params.get('note') || null

  if (!width || !height) {
    throw new Error(
      'Image width and height are required, set them in URL query, e.g. ?width=100&height=100'
    )
  }

  const aspectRatio = `${width} / ${height}`
  const urlWithoutQuery = `${url.origin}${url.pathname}`

  return (
    <span className="block text-center">
      <NextImage
        src={urlWithoutQuery}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        width={parseFloat(width)}
        height={parseFloat(height)}
        style={{
          aspectRatio
        }}
        className="mx-auto mt-0 mb-2 h-auto cursor-zoom-in"
        onClick={() => {
          setOpened(true)
        }}
      />
      {note ? <span className="text-sm text-gray-500">{note}</span> : null}
      <AnimatePresence>
        {opened && (
          <ImageViewer src={urlWithoutQuery} onClose={() => setOpened(false)} />
        )}
      </AnimatePresence>
    </span>
  )
}
