import { auth } from '~/server/auth'
import { api, HydrateClient } from '~/trpc/server'
import Blog from './_components/Blog/Main'

export default async function Home() {
  const session = await auth()
  console.log('session', session)

  if (session?.user) {
    void api.post.getLatest.prefetch()
  }

  return (
    <HydrateClient>
      <main>
        <Blog />
      </main>
    </HydrateClient>
  )
}
