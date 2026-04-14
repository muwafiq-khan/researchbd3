import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────
type CommentData = {
  id: string
  content: string
  isEdited: boolean
  isDeleted: boolean
  likeCount: number
  replyCount: number
  createdAt: Date
  user: {
    id: string
    displayName: string
    avatarUrl: string | null
  }
}

type CommentBlobProps = {
  blob: {
    parent: CommentData
    topChildren: CommentData[]
  }
  postId: string
}

// ── Component ────────────────────────────────────────────────
// Renders one discussion blob:
//   💬 Parent comment (a direct reply to the focused comment)
//   │  Child 1 (author's reply or top liked)
//   │  Child 2 (next best)
//   ┃  thick line → clickable, goes deeper into this thread
//
// The thick line at the bottom is a <Link>. Clicking it navigates
// to /posts/{postId}/comments/{parent.id} — making this blob's
// parent the new focused comment, with ITS children as new blobs.
export default function CommentBlob({ blob, postId }: CommentBlobProps) {
  const { parent, topChildren } = blob

  return (
    <div className="border-b border-zinc-800">

      {/* ── Parent Comment (blob header) ───────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-zinc-700 shrink-0" />
          <p className="text-white text-sm font-semibold">
            {parent.isDeleted ? '[deleted]' : parent.user.displayName}
          </p>
          <span className="text-zinc-600 text-xs">
            {new Date(parent.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {parent.isEdited && (
            <span className="text-zinc-600 text-xs">· edited</span>
          )}
        </div>
        <p className="text-zinc-200 text-sm leading-relaxed pl-9">
          {parent.isDeleted ? '[this comment has been deleted]' : parent.content}
        </p>
        <div className="flex items-center gap-4 mt-2 pl-9 text-zinc-500 text-xs">
          <span>{parent.likeCount} likes</span>
          <span>{parent.replyCount} replies</span>
        </div>
      </div>

      {/* ── Child Comments (top 2 by priority) ─────────────── */}
      {/* Indented with a thin vertical line connecting them
          to the parent. Shows the thread connection visually. */}
      {topChildren.length > 0 && (
        <div className="ml-9 border-l-2 border-zinc-700">
          {topChildren.map(function(child) {
            return (
              <div key={child.id} className="px-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-zinc-300 text-xs font-semibold">
                    {child.isDeleted ? '[deleted]' : child.user.displayName}
                  </p>
                  <span className="text-zinc-600 text-xs">
                    {new Date(child.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {child.isDeleted ? '[this comment has been deleted]' : child.content}
                </p>
                <div className="flex items-center gap-3 mt-1 text-zinc-600 text-xs">
                  <span>{child.likeCount} likes</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── "Go Deeper" Line ───────────────────────────────── */}
      {/* Only shown if this parent has more replies than the 2
          we're showing. The thick line is the visual signal:
          "this discussion continues — click to explore." */}
      {parent.replyCount > 0 && (
        <Link
          href={'/posts/' + postId + '/comments/' + parent.id}
          className="flex items-center gap-3 px-4 py-3 ml-9 hover:bg-zinc-900/50 transition-colors group"
        >
          <div className="w-1 h-6 bg-blue-500 rounded-full group-hover:bg-blue-400 transition-colors" />
          <span className="text-blue-500 text-xs font-medium group-hover:text-blue-400 transition-colors">
            View thread · {parent.replyCount} replies
          </span>
        </Link>
      )}

    </div>
  )
}
