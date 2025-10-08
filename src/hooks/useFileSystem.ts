import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storageService } from "../services/storage";
import type { FileSystemItem } from "../types";
import { toast } from "sonner";

export function useFileSystem(currentFolderId: string | null) {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["fileSystem", currentFolderId],
    queryFn: () => storageService.getItemsByParentId(currentFolderId),
  });

  const { data: allItems = [] } = useQuery({
    queryKey: ["fileSystem", "all"],
    queryFn: () => storageService.getAllItems(),
  });

  const createFolderMutation = useMutation({
    mutationFn: async (name: string) => {
      const timestamp = Date.now();
      const newFolder: FileSystemItem = {
        id: `folder-${timestamp}`,
        name: await getUniqueName(name, currentFolderId),
        type: "folder",
        parentId: currentFolderId,
        createdAt: timestamp,
        modifiedAt: timestamp,
      };
      await storageService.addItem(newFolder);
      return newFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileSystem"] });
      toast.success("Folder created successfully");
    },
    onError: () => {
      toast.error("Failed to create folder");
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, name }: { file: File; name: string }) => {
      const timestamp = Date.now();
      const newFile: FileSystemItem = {
        id: `file-${timestamp}`,
        name: await getUniqueName(name, currentFolderId),
        type: "file",
        parentId: currentFolderId,
        createdAt: timestamp,
        modifiedAt: timestamp,
        content: file,
        size: file.size,
        mimeType: file.type,
      };
      await storageService.addItem(newFile);
      return newFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileSystem"] });
      toast.success("File uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload file");
    },
  });

  const renameMutation = useMutation({
    mutationFn: async ({ id, newName }: { id: string; newName: string }) => {
      const item = await storageService.getItemById(id);
      if (!item) throw new Error("Item not found");

      const uniqueName = await getUniqueName(newName, item.parentId, id);
      const updatedItem = {
        ...item,
        name: uniqueName,
        modifiedAt: Date.now(),
      };
      await storageService.updateItem(updatedItem);
      return updatedItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileSystem"] });
      toast.success("Item renamed successfully");
    },
    onError: () => {
      toast.error("Failed to rename item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const item = await storageService.getItemById(id);
      if (!item) throw new Error("Item not found");

      if (item.type === "folder") {
        await storageService.deleteItemsRecursively(id);
      } else {
        await storageService.deleteItem(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fileSystem"] });
      toast.success("Item deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete item");
    },
  });

  const getUniqueName = async (
    baseName: string,
    parentId: string | null,
    excludeId?: string
  ): Promise<string> => {
    const siblings = await storageService.getItemsByParentId(parentId);
    const existingNames = siblings
      .filter((item) => item.id !== excludeId)
      .map((item) => item.name);

    if (!existingNames.includes(baseName)) {
      return baseName;
    }

    // Extract name and extension
    const lastDotIndex = baseName.lastIndexOf(".");
    const nameWithoutExt =
      lastDotIndex > 0 ? baseName.substring(0, lastDotIndex) : baseName;
    const extension = lastDotIndex > 0 ? baseName.substring(lastDotIndex) : "";

    let counter = 1;
    let newName = `${nameWithoutExt} (${counter})${extension}`;

    while (existingNames.includes(newName)) {
      counter++;
      newName = `${nameWithoutExt} (${counter})${extension}`;
    }

    return newName;
  };

  return {
    items,
    allItems,
    isLoading,
    createFolder: createFolderMutation.mutate,
    uploadFile: uploadFileMutation.mutate,
    renameItem: renameMutation.mutate,
    deleteItem: deleteMutation.mutate,
    isCreatingFolder: createFolderMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isRenaming: renameMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
