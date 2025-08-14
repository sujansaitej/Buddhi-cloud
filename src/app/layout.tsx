import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TaskProvider } from '@/context/TaskContext'
import { UserProvider } from '@/contexts/UserContext'
import { SettingsProvider } from '@/contexts/SettingsContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Buddi Flow - AI Browser Automation Agent',
  description: 'Your intelligent browser automation companion. Research companies, analyze websites, and automate web tasks with AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <SettingsProvider>
            <TaskProvider>
              {children}
            </TaskProvider>
          </SettingsProvider>
        </UserProvider>
      </body>
    </html>
  )
} 