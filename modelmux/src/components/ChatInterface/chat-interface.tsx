import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Response } from "@/lib/ollama";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface MemoryMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export function ChatInterface() {
  // UI state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  // LLM State
  const [memory, setMemory] = useState<MemoryMessage[]>([]);

  const handleSendMessage = async (model?: string) => {
    const newUserMessage: MemoryMessage = { role: "user", content: inputValue };
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // LLM response
    const { message, data } = await Response(newUserMessage, memory);
    const llmMessage: MemoryMessage = {
      role: "assistant",
      content: message,
    };

    setMemory((prev) => [...prev, newUserMessage, llmMessage]);

    setMessages((prev) => [...prev, data]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetryModel = async (messsageToRetry: Message, model: string) => {
    const index = memory.findIndex(
      (item) => item.content === messsageToRetry.content
    );

    const messageIndex = messages.findIndex(
      (item) => item.content === messsageToRetry.content
    );

    const newMemory = memory.slice(0, index + 1);
    const newMessage = messages.slice(0, messageIndex + 1);

    setMemory(newMemory);
    setMessages(newMessage);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ScrollArea className="flex-1 p-4">
        <ChatMessages messages={messages} />
      </ScrollArea>
      <div className="p-4 border-t bg-background sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onSend={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
