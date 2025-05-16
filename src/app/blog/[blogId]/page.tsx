export default function SignIn(props: {
  params: {
    blogId: string
  }
}) {
  return (
    <div>
      <h1>Sign In</h1>
      <p>Blog ID: {props.params.blogId}</p>
      {/* Add your sign-in form or component here */}
    </div>
  )
}
