import Link from 'next/link'

// ── Types ────────────────────────────────────────────────────
type BreadcrumbComment = {
  id: string
  content: string
  isDeleted: boolean
  user: {
    displayName: string
  }
}

type CommentBreadcrumbProps = {
  comment: BreadcrumbComment
  postId: string
}

// ── Component ────────────────────────────────────────────────
// Renders one ancestor comment in the breadcrumb trail.
// Muted style — this is context, not the focus. Clickable — takes
// user to that comment's thread view (going "up" the tree).
//
// Server Component — no 'use client' needed. It's just a Link
// with some text. No interactivity beyond clicking.
export default function CommentBreadcrumb({ comment, postId }: CommentBreadcrumbProps) {
  return (
    <Link
      href={'/posts/' + postId + '/comments/' + comment.id}
      className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-900/50 transition-colors"
    >
      {/* Vertical line indicating "this is part of the thread chain" */}
      <div className="w-0.5 h-8 bg-zinc-700 rounded-full shrink-0" />

      <div className="min-w-0">
        <p className="text-zinc-500 text-xs font-medium">
          {comment.isDeleted ? '[deleted]' : comment.user.displayName}
        </p>
        <p className="text-zinc-400 text-sm truncate">
          {comment.isDeleted ? '[this comment has been deleted]' : comment.content}
        </p>
      </div>
    </Link>
  )
}
