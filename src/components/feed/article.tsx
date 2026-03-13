import { RiArrowRightUpLine } from '@remixicon/react'

import type { FeedItem } from '@/lib/rss'

import { formatArticleDate } from '@/lib/feed'

export function Article({ item, index }: { item: FeedItem; index: number }) {
  return (
    <a
      className='group grid gap-5 rounded-[2rem] border border-stone-200/80 bg-white/88 p-5 transition hover:-translate-y-0.5 hover:border-stone-950 hover:shadow-[0_24px_70px_rgba(34,24,18,0.08)] sm:grid-cols-[minmax(0,1fr)_220px]'
      href={item.link}
      rel='noreferrer'
      target='_blank'
    >
      <div className='space-y-4'>
        <div className='flex flex-wrap items-center gap-2 text-xs font-semibold tracking-[0.18em] text-stone-500 uppercase'>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {item.publishedAt ? <span>{formatArticleDate(item.publishedAt)}</span> : null}
          {item.author ? <span>{item.author}</span> : null}
        </div>
        <div className='space-y-3'>
          <h3 className='font-display text-2xl leading-tight text-stone-950 transition group-hover:text-stone-700 sm:text-[2rem]'>
            {item.title}
          </h3>
          <p className='line-clamp-4 text-sm leading-7 text-stone-600 sm:text-base'>
            {item.summary || 'Open the post to read the full article.'}
          </p>
        </div>
        {item.categories.length ? (
          <div className='flex flex-wrap gap-2'>
            {item.categories.slice(0, 3).map((category) => (
              <span
                className='rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600'
                key={category}
              >
                {category}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className='relative min-h-52 overflow-hidden rounded-[1.5rem] border border-stone-200/80 bg-[radial-gradient(circle_at_top,rgba(120,86,54,0.2),rgba(255,255,255,0.95)_60%)]'>
        {item.imageUrl ? (
          <img
            alt=''
            className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]'
            src={item.imageUrl}
          />
        ) : (
          <div className='flex h-full min-h-44 items-end justify-between p-5'>
            <span className='font-display text-5xl leading-none text-stone-300'>
              {String(index + 1).padStart(2, '0')}
            </span>
            <RiArrowRightUpLine className='size-8 text-stone-400 transition group-hover:translate-x-1 group-hover:-translate-y-1' />
          </div>
        )}
      </div>
    </a>
  )
}
