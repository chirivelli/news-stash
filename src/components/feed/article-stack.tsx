import { RiRssLine } from '@remixicon/react'
import { useQuery } from '@tanstack/react-query'

import { Article } from '@/components/feed/article'
import { ArticleSkeleton } from '@/components/feed/article-skeleton'
import { getFeed } from '@/lib/rss'

export function ArticleStack({ feed }: { feed: string }) {
  const selectedFeedQuery = useQuery({
    queryKey: ['feed', feed],
    queryFn: () => getFeed({ data: { url: feed } }),
    enabled: Boolean(feed),
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 10,
  })
  const selectedFeed = selectedFeedQuery.data

  return (
    <section className='lg:grid-cols-auto grid gap-6'>
      <div className='space-y-4'>
        <div className='flex items-end justify-between gap-4'>
          <div>
            <p className='text-xs font-semibold tracking-[0.28em] text-stone-500 uppercase'>
              Article stack
            </p>
            <h2 className='font-display text-2xl text-stone-950 sm:text-3xl'>Latest posts</h2>
          </div>
          <div className='inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold tracking-[0.18em] text-stone-600 uppercase'>
            <RiRssLine className='size-4' />
            {selectedFeed?.title || 'No feed selected'}
          </div>
        </div>

        {selectedFeedQuery.isLoading ? (
          <div className='grid gap-4'>
            {Array.from({ length: 3 }).map((_, index) => (
              <ArticleSkeleton key={index} />
            ))}
          </div>
        ) : selectedFeedQuery.isError ? (
          <div className='rounded-[2rem] p-6 text-sm leading-7 text-red-700'>
            {selectedFeedQuery.error.message ?? 'Unable to load this feed right now.'}
          </div>
        ) : selectedFeed?.items.length ? (
          <div className='grid gap-4'>
            {selectedFeed.items.map((item, index) => (
              <Article key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
