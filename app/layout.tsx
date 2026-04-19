import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MeetingMind — Real-Time AI Meeting Assistant',
  description: 'Context-aware AI suggestions for live meetings, interviews, and sales calls.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#0a0a0f', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
