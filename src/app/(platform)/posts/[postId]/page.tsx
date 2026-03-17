// Route: /posts/anything-here
// [postId] is a dynamic segment — this page matches /posts/abc, /posts/xyz-123, etc.
// The { params } prop is how Next.js passes the actual URL value into your page.
// Python equivalent: def post_detail(request, post_id): — Django passes URL params as function args

export default function PostDetailPage({ params }: { params: { postId: string } }) {
  return (
    <div>
      <h1>POST DETAIL PAGE</h1>
      {/* {} means: run JavaScript here and render the result */}
      {/* params.postId gives us whatever was in the URL */}
      <p>Post ID from URL: {params.postId}</p>
    </div>
  )
}