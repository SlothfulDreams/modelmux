import { Download, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type AvailableModel } from "@/lib/ollama";

interface AvailableModelsTableProps {
  models: AvailableModel[];
  loading: Record<string, boolean>;
  progress: Record<string, { percentage: number; status: string }>;
  onInstall: (modelName: string) => void;
}

export function AvailableModelsTable({
  models,
  loading,
  progress,
  onInstall,
}: AvailableModelsTableProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Available Models ({models.length})
      </h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Updated</TableHead>
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
                  No available models to install
                </TableCell>
              </TableRow>
            ) : (
              models
                .slice(0, 20)
                .map((model) => (
                  <TableRow key={model.model_identifier}>
                    <TableCell className="font-medium">
                      {model.model_name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {model.description}
                    </TableCell>
                    <TableCell>
                      {new Date(model.last_updated).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onInstall(model.model_name)}
                          disabled={loading[model.model_name]}
                        >
                          {loading[model.model_name] ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Install
                        </Button>
                        {loading[model.model_name] &&
                          progress[model.model_name] && (
                            <div className="w-full space-y-1">
                              <Progress
                                value={progress[model.model_name].percentage}
                                className="h-1"
                              />
                              <div className="text-xs text-muted-foreground text-center">
                                {progress[model.model_name].percentage}% -{" "}
                                {progress[model.model_name].status}
                              </div>
                            </div>
                          )}
                      </div>
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