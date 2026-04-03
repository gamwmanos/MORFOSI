import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sanity Studio',
  description: 'Διαχείριση Περιεχομένου Μόρφωση',
  robots: 'noindex',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}