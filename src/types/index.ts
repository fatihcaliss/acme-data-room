export type FileSystemItemType = "folder" | "file";

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileSystemItemType;
  parentId: string | null;
  createdAt: number;
  modifiedAt: number;
  // For files only
  content?: Blob;
  size?: number;
  mimeType?: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}
