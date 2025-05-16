'use client'

import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const SignInMain = dynamic(() => import('./Main'), {
  ssr: false,
})

export default function SignIn() {
  // // router
  // const router = useRouter()

  // // session
  // const { data: session } = useSession()

  // if (!session?.user) {
  //   // redirect to home page
  //   void router.push('/')
  // }

  return <SignInMain />
}
