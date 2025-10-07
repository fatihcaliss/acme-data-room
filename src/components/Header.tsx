import { Upload, FolderPlus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import type { BreadcrumbItem as BreadcrumbItemType } from "../types";

interface HeaderProps {
  breadcrumbs: BreadcrumbItemType[];
  onBreadcrumbClick: (id: string | null) => void;
  onNewFolder: () => void;
  onUpload: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({
  breadcrumbs,
  onBreadcrumbClick,
  onNewFolder,
  onUpload,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="border-b bg-white ">
      <div className="flex md:items-center md:justify-between justify-start px-6 py-3 md:flex-row flex-col gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-semibold text-primary">Acme Data Room</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => onBreadcrumbClick(null)}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center gap-1.5">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => onBreadcrumbClick(crumb.id)}
                      >
                        {crumb.name}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex md:items-center gap-2 flex-col md:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button onClick={onNewFolder} variant="outline" size="sm">
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
          <Button onClick={onUpload} size="sm">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
    </header>
  );
}
