import { RiDeleteBin6Line } from '@remixicon/react'
import { QueryClient, useQueries, useQueryClient } from '@tanstack/react-query'

import { getFeedLabel } from '@/lib/feed'
import { getFeed } from '@/lib/rss'

import { FeedLogo } from './feed-logo'

export function FeedRail({
  subscriptions,

  setSubscriptions,
  selected: selectedFeedUrl,
  setSelected: setSelectedFeedUrl,
}: {
  subscriptions: string[]
  setSubscriptions: React.Dispatch<React.SetStateAction<string[]>>
  selected: string
  setSelected: React.Dispatch<React.SetStateAction<string>>
}) {
  const queryClient = useQueryClient()
  const feedQueries = useQueries({
    queries: subscriptions.map((url) => ({
      queryKey: ['feed', url],
      queryFn: () => getFeed({ data: { url } }),
      staleTime: 1000 * 60 * 10,
    })),
  })

  const feedCards = subscriptions.map((url, index) => ({
    url,
    data: feedQueries[index]?.data,
    isLoading: feedQueries[index]?.isLoading ?? false,
    isError: feedQueries[index]?.isError ?? false,
  }))

  const removeFeed = (
    url: string,
    subscriptions: string[],
    setSubscriptions: React.Dispatch<React.SetStateAction<string[]>>,
    setSelectedFeedUrl: React.Dispatch<React.SetStateAction<string>>,
    queryClient: QueryClient,
  ) => {
    const nextSubscriptions = subscriptions.filter((item) => item !== url)

    setSubscriptions(nextSubscriptions)
    setSelectedFeedUrl((current) => {
      if (current !== url) {
        return current
      }

      return nextSubscriptions[0] ?? ''
    })
    queryClient.removeQueries({ queryKey: ['feed', url] })
  }

  return (
    <section className='space-y-4'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <p className='text-xs font-semibold tracking-[0.28em] text-stone-500 uppercase'>
            Feed rail
          </p>
          <h2 className='font-display text-2xl text-stone-950 sm:text-3xl'>Your subscriptions</h2>
        </div>
        <p className='text-sm text-stone-500'>{subscriptions.length} active</p>
      </div>

      <div className='feed-rail no-scrollbar flex gap-3 overflow-x-auto pb-2'>
        {feedCards.map((feed) => {
          const isSelected = feed.url === selectedFeedUrl
          const feedTitle = feed.data?.title || getFeedLabel(feed.url)

          return (
            <article
              key={feed.url}
              className={`feed-pill min-w-62.5 flex-none rounded-[1.75rem] border p-3 transition ${
                isSelected
                  ? 'border-stone-950 bg-stone-950 text-stone-50'
                  : 'border-stone-200 bg-white/88 text-stone-900'
              }`}
            >
              <div className='flex items-start gap-3'>
                <button
                  className='flex min-w-0 flex-1 items-center gap-3 text-left'
                  onClick={() => setSelectedFeedUrl(feed.url)}
                  type='button'
                >
                  <FeedLogo
                    title={feedTitle}
                    imageUrl={feed.data?.imageUrl}
                    faviconUrl={feed.data?.faviconUrl}
                  />
                  <p className='truncate text-sm font-semibold'>{feedTitle}</p>
                </button>

                <button
                  aria-label={`Remove ${feedTitle}`}
                  className={`mt-1 inline-flex size-8 items-center justify-center rounded-full border transition ${
                    isSelected
                      ? 'border-white/15 text-stone-200 hover:bg-white/10'
                      : 'border-stone-200 text-stone-500 hover:bg-stone-100'
                  }`}
                  onClick={() =>
                    removeFeed(
                      feed.url,
                      subscriptions,
                      setSubscriptions,
                      setSelectedFeedUrl,
                      queryClient,
                    )
                  }
                  type='button'
                >
                  <RiDeleteBin6Line className='size-4' />
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
