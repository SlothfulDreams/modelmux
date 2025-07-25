import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Response } from "@/lib/ollama";
import { RetryContext } from "@/components/ChatInterface/Context/ChatContext";

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
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  // LLM State
  const [promptHistory, setPromptHistory] = useState<MemoryMessage[]>([]);

  const handleSendMessage = async (model?: string) => {
    const newUserMessage: MemoryMessage = { role: "user", content: inputValue };
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setChatLog((prev) => [...prev, userMessage]);

    // LLM response
    const { message, data } = await Response(newUserMessage, promptHistory);
    const llmMessage: MemoryMessage = {
      role: "assistant",
      content: message,
    };

    setPromptHistory((prev) => [...prev, newUserMessage, llmMessage]);

    setChatLog((prev) => [...prev, data]);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetryModel = async (messsageToRetry: Message, model: string) => {
    const index = promptHistory.findIndex(
      (item) => item.content === messsageToRetry.content
    );

    const messageIndex = chatLog.findIndex(
      (item) => item.content === messsageToRetry.content
    );

    const currentMessage: MemoryMessage = {
      role: "user",
      content: messsageToRetry.content,
    };

    const newPromptHistory = promptHistory.slice(0, index);
    const newChatLog = chatLog.slice(0, messageIndex + 1);

    const { message, data } = await Response(
      currentMessage,
      newPromptHistory,
      model
    );

    const llmMessage: MemoryMessage = {
      role: "assistant",
      content: message,
    };

    setPromptHistory([...newPromptHistory, currentMessage, llmMessage]);
    setChatLog([...newChatLog, data]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <ScrollArea className="flex-1 p-4">
        <ChatMessages chatLog={chatLog} onRetry={handleRetryModel} />
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
