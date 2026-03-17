// Route: /profile/some-user-id
// This is viewing ANOTHER user's public profile
export default function UserProfilePage({ params }: { params: { userId: string } }) {
  return (
    <div>
      <h1>USER PROFILE PAGE</h1>
      <p>Viewing profile of user: {params.userId}</p>
    </div>
  )
}