import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Square, CheckSquare } from "lucide-react";
import {
  taskService,
  stepService,
  materialService,
  progressService,
  type OnboardingTask,
  type OnboardingStep,
  type OnboardingMaterial,
} from "@/lib/api/Onboardin/onboardingService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface TaskProgressContentProps {
  folderId: number;
  folderTitle: string;
}

interface TaskWithDetails {
  task: OnboardingTask;
  steps: OnboardingStep[];
  materials: OnboardingMaterial[];
  completedSteps: Set<number>;
  isTaskComplete: boolean;
}

export function TaskProgressContent({
  folderId,
  folderTitle,
}: TaskProgressContentProps) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskWithDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (folderId && user?.id) {
      loadTasks();
    }
  }, [folderId, user?.id]);

  const loadTasks = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Get all tasks for this folder
      const folderTasks = await taskService.getByFolderId(folderId);

      // Load details for each task
      const tasksWithDetails = await Promise.all(
        folderTasks.map(async (task) => {
          const [steps, materials] = await Promise.all([
            stepService.getByTaskId(task.id),
            materialService.getByTaskId(task.id),
          ]);

          // Get user progress for this task
          const progress = progressService.getTaskProgress(user.id, task.id);

          return {
            task,
            steps: steps.sort((a, b) => a.seqOrder - b.seqOrder),
            materials,
            completedSteps: new Set(progress.completedSteps),
            isTaskComplete: progress.status === "completed",
          };
        })
      );

      setTasks(tasksWithDetails);

      // Auto-select first task if available
      if (tasksWithDetails.length > 0 && !selectedTask) {
        setSelectedTask(tasksWithDetails[0]);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepToggle = (stepId: number) => {
    if (!user?.id || !selectedTask) return;

    // Toggle step completion
    progressService.toggleStep(user.id, selectedTask.task.id, stepId);

    // Update local state
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.task.id === selectedTask.task.id) {
          const newCompletedSteps = new Set(t.completedSteps);
          if (newCompletedSteps.has(stepId)) {
            newCompletedSteps.delete(stepId);
          } else {
            newCompletedSteps.add(stepId);
          }
          return { ...t, completedSteps: newCompletedSteps };
        }
        return t;
      })
    );

    // Update selected task
    setSelectedTask((prev) => {
      if (!prev) return null;
      const newCompletedSteps = new Set(prev.completedSteps);
      if (newCompletedSteps.has(stepId)) {
        newCompletedSteps.delete(stepId);
      } else {
        newCompletedSteps.add(stepId);
      }
      return { ...prev, completedSteps: newCompletedSteps };
    });
  };

  const handleMarkTaskComplete = () => {
    if (!user?.id || !selectedTask) return;

    // Check if all steps are completed
    const allStepsCompleted =
      selectedTask.steps.length > 0 &&
      selectedTask.steps.every((step) =>
        selectedTask.completedSteps.has(step.id)
      );

    if (!allStepsCompleted) {
      toast.error("Please complete all steps first");
      return;
    }

    // Mark task as complete
    progressService.markTaskComplete(user.id, selectedTask.task.id);

    // Update local state
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.task.id === selectedTask.task.id ? { ...t, isTaskComplete: true } : t
      )
    );

    setSelectedTask((prev) =>
      prev ? { ...prev, isTaskComplete: true } : null
    );

    toast.success("Task marked as complete!");
  };

  const getTaskStatus = (task: TaskWithDetails): string => {
    if (task.isTaskComplete) return "completed";
    if (task.completedSteps.size === 0) return "pending";
    return "in progress";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 text-sm mt-2">
            HR has not uploaded any tasks for this folder yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Left Panel - Task List */}
      <div className="w-80 shrink-0 overflow-y-auto pr-4">
        <h3 className="font-semibold text-gray-700 mb-4">
          Task & Requirements
        </h3>
        <div className="space-y-3">
          {tasks.map((taskItem) => {
            const status = getTaskStatus(taskItem);

            return (
              <button
                key={taskItem.task.id}
                onClick={() => setSelectedTask(taskItem)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTask?.task.id === taskItem.task.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium text-sm">
                    {taskItem.task.title}
                  </span>
                  <Badge
                    variant={
                      status === "completed"
                        ? "default"
                        : status === "in progress"
                        ? "secondary"
                        : "outline"
                    }
                    className={
                      status === "completed"
                        ? "bg-green-500 text-white"
                        : status === "in progress"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }
                  >
                    {status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  {taskItem.task.description}
                </p>
                {taskItem.task.createdAt && (
                  <p className="text-xs text-gray-500">
                    Due:{" "}
                    {new Date(taskItem.task.createdAt).toLocaleDateString()}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Task Details */}
      <div className="flex-1 overflow-y-auto">
        {selectedTask ? (
          <div className="space-y-6">
            {/* Task Header */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {selectedTask.task.title}
              </h2>
              <p className="text-gray-600">{selectedTask.task.description}</p>
            </div>

            {/* Due Date */}
            {selectedTask.task.createdAt && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-1">
                  Due Date
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(selectedTask.task.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            )}

            {/* Steps to Complete */}
            <div>
              <h3 className="font-semibold text-sm text-gray-700 mb-3">
                Steps to Complete
              </h3>
              {selectedTask.steps.length === 0 ? (
                <div className="text-center py-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700">
                    No steps have been added yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedTask.steps.map((step, index) => {
                    const isCompleted = selectedTask.completedSteps.has(
                      step.id
                    );
                    return (
                      <div
                        key={step.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-green-50 border-green-200"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          !selectedTask.isTaskComplete &&
                          handleStepToggle(step.id)
                        }
                      >
                        <button
                          className="mt-1 shrink-0"
                          disabled={selectedTask.isTaskComplete}
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-5 h-5 text-green-600" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">
                              {index + 1}.
                            </span>
                            <span
                              className={`text-sm ${
                                isCompleted
                                  ? "text-gray-500 line-through"
                                  : "text-gray-700"
                              }`}
                            >
                              {step.stepDescription}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Required Documents */}
            {selectedTask.materials.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mb-3">
                  Required Documents
                </h3>
                <div className="space-y-2">
                  {selectedTask.materials.map((material) => (
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
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() =>
                          material.url && window.open(material.url, "_blank")
                        }
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleMarkTaskComplete}
                disabled={
                  selectedTask.isTaskComplete ||
                  selectedTask.steps.length === 0 ||
                  !selectedTask.steps.every((step) =>
                    selectedTask.completedSteps.has(step.id)
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {selectedTask.isTaskComplete ? "Completed ✓" : "Start Task"}
              </Button>
              <Button variant="outline">Need Help?</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Select a task to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
