import SuperAdminHeader from "@/components/layout/SuperAdminLayout/SuperAdminHeader";
import { SuperAdminNavigation } from "@/components/modals/SuperAdminModals/SuperAdminNavigation";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import UploadDocumentDialog from "@/components/modals/ADMINHR/HRUploadModal";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";
import {
  materialService,
  type OnboardingMaterial,
} from "@/lib/api/Onboardin/onboardingService";
import { toast } from "sonner";
import { DocumentStatsCards } from "@/components/Superadmin&Admin/DocumentStatsCards";
import { DocumentFilterTabs } from "@/components/Superadmin&Admin/DocumentFilterTabs";
import { DocumentGrid } from "@/components/Superadmin&Admin/DocumentGrid";
import KnowledgeInjectionModal from "@/components/modals/ADMINHR/KnowledgeInjectionModal";

const TABS = [
  "All Documents",
  "Government",
  "Department",
  "IT Setup",
  "HR Policies",
  "Training Programs",
  "Documentation",
];

export default function SuperAdminDocumentManagement() {
  const [activeTab, setActiveTab] = useState("All Documents");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [knowledgeInjectionOpen, setKnowledgeInjectionOpen] = useState(false);
  const [materials, setMaterials] = useState<OnboardingMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setIsLoading(true);
    try {
      const data = await materialService.getAll();
      setMaterials(data);
    } catch (error) {
      toast.error("Failed to load materials");
      console.error("Error loading materials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments =
    activeTab === "All Documents"
      ? materials
      : materials.filter((mat) => mat.fileType.includes(activeTab));

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      await materialService.delete(materialId);
      toast.success("Material deleted successfully");
      loadMaterials();
    } catch (error) {
      toast.error("Failed to delete material");
    }
  };

  return (
    <SuperAdminHeader>
      <main className="px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
        <SuperAdminNavigation />

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl md:text-4xl font-semibold">
                Document Management
              </h1>
              <p className="pt-2 text-sm md:text-base">
                Upload and manage onboarding documents
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                onClick={() => setUploadDialogOpen(true)}
                className="relative cursor-pointer overflow-hidden rounded-md border border-indigo-700 bg-indigo-600 px-3 py-1.5 text-white shadow-md inset-shadow-2xs inset-shadow-indigo-400 transition-all before:absolute before:inset-0 before:bg-linear-to-b before:from-white/20 before:to-transparent hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none active:inset-shadow-indigo-800 w-full sm:w-auto justify-center"
              >
                <Plus size={20} className="md:w-9 md:h-9" strokeWidth={3} />
                <span className="text-sm md:text-base">Upload Document</span>
              </Button>
              <Button
                onClick={() => setKnowledgeInjectionOpen(true)}
                className="relative cursor-pointer overflow-hidden rounded-md border border-purple-700 bg-purple-600 px-3 py-1.5 text-white shadow-md inset-shadow-2xs inset-shadow-purple-400 transition-all before:absolute before:inset-0 before:bg-linear-to-b before:from-white/20 before:to-transparent hover:bg-purple-500 active:bg-purple-700 active:shadow-none active:inset-shadow-purple-800 w-full sm:w-auto justify-center"
              >
                <Sparkles size={20} strokeWidth={3} />
                <span className="text-sm md:text-base">
                  Knowledge Injection
                </span>
              </Button>
            </div>
          </div>

          <DocumentStatsCards materials={materials} isLoading={isLoading} />
          <DocumentFilterTabs
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <DocumentGrid
            materials={filteredDocuments}
            isLoading={isLoading}
            onDelete={handleDeleteMaterial}
          />
        </div>
      </main>

      <ChatbotAssistant />
      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open);
          if (!open) {
            loadMaterials();
          }
        }}
      />
      <KnowledgeInjectionModal
        open={knowledgeInjectionOpen}
        onOpenChange={(open) => {
          setKnowledgeInjectionOpen(open);
          if (!open) {
            loadMaterials();
          }
        }}
      />
    </SuperAdminHeader>
  );
}
