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
import { FolderCardGrid } from "@/components/Superadmin&Admin/FolderCardGrid";

export default function HROverview() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FolderModalType>("add");
  const [selectedFolder, setSelectedFolder] = useState<OnboardingFolder | null>(
    null
  );
  const [folders, setFolders] = useState<OnboardingFolder[]>([]);
  const [folderContentModalOpen, setFolderContentModalOpen] = useState(false);
  const [selectedFolderForContent, setSelectedFolderForContent] =
    useState<OnboardingFolder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load folders from backend
  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    console.log("[HROverview] Starting to load folders...");
    setIsLoading(true);
    try {
      console.log("[HROverview] Calling folderService.getAll()...");
      const data = await folderService.getAll();
      console.log("[HROverview] Folders loaded successfully:", {
        count: data.length,
        folders: data.map((f) => ({
          id: f.id,
          title: f.title,
          description: f.description,
          hasTasks: f.tasks ? f.tasks.length > 0 : false,
        })),
      });
      setFolders(data);
      console.log("[HROverview] Folders state updated");
    } catch (error) {
      console.error("[HROverview] Failed to load folders:", {
        error: error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast.error("Failed to load folders");
    } finally {
      setIsLoading(false);
      console.log("[HROverview] Loading state set to false");
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

  const handleEditFolder = (folder: OnboardingFolder) => {
    handleModalOpen("edit", folder);
  };

  const handleDeleteFolder = async (folder: OnboardingFolder) => {
    if (
      !confirm(
        `Delete folder "${folder.title}"? This will remove all tasks and materials.`
      )
    )
      return;
    try {
      await folderService.delete(folder.id);
      setFolders((prev) => prev.filter((f) => f.id !== folder.id));
      toast.success("Folder deleted");
    } catch (error) {
      console.error("Failed to delete folder:", error);
      toast.error("Failed to delete folder");
    }
  };

  return (
    <AdminHeader>
      <div className="p-6">
        <HRnav activePage="HROverview" />

        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-semibold">Folder Cards</h1>
            <p className="pt-2 text-sm md:text-base">
              Shows uploaded Folder Cards and Tasks
            </p>
          </div>
          {/* Add Folder Button */}
          <div className="mb-4 md:mb-6">
            <button
              onClick={() => handleModalOpen("add")}
              className="px-3 md:px-4 py-1.5 md:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm md:text-base w-full sm:w-auto"
            >
              + Add Folder
            </button>
          </div>
        </div>
        {/* Contents Here */}

        {/* Folder Cards */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
            Folder Cards
          </h2>
          <FolderCardGrid
            folders={folders}
            isLoading={isLoading}
            onFolderClick={handleFolderClick}
            onEditFolder={handleEditFolder}
            onDeleteFolder={handleDeleteFolder}
          />
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
