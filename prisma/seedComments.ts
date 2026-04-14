import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  // ── Grab existing users and a post to attach comments to ────
  // We need real IDs from the database. These users were created
  // by the main seed.ts file.
  const rahim = await prisma.users.findUnique({ where: { email: 'rahim@test.com' } })
  const nusrat = await prisma.users.findUnique({ where: { email: 'nusrat@test.com' } })
  const kamal = await prisma.users.findUnique({ where: { email: 'kamal@test.com' } })
  const greenbd = await prisma.users.findUnique({ where: { email: 'greenbd@test.com' } })

  if (!rahim || !nusrat || !kamal || !greenbd) {
    console.error('Users not found. Run main seed first: npx tsx prisma/seed.ts')
    return
  }

  // Grab Rahim's collaboration post — the first post in the seed
  const post = await prisma.posts.findFirst({
    where: { authorId: rahim.id, postType: 'collaboration' },
  })

  if (!post) {
    console.error('Post not found. Run main seed first.')
    return
  }

  console.log('Seeding comments on post:', post.title)
  console.log('Post ID:', post.id)

  // ── Clean up old comments (re-runnable) ─────────────────────
  // Delete in order: likes first (FK dependency), then comments
  await prisma.comment_likes.deleteMany({})
  await prisma.comments.deleteMany({})

  // ============================================================
  // COMMENT TREE STRUCTURE
  //
  // We're building this tree:
  //
  // Post: "Looking for collaborators on climate change..."
  // │
  // ├─ C1 (Nusrat): top-level comment
  // │  ├─ C1-A (Rahim): author of post replies (depth 1)
  // │  ├─ C1-B (Kamal): another reply (depth 1)
  // │  │  ├─ C1-B-1 (Nusrat): reply to Kamal (depth 2)
  // │  │  ├─ C1-B-2 (Rahim): reply to Kamal (depth 2)
  // │  │  └─ C1-B-3 (Kamal): Kamal replies to himself (depth 2)
  // │  └─ C1-C (Nusrat): Nusrat adds more (depth 1)
  // │
  // ├─ C2 (Kamal): top-level comment
  // │  ├─ C2-A (Nusrat): reply (depth 1)
  // │  └─ C2-B (Rahim): reply (depth 1)
  // │
  // └─ C3 (Rahim): top-level comment (no replies)
  //
  // This gives us:
  // - Top-level blobs with children (C1, C2)
  // - A top-level with no children (C3)
  // - Nested depth 2 comments (C1-B's children)
  // - Author's own replies (Kamal replying in his own thread)
  // - Multiple levels to test breadcrumb navigation
  // ============================================================

  // ── Top-level comments (depth 0, parentId = null) ───────────

  const c1 = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: nusrat.id,
      parentId: null,
      depth: 0,
      content: 'This is exactly the kind of research Bangladesh needs right now. I have been working on climate data analysis for the Sundarbans region — would love to contribute.',
      likeCount: 12,
      replyCount: 3,
    },
  })

  const c2 = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: kamal.id,
      parentId: null,
      depth: 0,
      content: 'Have you considered the socioeconomic angle? Climate change impact studies without economic modeling miss half the picture.',
      likeCount: 8,
      replyCount: 2,
    },
  })

  const c3 = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: rahim.id,
      parentId: null,
      depth: 0,
      content: 'Update: We have secured initial data access from BUET meteorological department. Looking for 2 more collaborators.',
      likeCount: 5,
      replyCount: 0,
    },
  })

  // ── Replies to C1 (depth 1) ─────────────────────────────────

  const c1a = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: rahim.id,
      parentId: c1.id,
      depth: 1,
      content: 'That would be fantastic, Nusrat. Your Sundarbans data would fill a huge gap in our dataset. Can you share your methodology?',
      likeCount: 7,
      replyCount: 0,
    },
  })

  const c1b = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: kamal.id,
      parentId: c1.id,
      depth: 1,
      content: 'I have published extensively on mangrove ecosystem resilience. The data from 2020-2024 shows accelerating degradation patterns.',
      likeCount: 15,
      replyCount: 3,
    },
  })

  const c1c = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: nusrat.id,
      parentId: c1.id,
      depth: 1,
      content: 'Also tagging @greenbd — they funded similar research last year.',
      likeCount: 3,
      replyCount: 0,
    },
  })

  // ── Replies to C1-B (depth 2) — this tests deeper nesting ──

  const c1b1 = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: nusrat.id,
      parentId: c1b.id,
      depth: 2,
      content: 'Prof. Kamal, could you share the 2023 degradation data? My analysis covers 2020-2022 only.',
      likeCount: 4,
      replyCount: 0,
    },
  })

  const c1b2 = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: rahim.id,
      parentId: c1b.id,
      depth: 2,
      content: 'This aligns with our preliminary findings. The rate is about 3x what IPCC projected for this region.',
      likeCount: 9,
      replyCount: 0,
    },
  })

  const c1b3 = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: kamal.id,
      parentId: c1b.id,
      depth: 2,
      content: 'I will upload the full dataset to our shared repository by next week. Includes satellite imagery analysis.',
      likeCount: 6,
      replyCount: 0,
    },
  })

  // ── Replies to C2 (depth 1) ─────────────────────────────────

  const c2a = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: nusrat.id,
      parentId: c2.id,
      depth: 1,
      content: 'Agreed. Economic displacement data from coastal regions would strengthen the study enormously.',
      likeCount: 6,
      replyCount: 0,
    },
  })

  const c2b = await prisma.comments.create({
    data: {
      postId: post.id,
      userId: rahim.id,
      parentId: c2.id,
      depth: 1,
      content: 'Good point. We are planning to include economic impact as Phase 2 of the study.',
      likeCount: 4,
      replyCount: 0,
    },
  })

  // ── Seed some likes for testing ─────────────────────────────
  // These should match the likeCount values we set above.
  // In production, likeCount would be incremented when a like is
  // created. For seed data, we set both manually.
  await prisma.comment_likes.createMany({
    skipDuplicates: true,
    data: [
      { userId: rahim.id, commentId: c1.id },
      { userId: kamal.id, commentId: c1.id },
      { userId: rahim.id, commentId: c1b.id },
      { userId: nusrat.id, commentId: c1b.id },
      { userId: rahim.id, commentId: c2.id },
      { userId: nusrat.id, commentId: c1b2.id },
    ],
  })

  console.log('')
  console.log('Comment seed complete!')
  console.log('')
  console.log('To test, visit:')
  console.log('  /posts/' + post.id + '/comments/' + c1.id)
  console.log('  /posts/' + post.id + '/comments/' + c1b.id)
  console.log('  /posts/' + post.id + '/comments/' + c2.id)
  console.log('')
  console.log('Comment IDs for reference:')
  console.log('  C1 (Nusrat, top-level):', c1.id)
  console.log('  C1-B (Kamal, depth 1, has 3 children):', c1b.id)
  console.log('  C2 (Kamal, top-level):', c2.id)
  console.log('  C3 (Rahim, top-level, no replies):', c3.id)
}

main()
  .catch(function(e) {
    console.error(e)
    process.exit(1)
  })
  .finally(async function() {
    await prisma.$disconnect()
  })
