import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import {
  taskService,
  materialService,
  stepService,
  type OnboardingFolder,
  type OnboardingTask,
  type OnboardingMaterial,
} from "@/lib/api/Onboardin/onboardingService";
import { toast } from "sonner";

interface FolderItem {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  documents: { name: string; downloadUrl?: string }[];
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
    if (!folder) return;

    setIsLoading(true);
    try {
      // Get tasks for the folder
      const tasks = await taskService.getByFolderId(folder.id);

      // Transform tasks to FolderItem format
      const transformedItems: FolderItem[] = await Promise.all(
        tasks.map(async (task) => {
          // Get materials for this task
          const materials = await materialService.getByTaskId(task.id);

          // Get steps for this task
          const steps = await stepService.getByTaskId(task.id);

          return {
            id: task.id.toString(),
            name: task.title,
            description: task.description,
            createdAt: task.createdAt,
            documents: materials.map((material) => ({
              name: material.fileName,
              downloadUrl: material.url,
            })),
            tasks: steps.map((step) => step.stepDescription),
          };
        })
      );

      setFolderItems(transformedItems);
    } catch (error) {
      toast.error("Failed to load folder content");
      console.error("Error loading folder content:", error);
    } finally {
      setIsLoading(false);
    }
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
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">
                                {doc.name}
                              </span>
                            </div>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700"
                              onClick={() => doc.downloadUrl && window.open(doc.downloadUrl, '_blank')}
                            >
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
    </Dialog>
  );
}
