import { Folder, ChevronRight, ChevronDown } from "lucide-react";
import type { FileSystemItem } from "../types";
import { useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { storageService } from "@/services/storage";
import { useQueryClient } from "@tanstack/react-query";

interface SidebarProps {
  items: FileSystemItem[];
  currentFolderId: string | null;
  onFolderClick: (folderId: string | null) => void;
}

export function Sidebar({
  items,
  currentFolderId,
  onFolderClick,
}: SidebarProps) {
  const queryClient = useQueryClient();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const buildFolderTree = (
    parentId: string | null,
    level: number = 0
  ): React.JSX.Element[] => {
    const folders = items.filter(
      (item) => item.type === "folder" && item.parentId === parentId
    );

    return folders.map((folder) => {
      const hasChildren = items.some(
        (item) => item.type === "folder" && item.parentId === folder.id
      );
      const isExpanded = expandedFolders.has(folder.id);
      const isActive = currentFolderId === folder.id;

      return (
        <div key={folder.id}>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent",
              isActive && "bg-accent text-accent-foreground font-medium"
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => onFolderClick(folder.id)}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
                className="p-0.5 hover:bg-muted rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            <Folder className="h-4 w-4 text-blue-500" />
            <span className="text-sm truncate">{folder.name}</span>
          </div>
          {isExpanded && hasChildren && buildFolderTree(folder.id, level + 1)}
        </div>
      );
    });
  };

  return (
    <aside className="border-r bg-white p-4 overflow-y-auto flex flex-col md:w-64 w-32">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">
          Folders
        </h2>
      </div>
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent mb-1",
          currentFolderId === null &&
            "bg-accent text-accent-foreground font-medium"
        )}
        onClick={() => onFolderClick(null)}
      >
        <Folder className="h-4 w-4 text-blue-500" />
        <span className="text-sm">Home</span>
      </div>
      {buildFolderTree(null)}

      <div className="mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            if (confirm("Are you sure you want to clear all data?")) {
              storageService.clearAll();
              queryClient.invalidateQueries({ queryKey: ["fileSystem"] });
              onFolderClick(null);
            }
          }}
        >
          Clear All Data
        </Button>
      </div>
    </aside>
  );
}
