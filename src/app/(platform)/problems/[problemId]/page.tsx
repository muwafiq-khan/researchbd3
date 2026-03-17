// Route: /problems/anything-here
export default function ProblemDetailPage({ params }: { params: { problemId: string } }) {
  return (
    <div>
      <h1>PROBLEM DETAIL PAGE</h1>
      <p>Problem ID from URL: {params.problemId}</p>
    </div>
  )
}