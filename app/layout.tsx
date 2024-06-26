import type { Metadata } from 'next'
import './global.css'
export const metadata: Metadata = {
  title: 'Codebender AI Template',
  description: 'Template code for the Codebender AI Project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
