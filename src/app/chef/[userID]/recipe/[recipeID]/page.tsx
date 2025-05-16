type Props = {
  params: {
    userID: string
    recipeID: string
  }
}

export default async function RecipePage({ params }: Props) {
  const { userID, recipeID } = params

  return (
    <div>
      <h1>User: {userID}</h1>
      <h2>Recipe: {recipeID}</h2>
    </div>
  )
}
