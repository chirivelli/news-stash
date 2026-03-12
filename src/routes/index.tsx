import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { ArticleStack } from '@/components/feed/article-stack'
import { FeedForm } from '@/components/feed/feed-form'
import { FeedRail } from '@/components/feed/feed-rail'

export const Route = createFileRoute('/')({ component: App })

const DEFAULT_FEEDS = [
  'https://www.theverge.com/rss/index.xml',
  'https://hnrss.org/frontpage',
  'https://www.cnet.com/rss/all',
  'https://techcrunch.com/feed/',
]

function App() {
  const [subscriptions, setSubscriptions] = useState([...DEFAULT_FEEDS])
  const [selected, setSelected] = useState(DEFAULT_FEEDS[0])

  return (
    <main className='min-h-svh'>
      <div className='mx-auto flex min-h-svh w-full max-w-375 flex-col gap-10 px-4 py-4 sm:px-6 lg:px-10 lg:py-8'>
        <FeedForm setSelected={setSelected} setSubscriptions={setSubscriptions} />

        <FeedRail
          subscriptions={subscriptions}
          setSubscriptions={setSubscriptions}
          selected={selected}
          setSelected={setSelected}
        />

        <ArticleStack feed={selected} />
      </div>
    </main>
  )
}
