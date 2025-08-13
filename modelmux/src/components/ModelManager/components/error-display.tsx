import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
}

export function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  return (
    <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4">
      <div className="flex items-center">
        <span className="text-destructive font-medium">{error}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="ml-auto h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>
    </div>
  );
}