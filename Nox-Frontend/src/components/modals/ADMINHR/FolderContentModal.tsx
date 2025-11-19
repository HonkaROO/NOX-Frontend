import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import {
  taskService,
  materialService,
  stepService,
  type OnboardingFolder,
  type OnboardingMaterial,
} from "@/lib/api/Onboardin/onboardingService";
import { toast } from "sonner";
import { TaskEditModal } from "./TaskEditModal";

interface FolderItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  documents: { id: number; name: string; downloadUrl?: string }[];
  tasks: string[];
}

interface FolderContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder?: OnboardingFolder | null;
}

export function FolderContentModal({
  open,
  onOpenChange,
  folder,
}: FolderContentModalProps) {
  const [selectedItem, setSelectedItem] = useState<FolderItem | null>(null);
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [deletingMaterialId, setDeletingMaterialId] = useState<number | null>(null);
  const [replacingMaterialId, setReplacingMaterialId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load folder content when folder changes
  useEffect(() => {
    if (folder && open) {
      loadFolderContent();
    } else {
      setFolderItems([]);
      setSelectedItem(null);
    }
  }, [folder, open]);

  const loadFolderContent = async () => {
    if (!folder) {
      console.log("[FolderContentModal] No folder provided, skipping load");
      return;
    }

    console.log("[FolderContentModal] Starting to load content for folder:", {
      id: folder.id,
      title: folder.title,
      description: folder.description,
    });

    setIsLoading(true);
    try {
      // Step 1: Get tasks for the folder
      console.log(
        "[FolderContentModal] Step 1: Fetching tasks for folder ID:",
        folder.id
      );
      const tasks = await taskService.getByFolderId(folder.id);
      console.log("[FolderContentModal] Tasks fetched successfully:", {
        count: tasks.length,
        tasks: tasks.map((t) => ({
          id: t.id,
          title: t.title,
          folderId: t.folderId,
        })),
      });

      if (tasks.length === 0) {
        console.log(
          "[FolderContentModal] No tasks found for folder, setting empty array"
        );
        setFolderItems([]);
        return;
      }

      // Transform tasks to FolderItem format
      console.log(
        "[FolderContentModal] Step 2: Processing tasks and fetching materials/steps..."
      );
      const transformedItems: FolderItem[] = await Promise.all(
        tasks.map(async (task, taskIndex) => {
          console.log(
            `[FolderContentModal] Processing task ${taskIndex + 1}/${
              tasks.length
            }:`,
            {
              id: task.id,
              title: task.title,
              folderId: task.folderId,
            }
          );

          try {
            // Get materials for this task
            console.log(
              `[FolderContentModal] Fetching materials for task ${task.id}`
            );
            const materials = await materialService.getByTaskId(task.id);
            console.log(
              `[FolderContentModal] Materials fetched for task ${task.id}:`,
              {
                count: materials.length,
                materials: materials.map((m) => ({
                  id: m.id,
                  fileName: m.fileName,
                })),
              }
            );

            // Get steps for this task
            console.log(
              `[FolderContentModal] Fetching steps for task ${task.id}`
            );
            const steps = await stepService.getByTaskId(task.id);
            console.log(
              `[FolderContentModal] Steps fetched for task ${task.id}:`,
              {
                count: steps.length,
                steps: steps.map((s) => ({
                  id: s.id,
                  stepDescription: s.stepDescription,
                })),
              }
            );

            return {
              id: task.id.toString(),
              name: task.title,
              description: task.description,
              createdAt: task.createdAt,
              documents: materials.map((material) => ({
                id: material.id,
                name: material.fileName,
                downloadUrl: material.url,
              })),
              tasks: steps.map((step) => step.stepDescription),
            };
          } catch (taskError) {
            console.error(
              `[FolderContentModal] Error processing task ${task.id}:`,
              taskError
            );
            throw taskError; // Re-throw to be caught by outer try-catch
          }
        })
      );

      console.log("[FolderContentModal] All tasks processed successfully:", {
        totalItems: transformedItems.length,
        items: transformedItems.map((item) => ({
          id: item.id,
          name: item.name,
          documentCount: item.documents.length,
          taskStepCount: item.tasks.length,
        })),
      });

      setFolderItems(transformedItems);
      console.log(
        "[FolderContentModal] Folder items state updated successfully"
      );
    } catch (error) {
      console.error("[FolderContentModal] Comprehensive error details:", {
        error: error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        folderId: folder.id,
        folderTitle: folder.title,
      });

      // Show more specific error message
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to load folder content: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      console.log("[FolderContentModal] Loading state set to false");
    }
  };

  // Check if file is AI-indexable
  const isAiIndexable = (fileName: string): boolean => {
    const fileExt = "." + fileName.split(".").pop()?.toLowerCase();
    return [".pdf", ".json", ".md"].includes(fileExt);
  };

  // Delete material handler
  const handleDeleteMaterial = async (materialId: number, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?\n\nThis will remove it from storage and the AI chatbot will no longer reference it.`)) {
      return;
    }

    setDeletingMaterialId(materialId);
    try {
      await materialService.delete(materialId);

      toast.success("Material deleted successfully!", {
        description: isAiIndexable(fileName)
          ? "Document removed from storage and AI index"
          : "Document removed from storage",
      });

      // Reload folder content
      await loadFolderContent();
    } catch (error: any) {
      console.error("Failed to delete material:", error);
      toast.error("Failed to delete material", {
        description: error.message || "An error occurred while deleting",
      });
    } finally {
      setDeletingMaterialId(null);
    }
  };

  // Replace material handler
  const handleReplaceMaterial = async (materialId: number, oldFileName: string, newFile: File) => {
    if (!newFile) return;

    // Validate file type
    const fileExt = "." + newFile.name.split(".").pop()?.toLowerCase();
    if (![".pdf", ".json", ".md"].includes(fileExt)) {
      toast.error("Invalid file type", {
        description: "Only PDF, JSON, and Markdown files are allowed",
      });
      return;
    }

    // Validate file size (10MB)
    if (newFile.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB",
      });
      return;
    }

    setReplacingMaterialId(materialId);
    try {
      // Get the task ID for this material
      const taskId = parseInt(selectedItem?.id || "0");

      // Delete old material
      await materialService.delete(materialId);

      // Upload new material
      await materialService.upload(taskId, newFile);

      const wasIndexable = isAiIndexable(oldFileName);
      const isNewIndexable = isAiIndexable(newFile.name);

      toast.success("Material replaced successfully!", {
        description: isNewIndexable
          ? "New document uploaded and indexed for AI search"
          : wasIndexable
          ? "New document uploaded (old AI index removed)"
          : "New document uploaded to storage",
      });

      // Reload folder content
      await loadFolderContent();
    } catch (error: any) {
      console.error("Failed to replace material:", error);
      toast.error("Failed to replace material", {
        description: error.message || "An error occurred while replacing",
      });
    } finally {
      setReplacingMaterialId(null);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Trigger file selection for replacement
  const triggerFileReplace = (materialId: number) => {
    setReplacingMaterialId(materialId);
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[750px] h-[92vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle>{folder?.title || "Folder Contents"}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-6 h-[75vh] overflow-hidden pt-4">
          {/* Left Panel - Item List */}
          <div className="w-96 shrink-0 space-y-3 overflow-y-auto pr-2">
            <h3 className="font-semibold text-sm text-gray-700 mb-4">
              Folder Contents
            </h3>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Loading folder content...</p>
              </div>
            ) : folderItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No tasks found in this folder.</p>
              </div>
            ) : (
              folderItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    selectedItem?.id === item.id
                      ? "border-indigo-500 bg-indigo-50 shadow-sm"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Right Panel - Item Details */}
          <div className="flex-1 overflow-y-auto">
            {selectedItem ? (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {selectedItem.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Created Date */}
                <div>
                  <h3 className="font-semibold text-sm mb-1">Created Date</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Tasks to Complete */}
                <div>
                  <h3 className="font-semibold text-sm mb-3">
                    Tasks to Complete
                  </h3>
                  {selectedItem.tasks.length === 0 ? (
                    <div className="text-center py-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-700">
                        No steps have been added yet
                      </p>
                      <p className="text-xs text-amber-600 mt-1">
                        Steps should be added when uploading documents
                      </p>
                    </div>
                  ) : (
                    <ol className="space-y-2">
                      {selectedItem.tasks.map((task, index) => (
                        <li key={index} className="flex gap-3 text-sm">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 pt-0.5">{task}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                {/* Documents */}
                {selectedItem.documents &&
                  selectedItem.documents.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-sm mb-3">Documents</h3>
                      <div className="space-y-2">
                        {selectedItem.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm text-gray-700 block truncate">
                                  {doc.name}
                                </span>
                                {isAiIndexable(doc.name) && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Sparkles size={10} className="text-purple-500" />
                                    <span className="text-xs text-purple-600">
                                      AI-Searchable
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 px-3"
                                onClick={() =>
                                  doc.downloadUrl &&
                                  window.open(doc.downloadUrl, "_blank")
                                }
                                title="Download file"
                              >
                                Download
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-8 px-2"
                                onClick={() => triggerFileReplace(doc.id)}
                                disabled={replacingMaterialId === doc.id}
                                title="Replace with new file"
                              >
                                {replacingMaterialId === doc.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <RefreshCw className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                onClick={() => handleDeleteMaterial(doc.id, doc.name)}
                                disabled={deletingMaterialId === doc.id}
                                title="Delete file"
                              >
                                {deletingMaterialId === doc.id ? (
                                  <Trash2 className="w-4 h-4 animate-pulse" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      if (selectedItem) {
                        setEditingTaskId(parseInt(selectedItem.id));
                        setEditModalOpen(true);
                      }
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="outline">Need Help?</Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FileText className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-gray-500">Select an item to view details</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Task Edit Modal */}
      {editingTaskId && (
        <TaskEditModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          taskId={editingTaskId}
          onSuccess={() => {
            loadFolderContent();
            toast.success("Task updated successfully!");
          }}
        />
      )}

      {/* Hidden file input for material replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.json,.md"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && replacingMaterialId) {
            const file = e.target.files[0];
            const material = selectedItem?.documents.find(d => d.id === replacingMaterialId);
            if (material) {
              handleReplaceMaterial(replacingMaterialId, material.name, file);
            }
          }
        }}
      />
    </Dialog>
  );
}
