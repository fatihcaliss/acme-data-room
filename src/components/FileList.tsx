import type { FileSystemItem } from "../types";
import { Folder, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";

interface FileListProps {
  items: FileSystemItem[];
  onFolderClick: (folderId: string) => void;
  onFileClick: (fileId: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FileList({
  items,
  onFolderClick,
  onFileClick,
  onRename,
  onDelete,
}: FileListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Folder className="h-16 w-16 mb-4 opacity-20" />
        <p>No files or folders here</p>
        <p className="text-sm">
          Upload files or create a new folder to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-28">
      <table className="w-full">
        <thead className="border-b text-sm text-muted-foreground">
          <tr>
            <th className="text-left py-3 px-4 font-medium">Name</th>
            <th className="text-left py-3 px-4 font-medium">Modified</th>
            <th className="text-left py-3 px-4 font-medium">Size</th>
            <th className="w-12"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b hover:bg-accent cursor-pointer transition-colors"
              onClick={() =>
                item.type === "folder"
                  ? onFolderClick(item.id)
                  : onFileClick(item.id)
              }
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {item.type === "folder" ? (
                    <Folder className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">{item.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {formatDistanceToNow(item.modifiedAt, { addSuffix: true })}
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">
                {item.type === "file" ? formatFileSize(item.size) : "-"}
              </td>
              <td className="py-3 px-4">
                <DropdownMenu
                  open={openMenuId === item.id}
                  onOpenChange={(open) => setOpenMenuId(open ? item.id : null)}
                >
                  <DropdownMenuTrigger className="p-1 hover:bg-muted rounded cursor-pointer">
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onRename(item.id);
                        setOpenMenuId(null);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                        setOpenMenuId(null);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
