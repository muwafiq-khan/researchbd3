// src/app/(platform)/feed/page.tsx
// SERVER COMPONENT
// Prepares data, passes to PostCard
// PostCard internally renders LikeButton
// Clean separation — page just coordinates, components handle rendering

import PostCard from '../../../modules/posts/components/PostCard'

const mockPosts = [
  {
    id: 'post-001',
    title: 'Looking for collaborators on climate change impact study in Bangladesh',
    postType: 'collaboration',
    authorName: 'Dr. Rahim Uddin',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    likeCount: 12,
    createdAt: 'March 10, 2026',
  },
  {
    id: 'post-002',
    title: 'Need help with statistical analysis for my thesis on water quality',
    postType: 'help',
    authorName: 'Nusrat Jahan',
    authorAvatar: 'https://i.pravatar.cc/150?img=2',
    likeCount: 5,
    createdAt: 'March 11, 2026',
  },
  {
    id: 'post-003',
    title: 'Published: Machine learning approach to crop yield prediction',
    postType: 'finished_work',
    authorName: 'Prof. Kamal Hossain',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    likeCount: 34,
    createdAt: 'March 9, 2026',
  },
  {
    id: 'post-004',
    title: 'Funding available for renewable energy research projects',
    postType: 'funding_opportunity',
    authorName: 'GreenBD Foundation',
    authorAvatar: 'https://i.pravatar.cc/150?img=4',
    likeCount: 8,
    createdAt: 'March 8, 2026',
  },
]

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Research Feed</h1>
      <div className="flex flex-col gap-6">
        {mockPosts.map(function(post) {
          return (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              postType={post.postType}
              authorName={post.authorName}
              authorAvatar={post.authorAvatar}
              createdAt={post.createdAt}
              likeCount={post.likeCount}
            />
          )
        })}
      </div>
    </div>
  )
}
