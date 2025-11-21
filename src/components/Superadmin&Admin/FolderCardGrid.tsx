import { Pencil, Trash2 } from "lucide-react";
import type { OnboardingFolder } from "@/lib/api/Onboardin/onboardingService";

interface FolderCardGridProps {
  folders: OnboardingFolder[];
  isLoading?: boolean;
  onFolderClick: (folder: OnboardingFolder) => void;
  onEditFolder: (folder: OnboardingFolder) => void;
  onDeleteFolder: (folder: OnboardingFolder) => void;
}

export function FolderCardGrid({
  folders,
  isLoading = false,
  onFolderClick,
  onEditFolder,
  onDeleteFolder,
}: FolderCardGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading folders...</span>
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>
          No folders created yet. Click "Add Folder" to create your first
          folder.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {folders.map((folder) => (
        <div
          key={folder.id}
          onClick={() => onFolderClick(folder)}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-lg">📁</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onEditFolder(folder);
                }}
                aria-label={`Edit folder ${folder.title}`}
                className="transform hover:scale-105 duration-500 ease-in-out transition-transform"
              >
                <Pencil color="blue" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDeleteFolder(folder);
                }}
                aria-label={`Delete folder ${folder.title}`}
                className="transform hover:scale-105 duration-500 ease-in-out transition-transform"
              >
                <Trash2 color="red" />
              </button>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {folder.title}
          </h3>
          {folder.description && (
            <p className="text-sm text-gray-600 mb-4">{folder.description}</p>
          )}
          <div className="text-xs text-gray-500">
            Created: {new Date(folder.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
