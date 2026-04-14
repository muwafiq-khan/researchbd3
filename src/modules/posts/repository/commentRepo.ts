import { prisma } from '../../../lib/prisma'

// ============================================================
// COMMENT REPO
// Pure database access layer. Every function here does ONE thing:
// run a Prisma query and return the result. No business logic,
// no sorting, no data transformation.
//
// The service layer calls these functions, combines their results,
// and applies business rules (priority sorting, blob assembly).
// ============================================================

// ── Fetch a single post by ID ─────────────────────────────────
// Used to render the post at the top of the comment thread page.
// Only selects the fields we need for display — not the full post.
export async function getPostById(postId: string) {
  return prisma.posts.findUnique({
    where: { id: postId },
    select: {
      id: true,
      title: true,
      postType: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  })
}

// ── Fetch a single comment by ID ──────────────────────────────
// Used for breadcrumbs and for the focused comment itself.
// Includes the author info for display.
export async function getCommentById(commentId: string) {
  return prisma.comments.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      postId: true,
      userId: true,
      parentId: true,
      depth: true,
      content: true,
      isEdited: true,
      isDeleted: true,
      likeCount: true,
      replyCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  })
}

// ── Walk up the parent chain to build breadcrumbs ─────────────
// Starting from a comment, follows parentId upward until it
// reaches a top-level comment (parentId = null).
//
// Returns array in top-down order: [oldest ancestor, ..., direct parent]
// Does NOT include the comment itself — that's the "focused" comment,
// rendered separately.
//
// Example: comment 61's parent is 15, 15's parent is 3, 3's parent is 1
//   getAncestorChain("61") → [comment1, comment3, comment15]
export async function getAncestorChain(commentId: string) {

  // We'll collect ancestors here, then reverse at the end
  const ancestors = []

  // Start by fetching the comment itself to get its parentId
  let current = await prisma.comments.findUnique({
    where: { id: commentId },
    select: { parentId: true },
  })

  // Walk upward until we hit a top-level comment (parentId = null)
  while (current?.parentId) {
    // Fetch the parent comment with full display data
    const parent = await getCommentById(current.parentId)
    if (!parent) break

    // Add to front of array so order is top-down
    ancestors.unshift(parent)

    // Move up one level
    current = { parentId: parent.parentId }
  }

  return ancestors
}

// ── Fetch direct children of a comment ────────────────────────
// Returns ALL direct replies to a given comment.
// The service layer will sort these and pick the top 2 per blob.
// Ordered by createdAt so the service has a stable base to work with.
export async function getDirectChildren(parentId: string) {
  return prisma.comments.findMany({
    where: {
      parentId: parentId,
      isDeleted: false,
    },
    select: {
      id: true,
      postId: true,
      userId: true,
      parentId: true,
      depth: true,
      content: true,
      isEdited: true,
      isDeleted: true,
      likeCount: true,
      replyCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}

// ── Fetch top-level comments for a post ───────────────────────
// Used when viewing the initial comment page (no focused comment).
// Top-level = parentId is null, meaning direct comments on the post.
export async function getTopLevelComments(postId: string) {
  return prisma.comments.findMany({
    where: {
      postId: postId,
      parentId: null,
      isDeleted: false,
    },
    select: {
      id: true,
      postId: true,
      userId: true,
      parentId: true,
      depth: true,
      content: true,
      isEdited: true,
      isDeleted: true,
      likeCount: true,
      replyCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })
}
