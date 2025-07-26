import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onKeyDown, onSend }: ChatInputProps) {
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Type your message here..."
        className="flex-1"
      />
      <Button onClick={onSend} disabled={!value.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
} 
