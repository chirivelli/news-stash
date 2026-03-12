import { createServerFn } from '@tanstack/react-start'
import Parser from 'rss-parser'

type ParsedFeed = {
  title: string
  description: string
  feedUrl: string
  siteUrl: string
  imageUrl: string | null
  faviconUrl: string | null
  fetchedAt: string
  items: FeedItem[]
}

type FeedItem = {
  id: string
  title: string
  link: string
  publishedAt: string | null
  author: string | null
  summary: string
  imageUrl: string | null
  categories: string[]
}

const parser = new Parser({
  timeout: 10_000,
  headers: {
    'user-agent': 'news-stash/1.0',
  },
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['media:content', 'mediaContent', { keepArray: true }],
      ['description', 'description'],
    ],
  },
})

export const getFeed = createServerFn({ method: 'GET' })
  .inputValidator((input: { url: string }) => {
    return { url: normalizeFeedUrl(input.url) }
  })
  .handler(async ({ data }): Promise<ParsedFeed> => {
    const feed = await parser.parseURL(data.url)
    const siteUrl = sanitizeUrl(feed.link) ?? new URL(data.url).origin

    return {
      title: feed.title?.trim() || getHostnameLabel(siteUrl),
      description: stripHtml(feed.description ?? '').trim(),
      feedUrl: feed.feedUrl?.trim() || data.url,
      siteUrl,
      imageUrl: sanitizeUrl(feed.image?.url) ?? null,
      faviconUrl: getFaviconUrl(siteUrl),
      fetchedAt: new Date().toISOString(),
      items: (feed.items ?? [])
        .map((item, index) => normalizeItem(item as unknown as Record<string, unknown>, index))
        .filter((item): item is FeedItem => Boolean(item)),
    }
  })

function normalizeItem(item: Record<string, unknown>, index: number): FeedItem | null {
  const link = sanitizeUrl(asString(item.link) ?? asString(item.guid))

  if (!link) {
    return null
  }

  const summarySource =
    asString(item.contentSnippet) ??
    asString(item.summary) ??
    asString(item.content) ??
    asString(item.description) ??
    ''

  return {
    id: asString(item.guid) ?? `${link}-${index}`,
    title: asString(item.title)?.trim() || 'Untitled article',
    link,
    publishedAt: sanitizeDate(asString(item.isoDate) ?? asString(item.pubDate) ?? null),
    author: asString(item.creator)?.trim() || null,
    summary: stripHtml(summarySource).replace(/\s+/g, ' ').trim(),
    imageUrl: getItemImage(item),
    categories: Array.isArray(item.categories)
      ? item.categories.filter((value): value is string => typeof value === 'string')
      : [],
  }
}

function getItemImage(item: Record<string, unknown>) {
  const directImage = [
    asString(item.image),
    asString(item.thumbnail),
    getMediaUrl(item.mediaThumbnail),
    getMediaUrl(item.mediaContent),
    matchImageFromHtml(asString(item.content)),
    matchImageFromHtml(asString(item.description)),
  ].find((value) => Boolean(sanitizeUrl(value)))

  return sanitizeUrl(directImage) ?? null
}

function getMediaUrl(value: unknown) {
  if (!Array.isArray(value)) {
    return null
  }

  const first = value[0]
  if (!first || typeof first !== 'object') {
    return null
  }

  const maybeUrl = (first as Record<string, unknown>).url
  return asString(maybeUrl)
}

function matchImageFromHtml(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const match = value.match(/<img[^>]+src=["']([^"']+)["']/i)
  return match?.[1] ?? null
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ')
}

function sanitizeDate(value: string | null) {
  if (!value) {
    return null
  }

  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? null : new Date(timestamp).toISOString()
}

function sanitizeUrl(value: string | null | undefined) {
  if (!value) {
    return null
  }

  try {
    return new URL(value.trim()).toString()
  } catch {
    return null
  }
}

export function normalizeFeedUrl(value: string) {
  const candidate = value.trim()
  const withProtocol =
    candidate.startsWith('http://') || candidate.startsWith('https://')
      ? candidate
      : `https://${candidate}`

  return new URL(withProtocol).toString()
}

function getFaviconUrl(siteUrl: string) {
  try {
    return new URL('/favicon.ico', siteUrl).toString()
  } catch {
    return null
  }
}

function getHostnameLabel(siteUrl: string) {
  try {
    return new URL(siteUrl).hostname.replace(/^www\./, '')
  } catch {
    return 'Untitled feed'
  }
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : null
}

export type { FeedItem, ParsedFeed }
