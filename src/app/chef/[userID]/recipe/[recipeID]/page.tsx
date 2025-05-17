import Chef from '~/app/_components/Chef'
import Recipe from '~/app/_components/Recipe'
import { HydrateClient } from '~/trpc/server'

type Props = {
  params: Promise<{
    userID: string
    recipeID: string
  }>
}

export default async function RecipePage(props: Props) {
  const params = await props.params
  const { userID, recipeID } = params

  return (
    <HydrateClient>
      <Chef userID={userID} />
      <Recipe recipeID={recipeID} />
    </HydrateClient>
  )
}
