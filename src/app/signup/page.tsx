import { HydrateClient } from '~/trpc/server'
import SignUp from '~/app/_components/Signup'
import { auth } from '~/server/auth'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await auth()
  console.log('session', session)
  if (session?.user) {
    redirect('/')
  }

  return (
    <HydrateClient>
      <SignUp />
    </HydrateClient>
  )
}
