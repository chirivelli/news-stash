export function FeedLogo({
  title,
  imageUrl,
  faviconUrl,
  large = false,
}: {
  title: string
  imageUrl?: string | null
  faviconUrl?: string | null
  large?: boolean
}) {
  const src = imageUrl || faviconUrl
  const sizeClass = large ? 'size-14 rounded-[1.35rem]' : 'size-12 rounded-[1rem]'

  if (src) {
    return (
      <img
        alt=''
        className={`${sizeClass} shrink-0 border border-stone-200/80 bg-white object-cover`}
        src={src}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} inline-flex shrink-0 items-center justify-center border border-stone-200/80 bg-[linear-gradient(135deg,rgba(41,37,36,1),rgba(120,113,108,1))] font-display text-lg text-white`}
    >
      {title.slice(0, 1).toUpperCase()}
    </div>
  )
}
