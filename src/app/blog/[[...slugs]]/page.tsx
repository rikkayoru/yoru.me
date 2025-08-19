import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { cn } from '@/utils'

import { Pagination } from './components/pagination'
import parseQueryPath from './utils/parse-query-path'
import { getAllPosts } from './utils/posts'

export const generateStaticParams = async () => {
  const data = await getAllPosts()

  const tags = new Set<string>()

  data.posts.forEach((post) => {
    post.metadata.tags.forEach((tag) => {
      tags.add(tag)
    })
  })

  const params = tags.values().map((tag) => {
    return {
      slugs: ['tag', tag]
    }
  })

  return [
    // /blog
    {
      slugs: []
    },
    // /blog/tag
    ...Array.from(params)
  ]
}

type PageProps = {
  params: Promise<{
    slugs: string[] | undefined
  }>
}
export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { slugs } = await props.params
  const parsed = parseQueryPath(slugs)

  try {
    return {
      title: parsed.tag ? `${parsed.tag} 相关` : 'Blog',
      description: '一些关于前端的文字'
    }
  } catch (error) {
    console.error(error)
    return {
      title: 'Blog',
      description: '一些关于前端的文字'
    }
  }
}

const Page = async (props: PageProps) => {
  const { slugs } = await props.params
  const parsed = parseQueryPath(slugs)
  const data = await getAllPosts(parsed.tag, parsed.page)

  if (data.posts.length === 0) {
    return notFound()
  }

  return (
    <>
      {data.posts.map((post) => {
        return (
          <section key={post.metadata.path} className="py-4">
            <a href={`/blog/${post.metadata.path}`}>
              <h2
                className={cn([
                  'relative mb-1 inline-block text-4xl leading-tight font-normal',
                  'after:mt-0.5 after:block after:h-0.5 after:w-0 after:bg-[#92737b] after:transition-all after:duration-300 hover:after:w-full'
                ])}
              >
                {post.metadata.title}
              </h2>
            </a>
            <time
              className="block text-sm text-[#92737b]"
              dateTime={post.metadata.date}
            >
              {post.metadata.date}
            </time>
            <ul className="mt-0.5 flex flex-wrap gap-2">
              {post.metadata.tags.map((tag) => (
                <li key={tag} className="text-xs">
                  <a href={`/blog/tag/${tag}`} className="mr-2 text-[#2196f3]">
                    #{tag}
                  </a>
                </li>
              ))}
            </ul>
            <p className="my-4 leading-relaxed text-[#555]">
              {post.metadata.summary}
            </p>
          </section>
        )
      })}
      {data.pager && <Pagination pager={data.pager} />}
    </>
  )
}

export default Page
