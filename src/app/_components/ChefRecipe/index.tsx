interface ChefRecipeProps {
  userID: string
  recipeID: string
}

export default async function ChefRecipe(
  props: Promise<ChefRecipeProps>,
) {
  const params = await props
  const { userID, recipeID } = params

  return (
    <div>
      <h1>
        Chef {userID} Recipe {recipeID}
      </h1>
      <p>This is the chef recipe page.</p>
    </div>
  )
}
