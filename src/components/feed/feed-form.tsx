import { RiAddLine, RiSparklingLine } from '@remixicon/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { getFeed, normalizeFeedUrl } from '@/lib/rss'

import { Button } from '../ui/button'

export function FeedForm({
  setSubscriptions,
  setSelected,
}: {
  setSubscriptions: React.Dispatch<React.SetStateAction<string[]>>
  setSelected: React.Dispatch<React.SetStateAction<string>>
}) {
  const queryClient = useQueryClient()
  const [draftUrl, setDraftUrl] = useState('')

  const addFeedMutation = useMutation({
    mutationFn: async (rawUrl: string) => {
      const url = normalizeFeedUrl(rawUrl)
      const feed = await getFeed({ data: { url } })
      return { url, feed }
    },
    onSuccess: ({ url, feed }) => {
      queryClient.setQueryData(['feed', url], feed)
      setSubscriptions((current) => (current.includes(url) ? current : [...current, url]))
      setSelected(url)
      setDraftUrl('')
    },
  })

  return (
    <section className='hero-panel grid gap-6 overflow-hidden rounded-[2rem] border border-white/55 px-5 py-6 shadow-[0_30px_120px_rgba(67,44,24,0.12)] sm:px-8 sm:py-8 lg:grid-cols-[1.3fr_0.9fr]'>
      <div className='relative z-10 flex flex-col gap-5'>
        <div className='eyebrow'>
          <RiSparklingLine className='size-4' />
          Your personal current-issue desk
        </div>
        <div className='max-w-3xl space-y-4'>
          <h1 className='font-display text-4xl leading-none font-semibold text-stone-950 sm:text-5xl lg:text-7xl'>
            News Stash
          </h1>
          <p className='max-w-2xl text-base leading-7 text-stone-700 sm:text-lg'>
            Subscribe to RSS feeds, flip between them from a horizontal rail, and read the latest
            posts in one place.
          </p>
        </div>
      </div>

      <form
        className='glass-card relative z-10 flex flex-col gap-4 rounded-[1.75rem] p-4 sm:p-5'
        onSubmit={(event) => {
          event.preventDefault()
          addFeedMutation.mutate(draftUrl)
        }}
      >
        <div className='space-y-1'>
          <p className='text-xs font-semibold tracking-[0.28em] text-stone-500 uppercase'>
            Add subscription
          </p>
          <p className='text-sm leading-6 text-stone-600'>Paste any RSS or Atom feed URL.</p>
        </div>

        <label className='space-y-2'>
          <span className='text-sm font-medium text-stone-700'>Feed URL</span>
          <input
            className='h-12 w-full rounded-2xl border border-stone-300/80 bg-white/80 px-4 text-sm text-stone-950 transition outline-none focus:border-stone-950'
            placeholder='https://example.com/feed.xml'
            value={draftUrl}
            onChange={(event) => setDraftUrl(event.target.value)}
          />
        </label>

        <Button
          className='h-12 rounded-2xl bg-stone-950 text-sm font-semibold tracking-[0.18em] uppercase hover:bg-stone-800'
          disabled={addFeedMutation.isPending || !draftUrl.trim()}
        >
          <RiAddLine className='size-4' />
          {addFeedMutation.isPending ? 'Checking feed' : 'Subscribe'}
        </Button>

        {addFeedMutation.error ? (
          <p className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700'>
            {addFeedMutation.error.message ?? 'Unable to load this feed right now.'}
          </p>
        ) : null}
      </form>
    </section>
  )
}
