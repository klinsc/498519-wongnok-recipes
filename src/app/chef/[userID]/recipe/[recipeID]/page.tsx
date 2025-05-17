type Props = {
  params: Promise<{
    userID: string
    recipeID: string
  }>
}

export default async function RecipePage(props: Props) {
  const params = await props.params;
  const { userID, recipeID } = params

  return (
    <div>
      <h1>User: {userID}</h1>
      <h2>Recipe: {recipeID}</h2>
    </div>
  )
}
