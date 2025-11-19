import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  folderService,
  taskService,
  type OnboardingFolder,
  type OnboardingTask,
} from "@/lib/api/Onboardin/onboardingService";
import { toast } from "sonner";

export type FolderModalType = "add" | "edit";

interface FolderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: FolderModalType;
  folder?: OnboardingFolder;
  onSave?: (folder: OnboardingFolder) => void;
}

export function FolderModal({
  open,
  onOpenChange,
  type,
  folder,
  onSave,
}: FolderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<{ title: string; description: string }[]>(
    []
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  useEffect(() => {
    if (open && type === "edit" && folder) {
      loadTasks();
    } else if (open && type === "add") {
      setTasks([]);
    }
  }, [open, type, folder]);

  const loadTasks = async () => {
    if (!folder) return;
    try {
      const existingTasks = await taskService.getByFolderId(folder.id);
      setTasks(
        existingTasks.map((task) => ({
          title: task.title,
          description: task.description,
        }))
      );
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "add":
        return "Add New Folder";
      case "edit":
        return "Edit Folder";
      default:
        return "";
    }
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([
        ...tasks,
        { title: newTaskTitle.trim(), description: newTaskDescription.trim() },
      ]);
      setNewTaskTitle("");
      setNewTaskDescription("");
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("[FolderModal] Save process starting...", {
      type,
      taskCount: tasks.length,
      tasks: tasks.map((t) => ({ title: t.title, description: t.description })),
      folderId: folder?.id,
    });

    if (tasks.length === 0) {
      console.log("[FolderModal] Validation failed: No tasks provided");
      toast.error("Please add at least one task");
      return;
    }

    setIsLoading(true);

    try {
      console.log("[FolderModal] Step 1: Processing form data...");
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      };
      console.log("[FolderModal] Form data processed:", data);

      let savedFolder: OnboardingFolder;

      if (type === "edit" && folder) {
        console.log(
          "[FolderModal] Step 2a: Updating existing folder...",
          folder.id
        );
        try {
          savedFolder = await folderService.update(folder.id, data);
          console.log("[FolderModal] Folder updated successfully:", {
            id: savedFolder.id,
            title: savedFolder.title,
          });
          toast.success("Folder updated successfully!");
        } catch (updateError) {
          console.error("[FolderModal] Failed to update folder:", updateError);
          throw updateError;
        }
      } else {
        console.log("[FolderModal] Step 2b: Creating new folder...");
        try {
          savedFolder = await folderService.create(data);
          console.log("[FolderModal] Folder created successfully:", {
            id: savedFolder.id,
            title: savedFolder.title,
          });
          toast.success("Folder created successfully!");
        } catch (createError) {
          console.error("[FolderModal] Failed to create folder:", createError);
          throw createError;
        }
      }

      // Handle tasks
      if (type === "edit" && folder) {
        console.log(
          "[FolderModal] Step 3a: Deleting existing tasks for edit mode..."
        );
        try {
          const existingTasks = await taskService.getByFolderId(folder.id);
          console.log("[FolderModal] Found existing tasks to delete:", {
            count: existingTasks.length,
            taskIds: existingTasks.map((t) => t.id),
          });

          if (existingTasks.length > 0) {
            const deleteResults = await Promise.allSettled(
              existingTasks.map((task) => taskService.delete(task.id))
            );

            console.log(
              "[FolderModal] Delete results:",
              deleteResults.map((result, index) => ({
                taskId: existingTasks[index].id,
                status: result.status,
                error: result.status === "rejected" ? result.reason : null,
              }))
            );
          }
        } catch (deleteError) {
          console.error(
            "[FolderModal] Error during task deletion:",
            deleteError
          );
          // Continue with task creation even if deletion fails
        }
      }

      // Create new tasks
      console.log("[FolderModal] Step 4: Creating new tasks...", {
        taskCount: tasks.length,
        folderId: savedFolder.id,
      });

      const taskCreationPromises = tasks.map(async (task, index) => {
        const taskData = {
          title: task.title,
          description: task.description,
          folderId: savedFolder.id,
        };

        console.log(
          `[FolderModal] Creating task ${index + 1}/${tasks.length}:`,
          {
            ...taskData,
            taskObject: task,
          }
        );

        try {
          console.log(`[FolderModal] Sending task data to API:`, taskData);
          const createdTask = await taskService.create(taskData);

          console.log(`[FolderModal] Task ${index + 1} created successfully:`, {
            id: createdTask.id,
            title: createdTask.title,
            folderId: createdTask.folderId,
          });

          return createdTask;
        } catch (taskError) {
          console.error(`[FolderModal] Failed to create task ${index + 1}:`, {
            task: task,
            taskData: taskData,
            error: taskError,
            message:
              taskError instanceof Error ? taskError.message : "Unknown error",
            stack: taskError instanceof Error ? taskError.stack : undefined,
          });
          throw taskError; // Re-throw to be caught by Promise.allSettled
        }
      });

      const taskResults = await Promise.allSettled(taskCreationPromises);

      console.log("[FolderModal] Task creation completed:", {
        totalTasks: taskResults.length,
        successfulTasks: taskResults.filter((r) => r.status === "fulfilled")
          .length,
        failedTasks: taskResults.filter((r) => r.status === "rejected").length,
        results: taskResults.map((result, index) => ({
          taskIndex: index,
          taskTitle: tasks[index].title,
          status: result.status,
          error: result.status === "rejected" ? result.reason : null,
          createdTask:
            result.status === "fulfilled"
              ? {
                  id: result.value.id,
                  title: result.value.title,
                }
              : null,
        })),
      });

      const failedTasks = taskResults.filter((r) => r.status === "rejected");
      if (failedTasks.length > 0) {
        console.error(
          "[FolderModal] Some tasks failed to create:",
          failedTasks.map((f) => f.reason)
        );
        // Don't throw error here - folder was created successfully, just some tasks failed
        toast.warning(
          `${failedTasks.length} out of ${tasks.length} tasks failed to create`
        );
      }

      // Call parent onSave callback
      if (onSave) {
        console.log("[FolderModal] Step 5: Calling parent onSave callback...");
        onSave(savedFolder);
      }

      console.log("[FolderModal] Save process completed successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("[FolderModal] Save process failed:", {
        error: error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        type,
        folderId: folder?.id,
      });

      toast.error("Failed to save folder", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
      console.log("[FolderModal] Loading state set to false");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-5xl mx-auto p-6 rounded-xl overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Folder Title
              </label>
              <input
                name="title"
                type="text"
                defaultValue={type === "edit" ? folder?.title : ""}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter folder title"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={type === "edit" ? folder?.description || "" : ""}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter folder description"
                rows={3}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tasks
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task title"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task description (optional)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={addTask}
                    disabled={isLoading || !newTaskTitle.trim()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {tasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{task.title}</span>
                        {task.description && (
                          <span className="text-sm text-gray-600 ml-2">
                            - {task.description}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Saving..."
                  : type === "add"
                  ? "Add Folder"
                  : "Update Folder"}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
