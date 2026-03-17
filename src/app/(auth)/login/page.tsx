// src/app/(auth)/login/page.tsx
// This file = the /login route
// In Django terms: the view function that renders the login page

export default function LoginPage() {
  // export default = this is the main thing this file exports
  // function LoginPage() = a React component, just a function that returns JSX
  return (
    <div>
      {/* This text just confirms this route is wired correctly */}
      <h1>LOGIN PAGE</h1>
      <p>Route: /login</p>
    </div>
  )
}