import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/Header";
import { storageService } from "./services/storage";
import { useFileSystem } from "./hooks/useFileSystem";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import type { BreadcrumbItem } from "./types";
import { Sidebar } from "./components/Sidebar";
import { FileList } from "./components/FileList";
import { NewFolderDialog } from "./components/NewFolderDialog";
import { UploadDialog } from "./components/UploadDialog";
import { RenameDialog } from "./components/RenameDialog";
import { PDFViewer } from "./components/PDFViewer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState("");

  const {
    allItems,
    items,
    isLoading,
    renameItem,
    deleteItem,
    createFolder,
    isCreatingFolder,
    uploadFile,
    isUploadingFile,
    isRenaming,
  } = useFileSystem(currentFolderId);

  useEffect(() => {
    storageService.init();
  }, []);

  const breadcrumbs = useMemo(() => {
    const crumbs: BreadcrumbItem[] = [];
    let currentId = currentFolderId;

    while (currentId) {
      const folder = allItems.find((item) => item.id === currentId);
      if (folder) {
        crumbs.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return crumbs;
  }, [currentFolderId, allItems]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const handleRenameClick = (id: string) => {
    const item = allItems.find((i) => i.id === id);
    if (item) {
      setSelectedItemId(id);
      setSelectedItemName(item.name);
      setShowRenameDialog(true);
    }
  };

  const handleRename = (newName: string) => {
    if (selectedItemId) {
      renameItem({ id: selectedItemId, newName });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItem(id);
    }
  };

  const handleFileClick = (fileId: string) => {
    setSelectedItemId(fileId);
    setShowPDFViewer(true);
  };

  const handleUpload = (file: File) => {
    uploadFile({ file, name: file.name });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={setCurrentFolderId}
        onNewFolder={() => setShowNewFolderDialog(true)}
        onUpload={() => setShowUploadDialog(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          items={allItems}
          currentFolderId={currentFolderId}
          onFolderClick={setCurrentFolderId}
        />
        <main className="flex-1 overflow-auto bg-white p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <FileList
              items={filteredItems}
              onFolderClick={setCurrentFolderId}
              onFileClick={handleFileClick}
              onRename={handleRenameClick}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>
      <NewFolderDialog
        open={showNewFolderDialog}
        onOpenChange={setShowNewFolderDialog}
        onCreateFolder={createFolder}
        isCreating={isCreatingFolder}
      />

      <UploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        onUpload={handleUpload}
        isUploading={isUploadingFile}
      />

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        itemName={selectedItemName}
        onRename={handleRename}
        isRenaming={isRenaming}
      />

      <PDFViewer
        open={showPDFViewer}
        onOpenChange={setShowPDFViewer}
        fileId={selectedItemId}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
