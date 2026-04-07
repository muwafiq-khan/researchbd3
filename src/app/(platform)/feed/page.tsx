import PostCard from '../../../modules/posts/components/PostCard'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../app/api/auth/[...nextauth]/route'
import React from 'react' // Add this at the very top
export default async function FeedPage() {
  const session = await getServerSession(authOptions)
  const currentUserId = session?.user?.id ?? null

  const posts = await prisma.posts.findMany({
    where: { visibility: 'public' },
    include: {
      author: {
        select: {
          displayName: true,
          avatarUrl: true,
        }
      },
      // Instead of fetching all reactions, we only fetch the one belonging to the user
      reactions: {
        where: {
          userId: currentUserId
        }
      },
      // Use Prisma's native counter for the total number of likes
      _count: {
        select: { reactions: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="py-4 px-4 flex flex-col gap-4">
      {posts.map((post) => {
        // No loop needed! If the array has 1 item, the user liked it.
        const initialLiked = post.reactions.length > 0
        const likeCount = post._count.reactions

        return (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            postType={post.postType}
            authorName={post.author.displayName}
            authorAvatar={post.author.avatarUrl ?? ''}
            createdAt={post.createdAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            likeCount={likeCount}
            initialLiked={initialLiked}
          />
        )
      })}
    </div>
  )
}