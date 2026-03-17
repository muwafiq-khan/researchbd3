// Route: /competitions/some-id
export default function CompetitionDetailPage({ params }: { params: { competitionId: string } }) {
  return (
    <div>
      <h1>COMPETITION DETAIL PAGE</h1>
      <p>Competition ID: {params.competitionId}</p>
    </div>
  )
}