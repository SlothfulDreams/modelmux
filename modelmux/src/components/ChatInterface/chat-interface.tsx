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

interface ChatInterfaceProps {
  isSubSection?: boolean;
}

export function ChatInterface({ isSubSection = false }: ChatInterfaceProps) {
  // UI state
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  // LLM State
  const [promptHistory, setPromptHistory] = useState<MemoryMessage[]>([]);

  // TODO: Remove this later
  window.api.searchDuckDuckGo("https://en.wikipedia.org/wiki/War_of_1812");

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
      (item) => item.content === messsageToRetry.content,
    );

    const messageIndex = chatLog.findIndex(
      (item) => item.content === messsageToRetry.content,
    );

    const currentMessage: MemoryMessage = {
      role: "user",
      content: messsageToRetry.content,
    };

    const newPromptHistory = promptHistory.slice(0, index);
    const newChatLog = chatLog.slice(0, messageIndex);

    const { message, data } = await Response(
      currentMessage,
      newPromptHistory,
      model,
    );

    const llmMessage: MemoryMessage = {
      role: "assistant",
      content: message,
    };

    setPromptHistory([...newPromptHistory, currentMessage, llmMessage]);
    setChatLog([...newChatLog, data]);
  };

  const chatContainerClasses = isSubSection
    ? "flex flex-col h-full bg-background"
    : "flex flex-col h-screen bg-background";

  return (
    <div className={chatContainerClasses}>
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
