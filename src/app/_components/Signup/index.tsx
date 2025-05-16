'use client'

import dynamic from 'next/dynamic'

const SignUpMain = dynamic(() => import('./Main'), {
  ssr: false,
})

export default function SignUp() {
  return <SignUpMain />
}
