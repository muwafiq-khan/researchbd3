// app/(platform)/problems/[problemId]/page.tsx

import React from "react"

// Next.js passes params automatically for dynamic routes
export default function ProblemPage({
  params,
}: {
  params: { problemId: string }
}) {
  // extracting problemId from URL
  const problemId = params.problemId

  // still using mock data (temporary)
  const problem = {
    title: "Flood Prediction in Coastal Bangladesh",
    urgency: "HIGH",
    field: "Environmental Science",
    subfield: "Climate Modeling",
  }

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-3xl space-y-6">

        {/* showing the dynamic problemId */}
        <p className="text-xs text-zinc-500">
          Problem ID: {problemId}
        </p>

        <h1 className="text-3xl font-bold">
          {problem.title}
        </h1>

        <div className="inline-block px-3 py-1 rounded-full text-sm bg-red-500/10 text-red-400">
          Urgency: {problem.urgency}
        </div>

        <div className="text-sm text-zinc-400">
          {problem.field} → {problem.subfield}
        </div>

      </div>
    </div>
  )
}