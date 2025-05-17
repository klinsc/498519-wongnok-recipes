export default async function SignIn(props: {
  params: Promise<{
    blogId: string
  }>
}) {
  const params = await props.params
  const { blogId } = params

  return (
    <div>
      <h1>Sign In</h1>
      <p>Blog ID: {blogId}</p>
      {/* Add your sign-in form or component here */}
    </div>
  )
}
