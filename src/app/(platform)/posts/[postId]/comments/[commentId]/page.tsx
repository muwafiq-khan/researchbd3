import Link from 'next/link'
import {
  getPost,
  getBreadcrumbs,
  getThreadBlobs,
} from '../../../../../../modules/posts/services/commentService'
import CommentBreadcrumb from '../../../../../../modules/posts/components/CommentBreadcrumb'
import CommentBlob from '../../../../../../modules/posts/components/CommentBlob'

// ── Page Component ────────────────────────────────────────────
// Server Component — fetches all data on the server, renders HTML.
// No client-side state, no interactivity here.
//
// URL: /posts/[postId]/comments/[commentId]
// params gives us both IDs from the URL segments.
export default async function CommentThreadPage({
  params,
}: {
  params: Promise<{ postId: string; commentId: string }>
}) {

  // Next.js 16: params is a Promise — must await it
  const { postId, commentId } = await params

  // ── Fetch all data from the service layer ───────────────────
  // Three parallel-safe calls. Could use Promise.all for speed,
  // but keeping them sequential for clarity right now.
  const post = await getPost(postId)
  const breadcrumbs = await getBreadcrumbs(commentId)
  const threadData = await getThreadBlobs(commentId)

  // ── Guard: bail if post or comment doesn't exist ────────────
  if (!post || !threadData) {
    return (
      <div className="p-6 text-center text-zinc-500">
        Post or comment not found.
      </div>
    )
  }

  const { focusedComment, blobs } = threadData

  return (
    <div className="flex flex-col">

      {/* ── Post Header ──────────────────────────────────────── */}
      {/* Always at the top. Shows the original post this thread
          belongs to. Clickable — takes you back to the post page. */}
      <Link
        href={'/posts/' + postId}
        className="p-4 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-zinc-500 uppercase tracking-wide">
            {post.postType.replace('_', ' ')}
          </span>
        </div>
        <h2 className="text-white font-bold text-lg">{post.title}</h2>
        <p className="text-zinc-500 text-sm mt-1">
          {post.author.displayName}
        </p>
      </Link>

      {/* ── Breadcrumbs ──────────────────────────────────────── */}
      {/* The path we traversed to get here. Each ancestor comment
          is rendered as a muted, clickable block. Clicking one takes
          you to THAT comment's thread view — effectively going "up"
          the tree. */}
      {breadcrumbs.length > 0 && (
        <div className="border-b border-zinc-800">
          {breadcrumbs.map(function(ancestor) {
            return (
              <CommentBreadcrumb
                key={ancestor.id}
                comment={ancestor}
                postId={postId}
              />
            )
          })}
        </div>
      )}

      {/* ── Focused Comment ──────────────────────────────────── */}
      {/* The comment the user clicked into. Rendered with full
          emphasis — white text, larger, with author info. */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-zinc-700" />
          <div>
            <p className="text-white text-sm font-semibold">
              {focusedComment.isDeleted ? '[deleted]' : focusedComment.user.displayName}
            </p>
            <p className="text-zinc-500 text-xs">
              {new Date(focusedComment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
              {focusedComment.isEdited && ' · edited'}
            </p>
          </div>
        </div>
        <p className="text-white text-sm leading-relaxed">
          {focusedComment.isDeleted ? '[this comment has been deleted]' : focusedComment.content}
        </p>
        <div className="flex items-center gap-4 mt-3 text-zinc-500 text-xs">
          <span>{focusedComment.likeCount} likes</span>
          <span>{focusedComment.replyCount} replies</span>
        </div>
      </div>

      {/* ── Discussion Blobs ─────────────────────────────────── */}
      {/* Each blob is a direct reply to the focused comment,
          shown with its top 2 children and a "go deeper" line. */}
      {blobs.length > 0 ? (
        <div>
          {blobs.map(function(blob) {
            return (
              <CommentBlob
                key={blob.parent.id}
                blob={blob}
                postId={postId}
              />
            )
          })}
        </div>
      ) : (
        <div className="p-6 text-center text-zinc-600 text-sm">
          No replies yet.
        </div>
      )}

    </div>
  )
}
