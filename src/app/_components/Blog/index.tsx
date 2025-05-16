'use client'

import dynamic from 'next/dynamic'

const BlogMain = dynamic(() => import('./Main'), {
  ssr: false,
})

export default function SignIn() {
  return <BlogMain disableCustomTheme />
}
