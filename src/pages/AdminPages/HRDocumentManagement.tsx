import AdminHeader from "@/components/layout/AdminLayout/AdminHeader";
import HRnav from "@/components/layout/AdminLayout/HRnav";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UploadDocumentDialog from "@/components/modals/ADMINHR/HRUploadModal";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";
import { materialService, type OnboardingMaterial } from "@/lib/api/Onboardin/onboardingService";
import { toast } from "sonner";

// Helper function to check if file is AI-indexable
const isAiIndexable = (fileName: string): boolean => {
  const aiIndexableTypes = [".pdf", ".json", ".md"];
  const fileExt = "." + fileName.split(".").pop()?.toLowerCase();
  return aiIndexableTypes.includes(fileExt);
};

// Helper function to format file size
const formatFileSize = (url: string): string => {
  // Since we don't have size from backend, return placeholder
  // In real implementation, you might want to fetch this separately
  return "N/A";
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
};

const TABS = [
  "All Documents",
  "Government",
  "Department",
  "IT Setup",
  "HR Policies",
  "Training Programs",
  "Documentation",
];

export default function HRDocumentManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Documents");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<OnboardingMaterial | null>(null);
  const [materials, setMaterials] = useState<OnboardingMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load materials from API
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

  // Filter documents based on active tab
  const filteredDocuments =
    activeTab === "All Documents"
      ? materials
      : materials.filter((mat) => mat.fileType.includes(activeTab));

  const handleViewDocument = (material: OnboardingMaterial) => {
    setSelectedDocument(material);
    setViewModalOpen(true);
  };

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      await materialService.delete(materialId);
      toast.success("Material deleted successfully");
      loadMaterials(); // Reload the list
    } catch (error) {
      toast.error("Failed to delete material");
    }
  };

  const handleUploadSuccess = () => {
    loadMaterials(); // Reload materials after successful upload
  };

  return (
    <AdminHeader>
      <div className="p-6">
        <HRnav activePage="HRDocumentManagement" />

        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Document Management</h1>
            <p className="pt-2">Upload and manage onboarding documents</p>
          </div>
          <div className="flex items-center">
            <Button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ">
              <Plus size={36} strokeWidth={3} />
              Upload Document
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 pt-12 px-6">
          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <FileText size={40} className="text-blue-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Total Documents</span>
              <span className="text-2xl font-semibold text-gray-900">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : materials.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <Sparkles size={40} className="text-purple-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">AI-Searchable</span>
              <span className="text-2xl font-semibold text-gray-900">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : materials.filter(m => isAiIndexable(m.fileName)).length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <FileText size={40} className="text-amber-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">Storage Only</span>
              <span className="text-2xl font-semibold text-gray-900">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : materials.filter(m => !isAiIndexable(m.fileName)).length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <FileText size={40} className="text-green-600" />

            <div className="flex flex-col leading-tight">
              <span className="text-gray-600 text-lg">PDF Files</span>
              <span className="text-2xl font-semibold text-gray-900">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : materials.filter(m => m.fileName.endsWith('.pdf')).length}
              </span>
            </div>
          </div>
        </div>

        {/* Document Filter Tabs */}
        <div className="flex gap-6 mt-12 mb-6 border-b border-gray-200 px-6 ">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 font-medium ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-5 gap-4 px-6">
          {isLoading ? (
            <div className="col-span-5 flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="col-span-5 text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No documents found</p>
              <p className="text-sm">Upload a document to get started</p>
            </div>
          ) : (
            filteredDocuments.map((material) => (
              <div
                key={material.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded ${isAiIndexable(material.fileName) ? 'bg-purple-100' : 'bg-gray-100'}`}>
                    <FileText className={isAiIndexable(material.fileName) ? 'text-purple-600' : 'text-gray-600'} size={24} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                      {material.fileType}
                    </span>
                    {isAiIndexable(material.fileName) ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 flex items-center gap-1">
                        <Sparkles size={10} />
                        AI-Searchable
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
                        Storage Only
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold text-sm mb-1 truncate" title={material.fileName}>
                  {material.fileName}
                </h3>
                <p className="text-xs text-gray-600 mb-1">
                  Uploaded: {formatDate(material.createdAt)}
                </p>
                {material.updatedAt && (
                  <p className="text-xs text-gray-600 mb-1">
                    Updated: {formatDate(material.updatedAt)}
                  </p>
                )}

                <div className="flex gap-2 mt-auto pt-3">
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-700 text-center"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="px-3 bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ChatbotAssistant />
      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={(open) => {
          setUploadDialogOpen(open);
          if (!open) {
            // Reload materials when dialog closes (in case upload was successful)
            loadMaterials();
          }
        }}
      />
    </AdminHeader>
  );
}
