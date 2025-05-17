import ChefRecipe from '~/app/_components/ChefRecipe'
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
      <ChefRecipe userID={userID} recipeID={recipeID} />
    </HydrateClient>
  )
}
