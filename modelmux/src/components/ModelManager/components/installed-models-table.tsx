import { Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  formatModelSize,
  formatModelName,
  getModelTag,
  type OllamaModel,
} from "@/lib/ollama";

interface InstalledModelsTableProps {
  models: OllamaModel[];
  loading: Record<string, boolean>;
  onUninstall: (model: OllamaModel) => void;
}

export function InstalledModelsTable({
  models,
  loading,
  onUninstall,
}: InstalledModelsTableProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Installed Models ({models.length})
      </h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Modified</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No models installed
                </TableCell>
              </TableRow>
            ) : (
              models.map((model) => (
                <TableRow key={model.name}>
                  <TableCell className="font-medium">
                    {formatModelName(model.name)}
                    <span className="text-sm text-muted-foreground ml-2">
                      :{getModelTag(model.name)}
                    </span>
                  </TableCell>
                  <TableCell>{formatModelSize(model.size)}</TableCell>
                  <TableCell>
                    {new Date(model.modified_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onUninstall(model)}
                      disabled={loading[model.name]}
                    >
                      {loading[model.name] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Uninstall
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}