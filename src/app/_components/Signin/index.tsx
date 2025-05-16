'use client'

import dynamic from 'next/dynamic'

const SignInMain = dynamic(() => import('./Main'), {
  ssr: false,
})

export default function SignIn() {
  return <SignInMain />
}
