# Acme Virtual Data Room MVP

A modern, secure file management system built with React, TypeScript,Tailwind CSS and Shadcn. This Acme Virtual Data Room (VDR) allows users to organize, upload, and manage PDF files with an intuitive interface similar to Google Drive or Dropbox.

![Virtual Data Room](https://img.shields.io/badge/Status-MVP-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-19.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-blue)

## 🚀 Features

### Core Functionality

- **📁 Folder Management**: Create, rename, delete, and navigate nested folders
- **📄 File Upload**: Upload PDF files with drag-and-drop support
- **📝 File Operations**: Rename and delete files with confirmation
- **🔍 Search**: Real-time search across files and folders
- **📊 File Preview**: Built-in PDF viewer for quick document review
- **🗂️ Breadcrumb Navigation**: Easy navigation through nested folder structures
- **🎨 Modern UI**: Clean, professional interface using Shadcn UI components

### Technical Features

- **💾 Local Storage**: Uses IndexedDB for persistent data storage
- **⚡ Optimistic Updates**: Instant UI updates with React Query
- **🎯 Type Safety**: Full TypeScript implementation
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🔄 Duplicate Handling**: Automatic naming for duplicate files/folders

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (custom implementation)
- **State Management**: TanStack React Query
- **Storage**: IndexedDB
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Formatting**: date-fns

## 📦 Installation

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/fatihcaliss/acme-data-room
   cd acme-data-room
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
acme-mvp/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── sonner.tsx
│   │   │   └── dropdown-menu.tsx
│   │   ├── Header.tsx      # Top navigation bar
│   │   ├── Sidebar.tsx     # Folder tree navigation
│   │   ├── FileList.tsx    # File/folder list view
│   │   ├── NewFolderDialog.tsx
│   │   ├── RenameDialog.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── UploadDialog.tsx
│   │   └── PDFViewer.tsx   # PDF preview modal
│   ├── hooks/              # Custom React hooks
│   │   └── useFileSystem.ts # File operations logic
│   ├── services/           # Business logic
│   │   └── storage.ts      # IndexedDB operations
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── lib/                # Utility functions
│   │   └── utils.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── index.html
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 💡 Design Decisions

### Architecture

- **Component-Based**: Modular React components for maintainability
- **Hooks Pattern**: Custom hooks (`useFileSystem`) for business logic separation
- **Service Layer**: Dedicated storage service for IndexedDB operations

### Data Structure

```typescript
interface FileSystemItem {
  id: string; // Unique identifier
  name: string; // File/folder name
  type: "folder" | "file"; // Item type
  parentId: string | null; // Parent folder (null = root)
  createdAt: number; // Creation timestamp
  modifiedAt: number; // Last modified timestamp
  // File-specific fields
  content?: Blob; // PDF content
  size?: number; // File size in bytes
  mimeType?: string; // MIME type
}
```

### Storage Strategy

- **IndexedDB**: Chosen for its ability to store large binary files (PDFs)
- **Indexed Fields**: Optimized queries using `parentId` and `type` indices
- **Recursive Deletion**: Properly handles nested folder deletion

### UI/UX Decisions

- **Breadcrumb Navigation**: Shows current path and enables quick navigation
- **Contextual Actions**: Dropdown menus for rename/delete operations
- **Search-as-you-type**: Instant filtering for better user experience
- **Modal Dialogs**: Non-intrusive interfaces for operations
- **Empty States**: Clear messaging when folders are empty

## 🎯 Usage Guide

### Creating a Folder

1. Click the **"New Folder"** button in the header
2. Enter a folder name
3. Click **"Create"**

### Uploading Files

1. Click the **"Upload"** button
2. Select a PDF file (or drag and drop)
3. The file will be added to the current folder

### Navigating Folders

- **Sidebar**: Click any folder in the tree view
- **Main View**: Double-click a folder
- **Breadcrumbs**: Click any breadcrumb to jump to that level

### Renaming Items

1. Click the **⋮** menu next to any item
2. Select **"Rename"**
3. Enter the new name

### Deleting Items

1. Click the **⋮** menu next to any item
2. Select **"Delete"**
3. Confirm the deletion (folders are deleted recursively)

### Viewing PDFs

- Click any PDF file to open it in the built-in viewer

### Searching

- Type in the search box to filter files and folders in the current view

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Variables

No environment variables required for the MVP version.

## 🐛 Known Limitations

- Only PDF files are supported for upload
- All data is stored locally in the browser (IndexedDB)
- No multi-user support in MVP
- Large file uploads may be slow (browser limitation)

## 👨‍💻 Author

Built with ❤️ for the Virtual Data Room MVP

---

**Note**: This is an MVP (Minimum Viable Product) designed to demonstrate core functionality. For production use, consider adding authentication, cloud storage, and additional security features.
