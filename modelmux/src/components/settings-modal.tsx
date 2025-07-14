import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/components/theme-provider";

export function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setTheme, theme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label
              htmlFor="default-model"
              className="block text-sm font-medium mb-1"
            >
              Default Model
            </label>
            <Select>
              <SelectTrigger id="default-model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dummy-1">Dummy Model 1</SelectItem>
                <SelectItem value="dummy-2">Dummy Model 2</SelectItem>
                <SelectItem value="dummy-3">Dummy Model 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label htmlFor="theme" className="block text-sm font-medium mb-1">
              Theme
            </label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
