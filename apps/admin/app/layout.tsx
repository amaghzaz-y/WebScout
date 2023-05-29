"use client"
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WS-ADMIN',
  description: 'Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Stack>
          <div>
            <ToggleButtonGroup>
              <ToggleButton value={"index"}>
                <Link href={'/index'} >Index</Link>
              </ToggleButton>
              <ToggleButton value={"search"}>
                <Link href={'/search'} >Search</Link>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <main className='self-center w-full sm:max-w-md'>
            {children}
          </main>
        </Stack>
      </body>
    </html>
  )
}
