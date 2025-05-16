import { HydrateClient } from '~/trpc/server'
import SignIn from '../_components/Signin'
import { auth } from '~/server/auth'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await auth()
  console.log('session', session)

  if (session?.user) {
    // redirect to home page
    redirect('/')
  }

  return (
    <HydrateClient>
      <SignIn />
    </HydrateClient>
  )
}
