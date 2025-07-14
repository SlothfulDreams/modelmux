import { RotateCcw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatMessageActions() {
  return (
    <div className="mt-1 flex justify-end w-full">
      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <button
                className="p-1 rounded hover:bg-accent focus:outline-none flex items-center"
                title="More"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="ml-1 text-xs">Retry</span>
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
          <DropdownMenuItem>Copy message</DropdownMenuItem>
          <DropdownMenuItem>Report issue</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 