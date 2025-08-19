import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { FC } from 'react'

import { globby } from 'globby'
import { basename } from 'node:path'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const posts = await globby('src/posts/*.mdx')
  return posts.map((post) => {
    return {
      path: basename(post, '.mdx')
    }
  })
}

type PageProps = {
  params: Promise<{
    path: string
  }>
}
export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { path } = await props.params

  try {
    const { metadata } = await import(`@/posts/${path}.mdx`)

    return {
      title: metadata.title,
      description: metadata.description
    }
  } catch (error) {
    console.error(error)
    return {}
  }
}

const Page: FC<PageProps> = async (props) => {
  const { path } = await props.params

  try {
    const { default: Post, metadata } = (await import(
      `@/posts/${path}.mdx`
    )) as {
      default: FC
      metadata: {
        title: string
        description: string
        date: string
        tags: string[]
      }
    }

    return (
      <>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css"
          integrity="sha384-KiWOvVjnN8qwAZbuQyWDIbfCLFhLXNETzBQjA/92pIowpC0d2O3nppDGQVgwd2nB"
          crossOrigin="anonymous"
        />
        <h1 className="mt-4 mb-8 text-4xl leading-tight font-normal">
          {metadata.title}
        </h1>
        <article className="prose max-w-none">
          <Post />
        </article>
        <time
          className="mt-4 block text-right text-xs text-[#92737b]"
          dateTime={metadata.date}
        >
          {metadata.date}
        </time>
        <ul className="mt-2 flex flex-wrap justify-end gap-2">
          {metadata.tags.map((tag) => (
            <li key={tag} className="text-xs">
              <a href={`/blog/tag/${tag}`} className="mr-2 text-[#2196f3]">
                #{tag}
              </a>
            </li>
          ))}
        </ul>
      </>
    )
  } catch {
    notFound()
  }
}

export default Page
