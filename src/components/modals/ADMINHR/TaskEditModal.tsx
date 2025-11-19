import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Sparkles, FileWarning } from "lucide-react";
import { toast } from "sonner";
import {
  taskService,
  stepService,
  materialService,
} from "@/lib/api/Onboardin/onboardingService";
import type {
  OnboardingTask,
  OnboardingStep,
  OnboardingMaterial,
} from "@/lib/api/Onboardin/onboardingService";

interface TaskEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number;
  onSuccess?: () => void;
}

export function TaskEditModal({
  open,
  onOpenChange,
  taskId,
  onSuccess,
}: TaskEditModalProps) {
  const [task, setTask] = useState<OnboardingTask | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [existingSteps, setExistingSteps] = useState<OnboardingStep[]>([]);
  const [materials, setMaterials] = useState<OnboardingMaterial[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // AI-indexable file types
  const aiIndexableTypes = [".pdf", ".json", ".md"];
  const allowedTypes = [".pdf", ".json", ".md"];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

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

  useEffect(() => {
    if (open && taskId) {
      loadTaskData();
    }
  }, [open, taskId]);

  const loadTaskData = async () => {
    setIsLoading(true);
    try {
      const [taskData, stepsData, materialsData] = await Promise.all([
        taskService.getById(taskId),
        stepService.getByTaskId(taskId),
        materialService.getByTaskId(taskId),
      ]);

      setTask(taskData);
      setExistingSteps(stepsData.sort((a, b) => a.seqOrder - b.seqOrder));
      setSteps(stepsData.map((s) => s.stepDescription));
      setMaterials(materialsData);
    } catch (error) {
      console.error("Failed to load task data:", error);
      toast.error("Failed to load task details");
    } finally {
      setIsLoading(false);
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

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleDeleteMaterial = async (materialId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await materialService.delete(materialId);
      setMaterials(materials.filter((m) => m.id !== materialId));
      toast.success("Document deleted successfully");
    } catch (error) {
      toast.error("Failed to delete document");
    }
  };

  const handleSave = async () => {
    if (!task) return;

    // Validate steps
    const nonEmptySteps = steps.filter((step) => step.trim() !== "");
    if (nonEmptySteps.length === 0) {
      toast.error("Steps required", {
        description: "Please add at least one step",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Update task details
      await taskService.update(taskId, {
        Title: task.title,
        Description: task.description,
      });

      // Delete all existing steps
      for (const step of existingSteps) {
        await stepService.delete(step.id);
      }

      // Create new steps
      for (let i = 0; i < nonEmptySteps.length; i++) {
        await stepService.create({
          StepDescription: nonEmptySteps[i],
          TaskId: taskId,
          SequenceOrder: i + 1,
        });
      }

      // Upload new document if selected
      if (selectedFile) {
        await materialService.upload(taskId, selectedFile);
        toast.success("Document uploaded successfully");
      }

      toast.success("Task updated successfully!");
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[450px] h-[92vh] overflow-y-auto rounded-xl">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading task details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" w-[450px] h-[72vh] overflow-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Task: {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 ">
          {/* Task Title */}
          <div>
            <Label htmlFor="title" className="text-sm">
              Task Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Task Description */}
          <div>
            <Label htmlFor="description" className="text-sm">
              Description <span className="text-red-500">*</span>
            </Label>
            <Input
              id="description"
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
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
              {steps.map((step, index) => (
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

          {/* Existing Documents */}
          {materials.length > 0 && (
            <div>
              <Label className="text-sm mb-2 block">Existing Documents</Label>
              <div className="space-y-2">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {material.fileName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Document */}
          <div>
            <Label className="text-sm">
              Upload Additional Document (Optional)
            </Label>
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
              onClick={() =>
                document.getElementById("file-upload-edit")?.click()
              }
            >
              <input
                id="file-upload-edit"
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
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2 ">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="px-6 bg-green-600 hover:bg-green-700"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
