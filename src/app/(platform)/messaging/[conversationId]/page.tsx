// Route: /messaging/some-conversation-id
// Opens a specific conversation
export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  return (
    <div>
      <h1>CONVERSATION PAGE</h1>
      <p>Conversation ID: {params.conversationId}</p>
    </div>
  )
}