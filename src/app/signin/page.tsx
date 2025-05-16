import { HydrateClient } from '~/trpc/server'
import SignIn from '../_components/Signin'

export default function SignInPage() {
  return (
    <HydrateClient>
      <SignIn />
    </HydrateClient>
  )
}
