import { Message } from "./chat-interface";
import { ChatMessageBubble } from "./chat-message-bubble";

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
} 