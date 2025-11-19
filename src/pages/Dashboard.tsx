import { useState, useEffect } from "react";
import HeaderLayout from "@/components/layout/HeaderLayout";
import { useNavigate } from "react-router-dom";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { TaskModal, type TaskCategory } from "@/components/modals/TaskModal";
import ChatbotAssistant from "@/components/chatbotkilid/ChatbotAssistant";
import { apiClient } from "@/lib/api";
import {
  folderService,
  taskService,
  progressService,
  stepService,
} from "@/lib/api/Onboardin/onboardingService";
import type { OnboardingFolder } from "@/lib/api/Onboardin/onboardingService";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState<string>("Guest");
  const [userId, setUserId] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<TaskCategory | null>(
    null
  );
  const [selectedFolderId, setSelectedFolderId] = useState<
    number | undefined
  >();
  const [selectedFolderTitle, setSelectedFolderTitle] = useState<
    string | undefined
  >();
  const [folders, setFolders] = useState<OnboardingFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch user data
        const user = await apiClient.getCurrentUser();
        setUsername(user.firstName || user.userName || "Guest");
        setUserId(user.id);

        // Fetch folders from backend
        const foldersData = await folderService.getAll();
        setFolders(foldersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setUsername("Guest");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (
    category: TaskCategory,
    folderId: number,
    folderTitle: string
  ) => {
    setActiveCategory(category);
    setSelectedFolderId(folderId);
    setSelectedFolderTitle(folderTitle);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      // Trigger progress refresh when modal closes
      setRefreshKey((prev) => prev + 1);
    }
  };

  // (Folder progress is computed inline in loadProgress using per-step counts)

  // Map folder title to category type
  const getCategoryFromTitle = (title: string): TaskCategory => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("government") || lowerTitle.includes("forms")) {
      return "government-forms";
    }
    if (lowerTitle.includes("hr") || lowerTitle.includes("policies")) {
      return "hr-policies";
    }
    if (lowerTitle.includes("it") || lowerTitle.includes("setup")) {
      return "it-setup";
    }
    if (lowerTitle.includes("training") || lowerTitle.includes("program")) {
      return "training-programs";
    }
    if (
      lowerTitle.includes("department") ||
      lowerTitle.includes("orientation")
    ) {
      return "department-orientation";
    }
    if (
      lowerTitle.includes("documentation") ||
      lowerTitle.includes("document")
    ) {
      return "documentation";
    }
    return "documentation"; // default
  };

  // Map folders to quick actions with real progress
  const [quickActions, setQuickActions] = useState<
    Array<{
      category: TaskCategory;
      title: string;
      description: string;
      progress: number;
      folderId: number;
    }>
  >([]);

  useEffect(() => {
    const loadProgress = async () => {
      if (!userId || folders.length === 0) return;

      let totalSteps = 0;
      let completedSteps = 0;

      const actionsWithProgress = await Promise.all(
        folders.map(async (folder) => {
          // Get all tasks for this folder to count steps
          const tasks = await taskService.getByFolderId(folder.id);

          let folderTotalSteps = 0;
          let folderCompletedSteps = 0;

          for (const task of tasks) {
            // Get steps for each task
            const steps = await stepService.getByTaskId(task.id);
            folderTotalSteps += steps.length;
            totalSteps += steps.length;

            // Get user progress for this task
            const taskProgress = progressService.getTaskProgress(
              userId,
              task.id
            );
            folderCompletedSteps += taskProgress.completedSteps.length;
            completedSteps += taskProgress.completedSteps.length;
          }

          const folderProgress =
            folderTotalSteps > 0
              ? Math.round((folderCompletedSteps / folderTotalSteps) * 100)
              : 0;

          return {
            category: getCategoryFromTitle(folder.title),
            title: folder.title,
            description: folder.description,
            progress: folderProgress,
            folderId: folder.id,
          };
        })
      );

      setQuickActions(actionsWithProgress);

      // Calculate overall progress percentage
      const overallPercentage =
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
      setOverallProgress(overallPercentage);
    };

    loadProgress();
  }, [userId, folders, refreshKey]);

  // Subscribe to local progress changes so Quick Actions update in real-time
  useEffect(() => {
    if (!userId) return;
    const unsubscribe = progressService.subscribe(() => {
      // trigger reload of quick actions and overall progress
      setRefreshKey((k) => k + 1);
    });
    return () => {
      unsubscribe();
    };
  }, [userId]);

  return (
    <HeaderLayout>
      {/* Main Content */}
      <div className="px-6 py-6 ">
        {/* Welcome Section */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Welcome back, {username}</p>

          {/* Navigation Tabs */}
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button className="pb-3 px-1 text-indigo-600 border-b-2 border-indigo-600 font-medium">
              Dashboard
            </button>
            <button
              onClick={() => navigate("/AIassistant")}
              className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
            >
              AI Assistant
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="pb-3 px-1 text-gray-600 hover:text-gray-800 font-medium"
            >
              Profile
            </button>
          </div>

          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to N-PAX, {username}!
            </h1>
            <p className="text-gray-600">
              You're part of the Advanced Analytics Digital Transformation team.
              Let's get you fully onboarded!
            </p>
          </div>

          {/* Onboarding Progress */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-indigo-600">
                Onboarding Progress
              </h2>
              <span className="text-sm font-medium text-gray-700">
                {overallProgress}% Complete
              </span>
            </div>
            <Progress value={overallProgress} className="w-full" />
          </div>
        </div>

        {/* The Main Content */}
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>

          {/* Grid of Cards */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">
                Loading onboarding tasks...
              </span>
            </div>
          ) : quickActions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500 text-lg">
                No onboarding tasks available yet
              </p>
              <p className="text-gray-400 text-sm mt-2">
                HR will upload tasks soon
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.folderId}
                  title={action.title}
                  description={action.description}
                  progress={action.progress}
                  onClick={() =>
                    openModal(action.category, action.folderId, action.title)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        category={activeCategory}
        folderId={selectedFolderId}
        folderTitle={selectedFolderTitle}
      />

      {/* AI Assistant Button (Bottom Right) */}
      <ChatbotAssistant />
    </HeaderLayout>
  );
}
