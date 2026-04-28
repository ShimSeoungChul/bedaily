import Image from 'next/image'

interface MDXImageProps {
  src?: string
  alt?: string
  title?: string
  width?: number
  height?: number
}

export default function MDXImage({ src, alt = '', title }: MDXImageProps) {
  if (!src) return null

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border)' }}>
        <Image
          src={src}
          alt={alt}
          width={800}
          height={450}
          className="w-full h-auto"
          style={{ objectFit: 'contain' }}
        />
      </div>
      {(title || alt) && (
        <figcaption className="mt-2 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          {title || alt}
        </figcaption>
      )}
    </figure>
  )
}
