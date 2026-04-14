import Link from 'next/link'
import { getPost, getTopLevelBlobs } from '../../../../../modules/posts/services/commentService'
import CommentBlob from '../../../../../modules/posts/components/CommentBlob'

export default async function CommentsPage({
  params,
}: {
  params: Promise<{ postId: string }>
}) {

  // Next.js 16: params is a Promise
  const { postId } = await params

  // Fetch post data and top-level blobs from the service layer
  const post = await getPost(postId)
  const threadData = await getTopLevelBlobs(postId)

  if (!post) {
    return (
      <div className="p-6 text-center text-zinc-500">
        Post not found.
      </div>
    )
  }

  const { blobs } = threadData

  return (
    <div className="flex flex-col">

      {/* ── Post Header ──────────────────────────────────────── */}
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

      {/* ── Section Label ────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="text-zinc-400 text-sm font-semibold">
          Comments · {blobs.length}
        </h3>
      </div>

      {/* ── Top-Level Blobs ──────────────────────────────────── */}
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
          No comments yet.
        </div>
      )}

    </div>
  )
}
