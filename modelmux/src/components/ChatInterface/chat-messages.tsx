import { Message } from "./chat-interface";
import { ChatMessageBubble } from "./chat-message-bubble";

interface ChatMessagesProps {
  chatLog: Message[];
  onRetry: (message: Message, modelName: string) => void;
}

export function ChatMessages({ chatLog, onRetry }: ChatMessagesProps) {
  return (
    <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
      {chatLog.map((message) => (
        <ChatMessageBubble key={message.id} message={message} onRetry={onRetry} />
      ))}
    </div>
  );
} 