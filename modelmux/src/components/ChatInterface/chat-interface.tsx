import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Response, generateSingleEmbedding } from "@/lib/ollama";
import { chromaDB } from "@/lib/chromadb";

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
  useEmbeddings?: boolean;
  isEmbedded?: boolean;
}

export function ChatInterface({
  useEmbeddings = false,
  isEmbedded = false,
}: ChatInterfaceProps) {
  // UI state
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  // LLM State
  const [promptHistory, setPromptHistory] = useState<MemoryMessage[]>([]);

  const createMemoryMessage = (
    role: "user" | "assistant",
    content: string,
  ): MemoryMessage => ({
    role,
    content,
  });

  const updateChatState = (
    userMessage: MemoryMessage,
    llmMessage: MemoryMessage,
    data: Message,
  ) => {
    setPromptHistory((prev) => [...prev, userMessage, llmMessage]);
    setChatLog((prev) => [...prev, data]);
  };

  const handleLLMResponse = async (
    userMessage: MemoryMessage,
    model?: string,
  ) => {
    const { message, data } = await Response(userMessage, promptHistory, model);
    const llmMessage = createMemoryMessage("assistant", message);
    updateChatState(userMessage, llmMessage, data);
    return { message, data };
  };

  const handleSendMessage = async (model?: string) => {
    if (!inputValue.trim()) return;

    const newUserMessage = createMemoryMessage("user", inputValue);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setChatLog((prev) => [...prev, userMessage]);

    try {
      if (useEmbeddings) {
        console.log("Chat: Generating embedding for query...");
        const queryEmbedding = await generateSingleEmbedding(inputValue);
        console.log(
          "Chat: Query embedding generated, length:",
          queryEmbedding.length,
        );

        const searchResults = await chromaDB.queryCollection(
          inputValue,
          queryEmbedding,
          5,
        );

        let contextualMessage = newUserMessage;
        if (searchResults.documents && searchResults.documents[0].length > 0) {
          const context = searchResults.documents[0].join("\n\n");
          console.log(
            "Chat: Adding context to message, context length:",
            context.length,
          );
          contextualMessage = createMemoryMessage(
            "user",
            `Context from knowledge base:\n${context}\n\nUser question: ${inputValue}`,
          );
        } else {
          console.log(
            "Chat: No relevant context found, proceeding without context",
          );
        }

        console.log("Chat: Generating LLM response with context...");
        await handleLLMResponse(contextualMessage, model);
        console.log("Chat: Embedding-enhanced response completed");
      } else {
        console.log(
          "Chat: Using basic mode (no embeddings) for query:",
          inputValue,
        );
        await handleLLMResponse(newUserMessage, model);
        console.log("Chat: Basic response completed");
      }
    } catch (error) {
      console.error(
        "Chat: Failed to query ChromaDB or generate response:",
        error,
      );
      console.log("Chat: Falling back to basic mode");
      await handleLLMResponse(newUserMessage, model);
    }

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

  const chatContainerClasses = isEmbedded
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
