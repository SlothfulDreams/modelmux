import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChatInterface } from "@/components/ChatInterface/chat-interface";
import { X } from "lucide-react";

interface KnowledgeItem {
  id: string;
  type: "link";
  content: string;
}

export default function Workspace() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [newLink, setNewLink] = useState("");

  const handleAddLink = () => {
    if (newLink.trim() !== "") {
      setKnowledge([
        ...knowledge,
        { id: crypto.randomUUID(), type: "link", content: newLink },
      ]);
      setNewLink("");
    }
  };

  const handleDeleteLink = (id: string) => {
    setKnowledge(knowledge.filter((item) => item.id != id));
  };

  return (
    <div className="flex flex-col h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Workspace</h1>
      <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden">
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
        <div className="col-span-2 border rounded-lg flex flex-col overflow-hidden">
          <ChatInterface isSubSection={true} />
        </div>
      </div>
    </div>
  );
}
