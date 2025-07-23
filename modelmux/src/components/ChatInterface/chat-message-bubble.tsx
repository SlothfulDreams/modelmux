import { Message } from "./chat-interface";
import { ChatMessageActions } from "./chat-message-actions";

interface ChatMessageBubbleProps {
  message: Message;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  return (
    <div
      className={`inline-flex flex-col max-w-[80%] ${
        message.isUser ? "items-end self-end" : "items-start self-start"
      }`}
    >
      <div
        className={`rounded-lg p-4 relative group ${
          message.isUser ? "bg-accent text-accent-foreground" : "bg-muted"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span className="text-xs opacity-70 mt-2 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
      {!message.isUser && <ChatMessageActions />}
    </div>
  );
}
