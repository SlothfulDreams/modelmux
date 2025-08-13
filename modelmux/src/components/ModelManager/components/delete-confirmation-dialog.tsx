import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type OllamaModel } from "@/lib/ollama";

interface DeleteConfirmationDialogProps {
  open: boolean;
  model: OllamaModel | null;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  open,
  model,
  loading,
  onOpenChange,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Uninstall</DialogTitle>
          <DialogDescription>
            Are you sure you want to uninstall "{model?.name}"?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Uninstall
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}