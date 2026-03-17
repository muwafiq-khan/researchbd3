'use client'
// 'use client' MUST be the very first line of the file.
// This tells Next.js: send this component's JavaScript to the browser.
// Without this line, every component is a Server Component by default.
// This component NEEDS to run in the browser because it handles clicks and tracks state.

// useState is a React hook — it lets a component remember a value between renders.
// We import it explicitly because nothing is global in JavaScript modules.
// Python equivalent: from react import useState
import { useState } from 'react'

// --- TYPE DEFINITION ---
type LikeButtonProps = {
  postId: string       // which post this button belongs to
  initialCount: number // how many likes the post already has when page loads
}

// --- COMPONENT ---
// Note: using function keyword, not arrow function — same as Python def
// function LikeButton(props: LikeButtonProps) would also work
// but we destructure directly in the parameter for cleaner code
export default function LikeButton({
  postId,
  initialCount,
}: LikeButtonProps) {

  // --- STATE ---
  // useState is a function that returns an ARRAY of exactly two items:
  // [currentValue, functionToUpdateValue]
  // We destructure that array immediately into two variables.
  //
  // Python equivalent thinking:
  // liked, set_liked = use_state(False)
  // count, set_count = use_state(initial_count)
  //
  // When setLiked or setCount is called, React re-renders this component
  // with the new values. The component function runs again from top to bottom.
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialCount)

  // --- EVENT HANDLER ---
  // This function runs when the button is clicked.
  // It lives inside the component function — it has access to liked, count, setLiked, setCount.
  // Python equivalent:
  // def handle_like():
  //     nonlocal liked, count
  //     if liked:
  //         set_liked(False)
  //         set_count(count - 1)
  //     else:
  //         set_liked(True)
  //         set_count(count + 1)
  function handleLike() {
    if (liked) {
      // user is unliking — was liked, now removing like
      setLiked(false)
      setCount(count - 1)
    } else {
      // user is liking — was not liked, now adding like
      setLiked(true)
      setCount(count + 1)
    }
  }

  // --- RENDER ---
  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
        liked
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-600 border-gray-300'
      }`}
    >
      {liked ? '👍 Liked' : '👍 Like'} {count}
    </button>
  )
}