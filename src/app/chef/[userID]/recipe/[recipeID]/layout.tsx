import '~/styles/globals.css'

import { type Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'

import { TRPCReactProvider } from '~/trpc/react'
import { SessionProvider } from 'next-auth/react'
import { auth } from '~/server/auth'

export const metadata: Metadata = {
  title: 'Wongnok-เมนูโปรดใกล้ฉัน',
  description: 'Wongnok-เมนูโปรดใกล้ฉัน',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const notoSansThai = Noto_Sans_Thai({
  subsets: ['latin'],
  variable: '--font-noto-sans-thai',
})

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={notoSansThai.className}>
        <SessionProvider session={session}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
