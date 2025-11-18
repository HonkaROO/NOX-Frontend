import { useState, useEffect } from "react";
import AdminHeader from "@/components/layout/AdminLayout/AdminHeader";
import { useNavigate } from "react-router-dom";
import {
  FolderModal,
  type FolderModalType,
} from "@/components/modals/ADMINHR/FolderModal";
import { FolderContentModal } from "@/components/modals/ADMINHR/FolderContentModal";
import HRnav from "@/components/layout/AdminLayout/HRnav";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";
import { folderService } from "@/lib/api/Onboardin/onboardingService";
import type { OnboardingFolder } from "@/lib/api/Onboardin/onboardingService";
import { toast } from "sonner";

export default function HROverview() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FolderModalType>("add");
  const [selectedFolder, setSelectedFolder] = useState<OnboardingFolder | null>(null);
  const [folders, setFolders] = useState<OnboardingFolder[]>([]);
  const [folderContentModalOpen, setFolderContentModalOpen] = useState(false);
  const [selectedFolderForContent, setSelectedFolderForContent] = useState<OnboardingFolder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load folders from backend
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    console.log('[HROverview] Starting to load folders...');
    setIsLoading(true);
    try {
      console.log('[HROverview] Calling folderService.getAll()...');
      const data = await folderService.getAll();
      console.log('[HROverview] Folders loaded successfully:', {
        count: data.length,
        folders: data.map(f => ({
          id: f.id,
          title: f.title,
          description: f.description,
          hasTasks: f.tasks ? f.tasks.length > 0 : false
        }))
      });
      setFolders(data);
      console.log('[HROverview] Folders state updated');
    } catch (error) {
      console.error('[HROverview] Failed to load folders:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast.error("Failed to load folders");
    } finally {
      setIsLoading(false);
      console.log('[HROverview] Loading state set to false');
    }
  };

  const handleModalOpen = (type: FolderModalType, folder?: any) => {
    setModalType(type);
    setSelectedFolder(folder || null);
    setModalOpen(true);
  };

  const handleModalSave = (savedFolder: OnboardingFolder) => {
    if (modalType === "add") {
      setFolders([...folders, savedFolder]);
    } else if (modalType === "edit" && selectedFolder) {
      setFolders(
        folders.map((folder) =>
          folder.id === selectedFolder.id ? savedFolder : folder
        )
      );
    }
  };

  const handleFolderClick = (folder: OnboardingFolder) => {
    setSelectedFolderForContent(folder);
    setFolderContentModalOpen(true);
  };

  return (
    <AdminHeader>
      <div className="p-6">
        <HRnav activePage="HROverview" />

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-semibold">Folder Cards</h1>
            <p className="pt-2">Shows uploaded Folder Cards and Tasks</p>
          </div>
          {/* Add Folder Button */}
          <div className="mb-6">
            <button
              onClick={() => handleModalOpen("add")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              + Add Folder
            </button>
          </div>
        </div>
        {/* Contents Here */}

        {/* Folder Cards */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Folder Cards</h2>

          {folders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>
                No folders created yet. Click "Add Folder" to create your first
                folder.
              </p>
            </div>
          ) : (
            /* Grid of Folder Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-lg">
                        📁
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add delete functionality
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {folder.title}
                  </h3>
                  {folder.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {folder.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    Created: {new Date(folder.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Folder Modal */}
        <FolderModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          type={modalType}
          folder={selectedFolder || undefined}
          onSave={handleModalSave}
        />

        {/* Folder Content Modal */}
        <FolderContentModal
          open={folderContentModalOpen}
          onOpenChange={setFolderContentModalOpen}
          folder={selectedFolderForContent}
        />

        {/* AI Assistant Button (Bottom Right) */}
        <ChatbotAssistant />
      </div>
    </AdminHeader>
  );
}
