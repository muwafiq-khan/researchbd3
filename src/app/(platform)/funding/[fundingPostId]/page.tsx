// Route: /funding/some-id
export default function FundingDetailPage({ params }: { params: { fundingPostId: string } }) {
  return (
    <div>
      <h1>FUNDING DETAIL PAGE</h1>
      <p>Funding Post ID: {params.fundingPostId}</p>
    </div>
  )
}