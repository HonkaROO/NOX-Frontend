import { useState, useEffect } from "react";
import SuperAdminHeader from "@/components/layout/SuperAdminLayout/SuperAdminHeader";
import { SuperAdminNavigation } from "@/components/modals/SuperAdminModals/SuperAdminNavigation";
import {
  FolderModal,
  type FolderModalType,
} from "@/components/modals/ADMINHR/FolderModal";
import { FolderContentModal } from "@/components/modals/ADMINHR/FolderContentModal";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";
import { folderService } from "@/lib/api/Onboardin/onboardingService";
import type { OnboardingFolder } from "@/lib/api/Onboardin/onboardingService";
import { toast } from "sonner";
import { FolderCardGrid } from "@/components/Superadmin&Admin/FolderCardGrid";
import { PageHeader } from "@/components/Superadmin&Admin/PageHeader";

export default function SuperAdminOnboardingOverview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<FolderModalType>("add");
  const [selectedFolder, setSelectedFolder] = useState<OnboardingFolder | null>(null);
  const [folders, setFolders] = useState<OnboardingFolder[]>([]);
  const [folderContentModalOpen, setFolderContentModalOpen] = useState(false);
  const [selectedFolderForContent, setSelectedFolderForContent] = useState<OnboardingFolder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    setIsLoading(true);
    try {
      const data = await folderService.getAll();
      setFolders(data);
    } catch (error) {
      console.error("Failed to load folders:", error);
      toast.error("Failed to load folders");
    } finally {
      setIsLoading(false);
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
    <SuperAdminHeader>
      <main className="px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
        <SuperAdminNavigation />

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <PageHeader
            title="Onboarding Management"
            description="Create and manage onboarding folders, tasks, and materials"
            buttonText="+ Add Folder"
            onButtonClick={() => handleModalOpen("add")}
          />

          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Folder Cards</h2>
            <FolderCardGrid
              folders={folders}
              isLoading={isLoading}
              onFolderClick={handleFolderClick}
              onEditFolder={handleEditFolder}
              onDeleteFolder={handleDeleteFolder}
            />
          </div>
        </div>

        <FolderModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          type={modalType}
          folder={selectedFolder || undefined}
          onSave={handleModalSave}
        />

        <FolderContentModal
          open={folderContentModalOpen}
          onOpenChange={setFolderContentModalOpen}
          folder={selectedFolderForContent}
        />

        <ChatbotAssistant />
      </main>
    </SuperAdminHeader>
  );
}
