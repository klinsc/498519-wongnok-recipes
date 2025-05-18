import { HydrateClient } from '~/trpc/server'
import Blog from './_components/Blog/Main'

export default async function Home() {
  return (
    <HydrateClient>
      <Blog />
    </HydrateClient>
  )
}
