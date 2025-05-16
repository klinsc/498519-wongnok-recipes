import { HydrateClient } from '~/trpc/server'
import SignUp from '~/app/_components/Signup'

export default function SignInPage() {
  return (
    <HydrateClient>
      <SignUp />
    </HydrateClient>
  )
}
