import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatInterface } from "@/components/ChatInterface/chat-interface";
import { X } from "lucide-react";
import { chromaDB } from "@/lib/chromadb";
import { generateEmbeddings } from "@/lib/ollama";

interface KnowledgeItem {
  id: string;
  type: "link";
  content: string;
}

export default function WorkspaceInterface() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [newLink, setNewLink] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  useEffect(() => {
    const searchKnowledgeItems = async () => {
      if (knowledge.length === 0) {
        setSearchResults([]);
        return;
      }

      const results: string[] = [];
      for (const item of knowledge) {
        try {
          const result = await window.api.searchDuckDuckGo(item.content);
          results.push(result);
        } catch (error) {
          console.error(`Failed to search ${item.content}:`, error);
          results.push(`Error searching ${item.content}`);
        }
      }
      setSearchResults(results);

      try {
        const validResults = results.filter(
          (result) => result && !result.startsWith("Error searching"),
        );

        if (validResults.length > 0) {
          const embeddings = await generateEmbeddings(validResults);
          const knowledgeItemIds = knowledge
            .map((item) => item.id)
            .slice(0, validResults.length);

          await chromaDB.embedSearchResults(
            validResults,
            knowledgeItemIds,
            embeddings,
          );
        }
      } catch (error) {
        console.error("Failed to embed search results in ChromaDB:", error);
      }
    };

    searchKnowledgeItems();
  }, [knowledge]);

  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      setKnowledge([
        ...knowledge,
        { id: crypto.randomUUID(), type: "link", content: newLink },
      ]);
      setNewLink("");
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await chromaDB.deleteByKnowledgeItemId(id);
    } catch (error) {
      console.error("Failed to delete embeddings from ChromaDB:", error);
    }
    setKnowledge(knowledge.filter((item) => item.id != id));
  };

  return (
    <div className="flex flex-col h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Workspace</h1>
      <div className="grid grid-cols-3 gap-4 flex-1">
        {/* Left Panel: Knowledge Base */}
        <div className="col-span-1 flex flex-col space-y-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Knowledge Base</h2>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="url"
              placeholder="Enter a website link"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
              className="flex-1"
            />
            <Button onClick={handleAddLink}>Add</Button>
          </div>
          <Separator />
          <ScrollArea className="flex-grow">
            <div className="space-y-2">
              {knowledge.length > 0 ? (
                knowledge.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center justify-between p-2 border rounded-md bg-muted"
                  >
                    <a
                      href={item.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate flex-1"
                    >
                      {item.content}
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={() => handleDeleteLink(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No knowledge added yet. Add a link to get started.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
        {/* Right Panel: Chat */}
        <div className="col-span-2 border rounded-lg flex flex-col h-full min-h-0">
          <ChatInterface useEmbeddings={true} isEmbedded={true} />
        </div>
      </div>
    </div>
  );
}
