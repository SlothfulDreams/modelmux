import ollama from "ollama";

export interface OllamaModel {
  name: string;
  modified_at: string;
  model: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[] | null;
    parameter_size: string;
    quantization_level: string;
  };
  expires_at: string;
  size_vram: number;
}

export interface AvailableModel {
  model_identifier: string;
  namespace: string;
  model_name: string;
  model_type: string;
  description: string;
  capability: string;
  labels: string[];
  pulls: number;
  tags: string[];
  last_updated: string;
  last_updated_str: string;
  url: string;
}

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

export async function modelList(): Promise<OllamaModel[]> {
  const list = await ollama.list();
  return list.models as unknown as OllamaModel[];
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

export async function pullModel(
  modelName: string,
  onProgress?: (progress: { percentage: number; status: string }) => void,
) {
  try {
    console.log("Pulling model:", modelName);
    const stream = await ollama.pull({
      model: modelName,
      stream: true,
    });

    for await (const chunk of stream) {
      console.log("Pull progress:", chunk);

      if (onProgress) {
        let percentage = 0;
        let status = chunk.status || "downloading";

        if (chunk.completed && chunk.total) {
          percentage = Math.round((chunk.completed / chunk.total) * 100);
        } else if (chunk.status === "success") {
          percentage = 100;
          status = "completed";
        }

        onProgress({ percentage, status });
      }

      if (chunk.status === "success") {
        console.log("Model pulled successfully:", modelName);
        break;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to pull model:", error);
    throw error;
  }
}

export async function deleteModel(modelName: string) {
  try {
    await ollama.delete({ model: modelName });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete model:", error);
    throw error;
  }
}

export async function getAvailableModels(): Promise<AvailableModel[]> {
  try {
    const response = await fetch("https://ollamadb.dev/api/v1/models");
    if (!response.ok) {
      throw new Error("Failed to fetch available models");
    }
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error("Failed to fetch available models:", error);
    return [];
  }
}

export function formatModelSize(sizeInBytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function formatModelName(name: string): string {
  return name.split(":")[0];
}

export function getModelTag(name: string): string {
  const parts = name.split(":");
  return parts.length > 1 ? parts[1] : "latest";
}
