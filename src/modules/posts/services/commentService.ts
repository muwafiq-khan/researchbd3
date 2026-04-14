import {
  getPostById,
  getCommentById,
  getAncestorChain,
  getDirectChildren,
  getTopLevelComments,
} from '../repository/commentRepo'

// ============================================================
// COMMENT SERVICE
// Business logic layer. Takes raw data from the repo and shapes
// it into structures the page needs. This is where sorting rules,
// blob assembly, and priority logic live.
//
// The page calls service functions. The service calls repo functions.
// The page never touches the repo directly.
// ============================================================

// ── Types ────────────────────────────────────────────────────

// A blob = one parent comment + its top 2 child replies.
// This is the visual unit on the comment thread page.
type CommentBlob = {
  parent: CommentData
  topChildren: CommentData[]
}

// Shape of a single comment as returned by the repo.
// Matches the `select` in commentRepo queries.
type CommentData = {
  id: string
  postId: string
  userId: string
  parentId: string | null
  depth: number
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

// ── Get post data for the header ──────────────────────────────
// Thin wrapper around the repo. Exists in the service layer so
// the page only imports from one place (the service).
export async function getPost(postId: string) {
  return getPostById(postId)
}

// ── Build breadcrumb trail ────────────────────────────────────
// Returns all ancestors of a comment in top-down order.
// The page renders these as clickable links above the focused comment.
export async function getBreadcrumbs(commentId: string) {
  return getAncestorChain(commentId)
}

// ── Build blobs for a focused comment ─────────────────────────
// This is the main function the page calls when a user clicks
// into a specific comment thread.
//
// Returns:
//   focusedComment — the comment matching commentId (rendered as header)
//   blobs — array of { parent, topChildren } for each direct reply
//
// Each direct reply to the focused comment becomes a blob parent.
// Each blob parent gets its top 2 children (sorted by priority).
export async function getThreadBlobs(commentId: string) {

  // 1. Fetch the focused comment itself
  const focusedComment = await getCommentById(commentId)
  if (!focusedComment) return null

  // 2. Fetch all direct replies to the focused comment
  //    These become the "blob parents"
  const directReplies = await getDirectChildren(commentId) as CommentData[]

  // 3. For each blob parent, fetch ITS children and pick top 2
  const blobs: CommentBlob[] = []

  for (const reply of directReplies) {
    // Get all children of this reply
    const children = await getDirectChildren(reply.id) as CommentData[]

    // Sort by priority: parent comment author's reply first, then by likes
    const topTwo = sortChildrenByPriority(children, reply.userId)

    blobs.push({
      parent: reply,
      topChildren: topTwo,
    })
  }

  return {
    focusedComment: focusedComment as CommentData,
    blobs: blobs,
  }
}

// ── Build blobs for top-level view (no focused comment) ───────
// Used when user opens comments for a post without clicking
// into any specific thread. Shows top-level comments as blob parents.
export async function getTopLevelBlobs(postId: string) {

  // 1. Fetch all top-level comments (parentId = null)
  const topLevelComments = await getTopLevelComments(postId) as CommentData[]

  // 2. For each top-level comment, build a blob with its top 2 children
  const blobs: CommentBlob[] = []

  for (const comment of topLevelComments) {
    const children = await getDirectChildren(comment.id) as CommentData[]
    const topTwo = sortChildrenByPriority(children, comment.userId)

    blobs.push({
      parent: comment,
      topChildren: topTwo,
    })
  }

  return { blobs: blobs }
}

// ── Priority sorting for child comments ───────────────────────
// Rule:
//   1st priority: parent comment author's own reply (they responded
//      to someone in their own thread — that reply matters most)
//   2nd priority: highest likeCount (community-validated best response)
//
// Returns only the top 2 results.
//
// parentAuthorId = the userId of the blob's parent comment.
// If the parent author replied to their own comment, that reply
// gets promoted to the top regardless of like count.
function sortChildrenByPriority(children: CommentData[], parentAuthorId: string): CommentData[] {

  if (children.length === 0) return []

  // Separate author's reply from the rest
  // find the FIRST reply by the parent comment's author
  let authorReply: CommentData | null = null
  const otherReplies: CommentData[] = []

  for (const child of children) {
    // First match only — if author replied multiple times,
    // only the first one gets priority treatment
    if (child.userId === parentAuthorId && authorReply === null) {
      authorReply = child
    } else {
      otherReplies.push(child)
    }
  }

  // Sort the rest by likeCount descending (most liked first)
  otherReplies.sort(function(a, b) {
    return b.likeCount - a.likeCount
  })

  // Assemble: author's reply first (if exists), then top liked
  const sorted: CommentData[] = []
  if (authorReply) sorted.push(authorReply)
  sorted.push(...otherReplies)

  // Return only the top 2
  return sorted.slice(0, 2)
}
