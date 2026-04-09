import { prisma } from '../../../lib/prisma'
import ProblemFeed from '../../../modules/problems/components/ProblemFeed'

const PAGE_SIZE = 10

export default async function ProblemsPage() {

  // Fetch first batch on the server — no loading spinner for initial render.
  // ProblemFeed (Client Component) receives this as props.
  // Subsequent pages are fetched client-side via /api/problems.
  const problems = await prisma.problems.findMany({
    where: { isActive: true },
    include: {
      subfield: {
        include: {
          field: true
        }
      }
    },
    orderBy: { urgencyLevel: 'asc' },
    take: PAGE_SIZE,
  })

  const plainProblems = JSON.parse(JSON.stringify(problems))

  return <ProblemFeed initialProblems={plainProblems} />
}