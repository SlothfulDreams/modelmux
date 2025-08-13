import { RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState, useContext } from "react";
import { getCurrentModel, modelList, type OllamaModel } from "@/lib/ollama";
import { RetryContext } from "./Context/ChatContext";

export function ChatMessageActions() {
  const [modelName, setModelName] = useState<string | undefined>("");
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const retryHandle = useContext(RetryContext);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [model, modelData] = await Promise.all([
          getCurrentModel(),
          modelList(),
        ]);
        setModelName(model);
        setModels(modelData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDropdownOpenChange = (open: boolean) => {
    setDropdownOpen(open);
    if (open) {
      setTooltipOpen(false);
    }
  };

  return (
    <div className="mt-1 flex justify-end w-full">
      <DropdownMenu onOpenChange={handleDropdownOpenChange} open={dropdownOpen}>
        <Tooltip onOpenChange={setTooltipOpen} open={tooltipOpen}>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <button
                className="p-1 rounded hover:bg-accent focus:outline-none flex items-center"
                title="More"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="ml-1 text-xs">
                  Retry (
                  {loading
                    ? "loading..."
                    : error
                    ? "error"
                    : modelName || "unknown"}
                  )
                </span>
              </button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent side="bottom" align="center">
            Retry message
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="flex items-center gap-2">
            <RotateCcw className="h-3 w-3" />
            Retry
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {models.map((model) => (
            <DropdownMenuItem
              key={model.name}
              onClick={() => {
                retryHandle(model.name);
              }}
            >
              {model.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>Copy message</DropdownMenuItem>
          <DropdownMenuItem>Report issue</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
