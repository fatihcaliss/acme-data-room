import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import type { FileSystemItem } from "../types";
import { storageService } from "../services/storage";

interface PDFViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string | null;
}

export function PDFViewer({ open, onOpenChange, fileId }: PDFViewerProps) {
  const [file, setFile] = useState<FileSystemItem | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (fileId && open) {
      storageService.getItemById(fileId).then((item) => {
        if (item && item.content) {
          setFile(item);
          const url = URL.createObjectURL(item.content);
          setPdfUrl(url);
        }
      });
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [fileId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl h-[80vh] flex flex-col"
        onClose={() => {
          onOpenChange(false);
          setPdfUrl(null);
          setFile(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>{file?.name || "PDF Viewer"}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title={file?.name}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
