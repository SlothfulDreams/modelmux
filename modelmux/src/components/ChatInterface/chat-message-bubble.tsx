import { Message } from "./chat-interface";
import { ChatMessageActions } from "./chat-message-actions";
import { RetryContext } from "./Context/ChatContext";

interface ChatMessageBubbleProps {
  message: Message;
  onRetry: (message: Message, modelName: string) => void;
}

export function ChatMessageBubble({
  message,
  onRetry,
}: ChatMessageBubbleProps) {
  const handleRetryForThisMessage = (modelName: string) => {
    onRetry(message, modelName);
  };

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
      {!message.isUser && (
        <RetryContext value={handleRetryForThisMessage}>
          <ChatMessageActions />
        </RetryContext>
      )}
    </div>
  );
}
