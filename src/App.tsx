import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/Header";
import { storageService } from "./services/storage";
import { useFileSystem } from "./hooks/useFileSystem";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import type { BreadcrumbItem } from "./types";

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

  const { allItems } = useFileSystem(currentFolderId);

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
