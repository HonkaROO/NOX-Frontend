// components/UploadDocumentDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Sparkles, FileWarning } from "lucide-react";
import { toast } from "sonner";
import {
  materialService,
  folderService,
  taskService,
  stepService,
} from "@/lib/api/Onboardin/onboardingService";
import type {
  OnboardingFolder,
  OnboardingTask,
} from "@/lib/api/Onboardin/onboardingService";
import { chromaDBService } from "@/lib/api/ChatBot/InjectionService";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UploadDocumentDialog({
  open,
  onOpenChange,
}: UploadDocumentDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    dueDate: "",
    steps: [] as string[],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Folder and Task selection
  const [folders, setFolders] = useState<OnboardingFolder[]>([]);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // AI-indexable file types (supported by Noxy AI backend)
  const aiIndexableTypes = [".pdf", ".json", ".md"];
  const allowedTypes = [".pdf", ".json", ".md"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Check if file is AI-indexable
  const isAiIndexable = (fileName: string): boolean => {
    const fileExt = "." + fileName.split(".").pop()?.toLowerCase();
    return aiIndexableTypes.includes(fileExt);
  };

  const validateFile = (file: File): boolean => {
    const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExt)) {
      toast.error("Invalid file type", {
        description: "Only PDF, JSON, and Markdown files are allowed",
      });
      return false;
    }
    if (file.size > maxFileSize) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB",
      });
      return false;
    }
    return true;
  };

  // Load folders on modal open
  useEffect(() => {
    if (open) {
      loadFolders();
    }
  }, [open]);

  // Load tasks when folder is selected
  useEffect(() => {
    if (selectedFolderId) {
      loadTasks(parseInt(selectedFolderId));
    } else {
      setTasks([]);
      setSelectedTaskId("");
    }
  }, [selectedFolderId]);

  const loadFolders = async () => {
    setIsLoadingFolders(true);
    try {
      const data = await folderService.getAll();
      setFolders(data);
    } catch (error) {
      toast.error("Failed to load folders");
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const loadTasks = async (folderId: number) => {
    setIsLoadingTasks(true);
    try {
      const data = await taskService.getByFolderId(folderId);
      setTasks(data);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      const isIndexable = isAiIndexable(file.name);
      toast.success("File selected", {
        description: isIndexable
          ? `${file.name} - Will be AI-searchable ✨`
          : `${file.name} - Stored but not AI-searchable`,
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedFile) {
      toast.error("No file selected", {
        description: "Please select a file to upload",
      });
      return;
    }

    if (!selectedTaskId) {
      toast.error("Task required", {
        description: "Please select a folder and task",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title required", {
        description: "Please enter a document title",
      });
      return;
    }

    // Validate steps
    const nonEmptySteps = formData.steps.filter((step) => step.trim() !== "");
    if (nonEmptySteps.length === 0) {
      toast.error("Steps required", {
        description: "Please add at least one step to complete this task",
      });
      return;
    }

    setIsUploading(true);

    try {
      const taskId = parseInt(selectedTaskId);

      // Step 1: Upload to NOX-Backend (Azure Blob Storage)
      const uploadedMaterial = await materialService.upload(
        taskId,
        selectedFile
      );

      // Save steps to the task
      const nonEmptySteps = formData.steps.filter((step) => step.trim() !== "");
      for (let i = 0; i < nonEmptySteps.length; i++) {
        await stepService.create({
          StepDescription: nonEmptySteps[i],
          TaskId: taskId,
          SequenceOrder: i + 1,
        });
      }

      const isIndexable = isAiIndexable(selectedFile.name);

      // Step 2: Auto-inject to AI knowledge base if file is AI-indexable
      if (isIndexable && uploadedMaterial.url) {
        try {
          const injectionResult = await chromaDBService.injectDocument(
            uploadedMaterial.url
          );

          if (injectionResult.success) {
            toast.success("Document uploaded & injected successfully!", {
              description: `File uploaded with steps and ${injectionResult.documents_added} chunks injected into AI knowledge base ✨`,
            });
          } else {
            toast.success("Document uploaded successfully!", {
              description:
                "File uploaded with steps, but AI injection failed. You can manually inject it later.",
            });
          }
        } catch (injectionError) {
          console.error("AI injection error:", injectionError);
          toast.success("Document uploaded successfully!", {
            description:
              "File uploaded with steps, but AI injection failed. You can manually inject it later.",
          });
        }
      } else {
        toast.success("Document uploaded successfully!", {
          description: isIndexable
            ? "File uploaded with steps"
            : "File uploaded with steps (not AI-indexable format)",
        });
      }

      // Reset form
      setFormData({
        title: "",
        type: "",
        description: "",
        dueDate: "",
        steps: [],
      });
      setSelectedFile(null);
      setSelectedFolderId("");
      setSelectedTaskId("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "Failed to upload document",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ""] });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[450px] h-[92vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Upload Document
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Folder Selection */}
          <div>
            <Label htmlFor="folder" className="text-sm">
              Select Folder <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedFolderId}
              onValueChange={setSelectedFolderId}
              disabled={isLoadingFolders}
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={
                    isLoadingFolders ? "Loading folders..." : "Select folder"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id.toString()}>
                    {folder.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Selection */}
          <div>
            <Label htmlFor="task" className="text-sm">
              Select Task <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedTaskId}
              onValueChange={setSelectedTaskId}
              disabled={!selectedFolderId || isLoadingTasks}
            >
              <SelectTrigger className="mt-1">
                <SelectValue
                  placeholder={
                    !selectedFolderId
                      ? "Select folder first"
                      : isLoadingTasks
                      ? "Loading tasks..."
                      : "Select task"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tasks.map((task) => (
                  <SelectItem key={task.id} value={task.id.toString()}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document Title */}
          <div>
            <Label htmlFor="title" className="text-sm">
              Document Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1"
            />
          </div>

          {/* Document Type */}
          <div>
            <Label htmlFor="type" className="text-sm">
              Document Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Government">Government</SelectItem>
                <SelectItem value="Department">Department</SelectItem>
                <SelectItem value="IT Setup">IT Setup</SelectItem>
                <SelectItem value="HR Policies">HR Policies</SelectItem>
                <SelectItem value="Training Programs">
                  Training Programs
                </SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Short Description */}
          <div>
            <Label htmlFor="description" className="text-sm">
              Short Description
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1"
            />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="dueDate" className="text-sm">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              placeholder="e.g., October 20, 2025"
              className="mt-1"
            />
          </div>

          {/* Steps To Complete */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">
                Steps To Complete <span className="text-red-500">*</span>
              </Label>
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs"
                onClick={addStep}
              >
                + Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => removeStep(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <Label className="text-sm">Document Upload</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer mt-1 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.json,.md"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="text-green-600" size={32} />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                    {/* AI-Indexable Badge */}
                    {isAiIndexable(selectedFile.name) ? (
                      <div className="flex items-center gap-1 mt-1">
                        <Sparkles size={12} className="text-purple-600" />
                        <span className="text-xs text-purple-600 font-medium">
                          AI-Searchable
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 mt-1">
                        <FileWarning size={12} className="text-amber-600" />
                        <span className="text-xs text-amber-600 font-medium">
                          Storage Only
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, JSON, or Markdown (Max 10MB)
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Sparkles size={12} className="text-purple-400" />
                    <span className="text-xs text-purple-400">
                      These formats will be AI-searchable in chatbot
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-6 bg-green-600 hover:bg-green-700"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
