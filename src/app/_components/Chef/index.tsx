export default function Profile({ userID }: { userID: string }) {
  return (
    <div>
      <h1>Profile of {userID}</h1>
      <p>This is the profile page.</p>
    </div>
  )
}
