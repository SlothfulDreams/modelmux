import ollama from "ollama";

interface MemoryMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

async function sendModelMessage(
  userMessage: MemoryMessage,
  memoryState: MemoryMessage[],
  model: string
) {
  const msg = await ollama.chat({
    model: model,
    messages: [...memoryState, userMessage],
  });

  return msg.message.content;
}

export async function Response(
  userMessage: MemoryMessage,
  memoryState: MemoryMessage[],
  model = "llama3.2:1b"
) {
  const llmMessage = await sendModelMessage(userMessage, memoryState, model);
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
  return list.models;
}

export async function getCurrentModel() {
  const res = await ollama.ps();
  return res.models[0]?.name;
}
