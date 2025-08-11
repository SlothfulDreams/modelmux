import ollama from "ollama";

interface MemoryMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

async function sendModelMessage(
  userMessage: MemoryMessage,
  memoryState: MemoryMessage[],
  model: string,
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
  model = "llama3.2:1b",
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

export async function generateEmbeddings(
  texts: string[],
  model = "nomic-embed-text",
) {
  try {
    const embeddings: number[][] = [];

    for (const text of texts) {
      if (!text || text.trim().length === 0) {
        continue;
      }

      const response = await ollama.embeddings({
        model,
        prompt: text,
      });

      embeddings.push(response.embedding);
    }

    console.log("Embedding generated");

    return embeddings;
  } catch (error) {
    console.error("Failed to generate embeddings with Ollama:", error);
    throw error;
  }
}

export async function generateSingleEmbedding(
  text: string,
  model = "nomic-embed-text",
) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    const response = await ollama.embeddings({
      model,
      prompt: text,
    });

    return response.embedding;
  } catch (error) {
    console.error("Failed to generate single embedding with Ollama:", error);
    throw error;
  }
}
