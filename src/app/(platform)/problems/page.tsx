import { prisma } from '../../../lib/prisma'

function getUrgencyColor(urgencyLevel: string) {
  if (urgencyLevel === 'critical') return 'bg-red-500'
  if (urgencyLevel === 'moderate') return 'bg-yellow-500'
  return 'bg-green-500'
}

function getUrgencyLabel(urgencyLevel: string) {
  if (urgencyLevel === 'critical') return 'Critical'
  if (urgencyLevel === 'moderate') return 'Moderate'
  return 'Exploratory'
}

export default async function ProblemsPage() {

  const problems = await prisma.problems.findMany({
    where: { isActive: true },
    include: {
      subfield: {
        include: {
          field: true
        }
      }
    },
    orderBy: { urgencyLevel: 'asc' }
  })

  return (
    <div className="flex flex-col divide-y divide-zinc-800">
      {problems.map(function(problem) {
        return (
          <a
            key={problem.id}
            href={`/problems/${problem.id}`} //instd of link,cldnt we detect click and id,then to http req?
            className="block px-4 py-5 hover:bg-zinc-950 transition-colors"
          >
            {/* top meta row */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getUrgencyColor(problem.urgencyLevel)}`} />
              <span className="text-xs font-medium text-zinc-400">{getUrgencyLabel(problem.urgencyLevel)}</span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-xs text-zinc-400">{problem.subfield.field.name}</span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-xs text-zinc-400">{problem.subfield.name}</span>
              {problem.country && (
                <>
                  <span className="text-zinc-600 text-xs">·</span>
                  <span className="text-xs text-zinc-400">{problem.country}</span>
                </>
              )}
            </div>

            {/* title */}
            <h2 className="text-white font-bold text-lg leading-snug mb-2">
              {problem.title}
            </h2>

            {/* description */}
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-4">
              {problem.description}
            </p>

            {/* full width image */}
            {problem.thumbnailUrl && (
              <img
                src={problem.thumbnailUrl}
                alt={problem.title}
                className="w-full h-56 object-cover rounded-xl"
              />
            )}

          </a>
        )
      })}
    </div>
  )
}