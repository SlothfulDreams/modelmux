import ollama from "ollama";

interface MemoryMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

async function sendModelMessage(
  userMessage: MemoryMessage,
  memoryState: MemoryMessage[]
) {
  const msg = await ollama.chat({
    model: "llama3.2:1b",
    messages: [...memoryState, userMessage],
  });

  return msg.message.content;
}

// TODO
// Abstract the model in modelMessage
// Move LLMResponse to here
// Redo LLMResponse looks like shit

export async function Response(
  userMessage: MemoryMessage,
  memoryState: MemoryMessage[]
) {
  const llmMessage = await sendModelMessage(userMessage, memoryState);
  const llmMessageData = {
    id: (Date.now() + 1).toString(),
    content: llmMessage,
    isUser: false,
    timestamp: new Date(),
  };

  return { message: llmMessage, data: llmMessageData };
}

export async function modelList() {
  const list = await ollama.list();
  return list;
}
